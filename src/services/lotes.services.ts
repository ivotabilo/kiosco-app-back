import { prisma } from "../lib/prismaCliente.js";

export const reponerStock = async (dataLote: any) => {
    const {
        idVariante,      
        proveedorId,     
        cantidadPacks,   
        unidadesPorPack, 
        costoPackBruto,  
        descuentoPorc,   
        fechaVencimiento,
        estadoPago,      
        observaciones
    } = dataLote;

    // 1. VALIDACIÓN DE NEGOCIO
    if (!idVariante || !cantidadPacks || !unidadesPorPack || !costoPackBruto) {
        throw { code: 'DATOS_REPOSICION_REQUERIDOS', message: "Faltan datos de la compra: ID, Packs, Unidades y Costo son obligatorios." };
    }

    // 2. SANITIZACIÓN Y CÁLCULOS
    const n_packs = Number(cantidadPacks);
    const n_unidades = Number(unidadesPorPack);
    const n_bruto = Number(costoPackBruto);
    const n_descuentoPorc = Number(descuentoPorc || 0);

    const cantidadTotal = n_packs * n_unidades;
    const descuentoMonto = n_bruto * n_descuentoPorc;
    const costoIndividual = n_unidades > 0 ? (n_bruto - descuentoMonto) / n_unidades : 0;

    // 3. CREACIÓN (El error, si ocurre, "vuela" al controlador)
    return await prisma.lote.create({
        data: {
            idVariante: Number(idVariante),
            cantidadPacks: n_packs,
            unidadesPorPack: n_unidades,
            cantidadInicial: cantidadTotal,
            cantidadActual: cantidadTotal,
            costoPackBruto: n_bruto,
            descuentoPorc: n_descuentoPorc,
            descuentoMonto,
            costoIndividual,
            estadoPago: estadoPago || "PAGADO",
            observaciones: observaciones || "Reposición de stock",
            fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
            proveedorId: proveedorId ? Number(proveedorId) : null,
            fechaHora: new Date()
        }
    });
};
export const modificarLote = async (idLote: number, datos: any) => {
    if (!idLote) throw { code: 'ID_LOTE_REQUERIDO', message: "El ID del lote es necesario para modificarlo." };

    // Prisma lanzará P2025 automáticamente si no existe el ID
    return await prisma.lote.update({
        where: { idLote },
        data: datos
    });
};

export const eliminarLote = async (idLote: number) => {
    if (!idLote) throw { code: 'ID_LOTE_REQUERIDO', message: "El ID del lote es necesario para eliminarlo." };

    // 1. Verificamos si el lote ya tiene ventas asociadas
    const loteConVentas = await prisma.lote.findUnique({
        where: { idLote },
        include: { _count: { select: { detalles: true } } }
    });

    if (loteConVentas?._count.detalles && loteConVentas._count.detalles > 0) {
        throw { 
            code: 'LOTE_CON_VENTAS', 
            message: "No se puede eliminar un lote que ya tiene ventas registradas. Debes anularlo manualmente." 
        };
    }

    return await prisma.lote.delete({
        where: { idLote }
    });
};
