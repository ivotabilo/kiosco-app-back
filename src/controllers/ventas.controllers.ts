import type { Request, Response} from "express";
import type { Venta } from "../services/ventas.services.js";
import { crearVenta, agregarProducto, registrarVenta, eliminarProducto, modificarCantidad } from "../services/ventas.services.js";

export const crearVentaController = (req: Request, res: Response)=>{
    try {
        const venta = crearVenta();
        res.status(201).json(venta);
}
    catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Error inesperado.' });
        
    }
}
export const agregarProductoController = (req: Request<{ idVenta: string }, Venta, { codigo: string }>, res: Response) => {
  try{
        const { idVenta } = req.params;
        const { codigo } = req.body;
        const venta = agregarProducto(idVenta, codigo);
        res.status(201).json(venta);
  }
  catch (error:any) {
        const codeErrors: {[key: string]:string}={}
        if(error.code=== 'NOT_FOUND_VENTA'){
            codeErrors[error.code] = error.message;
            res.status(404).json(codeErrors);
        }
        else if(error.code=== 'NOT_FOUND_PRODUCTO'){
            codeErrors[error.code] = error.message;
            res.status(404).json(codeErrors);
        }
        else if(error.code=== 'CODIGO_REQUERIDO'){
            codeErrors[error.code] = error.message;
            res.status(400).json(codeErrors);
        }
        else if(error.code=== 'VENTA_FINALIZADA'){
            codeErrors[error.code] = error.message;
            res.status(409).json(codeErrors);
        }
        else if(error.code=== 'NO_HAY_STOCK'){
            codeErrors[error.code] = error.message;
            res.status(409).json(codeErrors);
        }
        else{
            codeErrors.submit = error.message || 'Error desconocido.';
            res.status(500).json(codeErrors);
        }
  }
};
export const modificarCantidadController= (req: Request<{ idVenta: string, codigo: string }, Venta, { cantidad: number }>, res: Response) => {
    try{
        const { idVenta, codigo } = req.params;
        const { cantidad } = req.body;
        const venta = modificarCantidad(idVenta, codigo, cantidad);
        res.json(venta);
    }
    catch (error:any) {
        const codeErrors: {[key: string]:string}={}
        if(error.code=== 'NOT_FOUND_VENTA'){
            codeErrors[error.code] = error.message;
            res.status(404).json(codeErrors);
        }
        else if(error.code=== 'NOT_FOUND_PRODUCTO'){
            codeErrors[error.code] = error.message;
            res.status(409).json(codeErrors);
        }
        else if(error.code=== 'NO_HAY_STOCK'){
            codeErrors[error.code] = error.message;
            res.status(409).json(codeErrors);
        }
        else if(error.code=== 'VENTA_FINALIZADA'){
            codeErrors[error.code] = error.message;
            res.status(409).json(codeErrors);
        }
        else{
            codeErrors.submit = error.message || 'Error desconocido.';
            res.status(500).json(codeErrors);
        }
    }
  }
export const registrarVentaController = (req: Request<{ idVenta: string }, Venta>, res: Response) => {
    const { idVenta } = req.params;
  
    const venta = registrarVenta(idVenta);
  
    res.json(venta);
  
}
export const eliminarProductoController = (req: Request<{ idVenta: string, codigo: string }, Venta>, res: Response) => {
    const { idVenta, codigo } = req.params;
  
    eliminarProducto(idVenta, codigo);
  
    res.sendStatus(204);
  }
