import type { Request, Response } from "express";
import * as productoService from "../services/productos.services.js";

export const crearProductoController = async (req: Request, res: Response) => {
    try {
        const nuevo = await productoService.crearNewProduct(req.body);
        res.status(201).json(nuevo);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        // Errores de Prisma (DB)
        if (error.code === 'P2002') {
            codeErrors['CODIGO_DUPLICADO'] = "El código ya existe en el sistema.";
            return res.status(400).json(codeErrors);
        }

        // Errores manuales del Service (Estilo Ventas)
        if (error.code) {
            codeErrors[error.code] = error.message;
            return res.status(400).json(codeErrors);
        }

        res.status(500).json({ submit: error.message || "Error interno." });
    }
};

export const modificarProductoController = async (req: Request, res: Response) => {
    try {
        const actualizado = await productoService.modificarProducto({ 
            idProducto: Number(req.params.id), 
            ...req.body 
        });
        res.status(200).json(actualizado);
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        if (error.code === 'P2025') {
            codeErrors['NOT_FOUND_PRODUCTO'] = "Producto no encontrado.";
            return res.status(404).json(codeErrors);
        }

        codeErrors.submit = error.message || "Error al modificar.";
        res.status(400).json(codeErrors);
    }
};

export const eliminarProductoController = async (req: Request, res: Response) => {
    try {
        const eliminado = await productoService.eliminarProducto(Number(req.params.id));
        res.status(200).json({ message: "Eliminado con éxito", eliminado });
    } catch (error: any) {
        const codeErrors: { [key: string]: string } = {};

        if (error.code === 'P2025') {
            codeErrors['NOT_FOUND_PRODUCTO'] = "El producto no existe.";
            return res.status(404).json(codeErrors);
        }

        codeErrors.submit = "No se pudo eliminar el producto.";
        res.status(500).json(codeErrors);
    }
};

