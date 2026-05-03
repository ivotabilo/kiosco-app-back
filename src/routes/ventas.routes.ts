import express from "express"
import { crearVentaController } from "../controllers/ventas.controllers.js"
import { agregarProductoController } from "../controllers/ventas.controllers.js"
import { eliminarProductoController } from "../controllers/ventas.controllers.js"
import{registrarVentaController} from "../controllers/ventas.controllers.js"
import { modificarCantidadController } from "../controllers/ventas.controllers.js"
const router = express.Router()

router.post('/', crearVentaController) 
router.post('/:idVenta/productos', agregarProductoController)
router.patch('/:idVenta/productos/:codigo', modificarCantidadController)
router.delete('/:idVenta/productos/:codigo', eliminarProductoController)
router.post('/:idVenta/registrar', registrarVentaController)

export default router