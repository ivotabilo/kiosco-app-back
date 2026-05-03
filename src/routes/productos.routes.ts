import express from "express"
import { 
    crearProductoController, 
    modificarProductoController, 
    eliminarProductoController 
} from "../controllers/productos.controllers.js";

const router = express.Router()

router.post("/", crearProductoController);
router.patch("/:id", modificarProductoController);
router.delete("/:id", eliminarProductoController);

export default router;


