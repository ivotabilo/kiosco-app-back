import express from "express"
import { crearVentaController } from "../controllers/ventas.controllers.js"
import { agregarProductoController } from "../controllers/ventas.controllers.js"
import { eliminarProductoController } from "../controllers/ventas.controllers.js"
import{registrarVentaController} from "../controllers/ventas.controllers.js"
import { modificarCantidadController } from "../controllers/ventas.controllers.js"
const router = express.Router()

router.post('/ventas',crearVentaController)
router.post('/ventas/:idVenta/productos',agregarProductoController)
router.patch('/ventas/:idVenta/productos/:codigo',modificarCantidadController)
router.delete('/ventas/:idVenta/productos/:codigo',eliminarProductoController)
router.post('/ventas/:idVenta/registrar',registrarVentaController)

export default router