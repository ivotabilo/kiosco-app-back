import type { Request, Response} from "express";
import * as varianteService from "../services/variantes.services.js";

export const buscarVarianteController = async (req: Request<{ codigo: string }>, res: Response) => {
    try {
        const { codigo } = req.params; // Ahora TS sabe que 'codigo' es string y no falla
        const variante = await varianteService.buscarVariantePorCodigo(codigo);
        res.status(200).json(variante);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};
        
        if (error.code === 'NOT_FOUND_VARIANTE') {
            codeErrors[error.code] = error.message;
            return res.status(404).json(codeErrors);
        }
        
        res.status(500).json({ submit: "Error al buscar variante." });
    }
};

export const modificarVarianteController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const actualizada = await varianteService.modificarVariante(id, req.body);
        res.status(200).json(actualizada);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        if (error.code === 'P2025') {
            codeErrors['NOT_FOUND_VARIANTE'] = "La variante no existe.";
            return res.status(404).json(codeErrors);
        }
        
        if (error.code === 'P2002') {
            codeErrors['CODIGO_DUPLICADO'] = "Ese código ya está en uso.";
            return res.status(400).json(codeErrors);
        }

        codeErrors.submit = error.message || "Error al modificar.";
        res.status(400).json(codeErrors);
    }
};
