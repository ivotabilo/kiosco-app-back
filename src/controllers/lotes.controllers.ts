import type { Request, Response } from "express";
import * as loteService from "../services/lotes.services.js";

export const reponerStockController = async (req: Request, res: Response) => {
    try {
        const nuevoLote = await loteService.reponerStock(req.body);
        res.status(201).json(nuevoLote);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        // Error de Prisma: Si el idVariante que mandaron no existe en la DB
        if (error.code === 'P2003') {
            codeErrors['VARIANTE_NO_EXISTE'] = "La variante especificada no existe. No se puede cargar stock.";
            return res.status(404).json(codeErrors);
        }

        // Errores manuales de nuestro Service (DATOS_REPOSICION_REQUERIDOS, etc)
        if (error.code) {
            codeErrors[error.code] = error.message;
            return res.status(400).json(codeErrors);
        }

        // Error genérico por si falla la conexión u otra cosa
        res.status(500).json({ submit: "Error interno al procesar la reposición." });
    }
};
export const modificarLoteController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const actualizado = await loteService.modificarLote(id, req.body);
        res.status(200).json(actualizado);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        if (error.code === 'P2025') {
            codeErrors['NOT_FOUND_LOTE'] = "El lote que intentas modificar no existe.";
            return res.status(404).json(codeErrors);
        }

        codeErrors.submit = error.message || "Error al modificar el lote.";
        res.status(400).json(codeErrors);
    }
};

export const eliminarLoteController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const eliminado = await loteService.eliminarLote(id);
        res.status(200).json({ message: "Lote eliminado correctamente", eliminado });
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        if (error.code === 'P2025') {
            codeErrors['NOT_FOUND_LOTE'] = "El lote no existe.";
            return res.status(404).json(codeErrors);
        }

        if (error.code === 'LOTE_CON_VENTAS') {
            codeErrors[error.code] = error.message;
            return res.status(409).json(codeErrors); // 409 Conflict
        }

        res.status(500).json({ submit: "Error al eliminar el lote." });
    }
};