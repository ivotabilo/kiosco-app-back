import { prisma } from "../lib/prismaCliente.js";

export const crearNewProduct = async (dataProducto: any) => {
    try {
        // 1. DESESTRUCTURACIÓN
        const {
            nombre,
            marcaId,
            proveedorId,
            codigo,
            precioSugerido,
            precioVentaU,
            precioVentaPack,
            minimoParaReponer,
            limiteCritico,
            cantidadPacks,
            unidadesPorPack,
            costoPackBruto,
            descuentoPorc,
            fechaVencimiento,
            estadoPago,
            observaciones
        } = dataProducto;

        // 2. VALIDACIÓN DE SEGURIDAD (Evita que Prisma intente crear datos incompletos)
        if (!nombre || !codigo || !cantidadPacks || !unidadesPorPack || !costoPackBruto) {
            throw new Error("Faltan campos obligatorios: nombre, codigo, cantidad de packs, unidades por pack y costo del pack son requeridos.");
        }

        // 3. SANITIZACIÓN / CONVERSIÓN (Asegura que los cálculos sean matemáticos y no de texto)
        const n_packs = Number(cantidadPacks);
        const n_unidades = Number(unidadesPorPack);
        const n_bruto = Number(costoPackBruto);
        const n_descuentoPorc = Number(descuentoPorc || 0); // Si no hay descuento, es 0

        // 4. CÁLCULOS AUTOMÁTICOS
        const cantidadTotal = n_packs * n_unidades;
        const descuentoMonto = n_bruto * n_descuentoPorc;
        const costoIndividual = (n_bruto - descuentoMonto) / n_unidades;

        // 5. CREACIÓN ANIDADA (MAMUSHKA)
        const product = await prisma.producto.create({
            data: {
                nombre,
                marcaId: marcaId ? Number(marcaId) : null,
                variantes: {
                    create: [{
                        codigo,
                        precioSugerido: Number(precioSugerido || 0),
                        precioVentaU: Number(precioVentaU || 0),
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
                                descuentoMonto: descuentoMonto,
                                costoIndividual: costoIndividual,
                                estadoPago: estadoPago || "PAGADO",
                                observaciones: observaciones || "",
                                fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
                                proveedorId: proveedorId ? Number(proveedorId) : null,
                                fechaHora: new Date()
                            }]
                        }
                    }]
                }
            },
            // Incluimos las relaciones para confirmar que todo se creó bien
            include: {
                variantes: {
                    include: {
                        lotes: true
                    }
                }
            }
        });

        return product;

    } catch (error: any) {
        // MANEJO DE ERRORES ESPECÍFICOS
        if (error.code === 'P2002') {
            throw new Error(`El código de barras "${dataProducto.codigo}" ya existe en el sistema.`);
        }
        
        console.error("Error en crearNewProduct Service:", error.message);
        throw new Error(error.message || "Error interno al procesar el alta del producto.");
    }
};

export const modificarProducto = async (dataProducto: any) => {
    const { idProducto, ...datosAActualizar } = dataProducto;
    const product = await prisma.producto.update({
        where: { idProducto },
        data: datosAActualizar // Actualización flexible (Nombre o Marca)
    });
    return product;
};

export const eliminarProducto = async (idProducto: number) => {
    const product = await prisma.producto.delete({
        where: { idProducto }
    });
    // Nota: Gracias al "onDelete: Cascade" en el schema, esto borra Variantes y Lotes automáticamente.
    return product;
};
