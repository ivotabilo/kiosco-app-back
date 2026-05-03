import { prisma } from "../lib/prismaCliente.js";

export const crearNewProduct = async (dataProducto: any) => {
    const {
        nombre, codigoRaiz, marcaId, proveedorId, codigoInterno, codigoBarras,
        descripcion, precioSugerido, precioVentaU, precioVentaPack,
        minimoParaReponer, limiteCritico, cantidadPacks, unidadesPorPack,
        costoPackBruto, descuentoPorc, fechaVencimiento, estadoPago,
        observaciones, esStockInicial
    } = dataProducto;

    // VALIDACIÓN DE NEGOCIO (Estilo Ventas)
    if (!nombre || !codigoRaiz || !codigoInterno || !precioVentaU) {
        throw { code: 'DATOS_REQUERIDOS', message: "Nombre, Código Raíz, Interno y Precio son obligatorios." };
    }

    if (!esStockInicial && (!cantidadPacks || !unidadesPorPack || !costoPackBruto)) {
        throw { code: 'DATOS_COMPRA_REQUERIDOS', message: "Faltan datos de compra (Packs, Unidades o Costo)." };
    }

    // SANITIZACIÓN Y CÁLCULOS
    const n_packs = Number(cantidadPacks || 1);
    const n_unidades = Number(unidadesPorPack || 0);
    const n_bruto = Number(costoPackBruto || 0);
    const n_descuentoPorc = Number(descuentoPorc || 0);

    const cantidadTotal = n_packs * n_unidades;
    const descuentoMonto = n_bruto * n_descuentoPorc;
    const costoIndividual = n_unidades > 0 ? (n_bruto - descuentoMonto) / n_unidades : 0;

    return await prisma.producto.create({
        data: {
            nombre,
            codigoRaiz,
            marcaId: marcaId ? Number(marcaId) : null,
            variantes: {
                create: [{
                    codigoInterno,
                    codigoBarras: codigoBarras || null,
                    descripcion: descripcion || null,
                    precioSugerido: Number(precioSugerido || 0),
                    precioVentaU: Number(precioVentaU),
                    precioVentaPack: Number(precioVentaPack || 0),
                    minimoParaReponer: Number(minimoParaReponer || 0),
                    limiteCritico: Number(limiteCritico || 0),
                    estado: "ESTABLE",
                    lotes: {
                        create: [{
                            cantidadPacks: n_packs,
                            unidadesPorPack: n_unidades,
                            cantidadInicial: cantidadTotal,
                            cantidadActual: cantidadTotal,
                            costoPackBruto: n_bruto,
                            descuentoPorc: n_descuentoPorc,
                            descuentoMonto,
                            costoIndividual,
                            estadoPago: estadoPago || "PAGADO",
                            observaciones: observaciones || (esStockInicial ? "Carga inicial de stock" : ""),
                            fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
                            proveedorId: proveedorId ? Number(proveedorId) : null,
                            fechaHora: new Date()
                        }]
                    }
                }]
            }
        },
        include: { variantes: { include: { lotes: true } } }
    });
};

export const modificarProducto = async (dataProducto: any) => {
    const { idProducto, ...datosAActualizar } = dataProducto;
    if (!idProducto) throw { code: 'ID_REQUERIDO', message: "El ID del producto es necesario." };
    
    return await prisma.producto.update({
        where: { idProducto },
        data: datosAActualizar 
    });
};

export const eliminarProducto = async (idProducto: number) => {
    if (!idProducto) throw { code: 'ID_REQUERIDO', message: "El ID del producto es necesario." };
    
    return await prisma.producto.delete({
        where: { idProducto }
    });
};


