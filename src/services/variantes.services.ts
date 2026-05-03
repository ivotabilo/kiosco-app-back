import { prisma } from "../lib/prismaCliente.js";

export const buscarVariantePorCodigo = async (codigo: string) => {
    // Buscamos en la tabla Variante
    const variante = await prisma.variante.findFirst({
        where: {
            OR: [
                { codigoInterno: codigo },
                { codigoBarras: codigo }
            ]
        },
        // Incluimos el Producto para que el Front pueda mostrar el nombre (ej: "Coca Cola")
        include: {
            producto: true 
        }
    });

    // Si no existe, lanzamos el error que el controlador atrapará
    if (!variante) {
        throw { code: 'NOT_FOUND_VARIANTE', message: "El código ingresado no existe." };
    }

    return variante;
};
export const modificarVariante = async (idVariante: number, datos: any) => {
    if (!idVariante) throw { code: 'ID_REQUERIDO', message: "ID de variante necesario." };

    return await prisma.variante.update({
        where: { idVariante },
        data: datos
    });
};