import express from "express"
import {buscarVarianteController, modificarVarianteController } from "../controllers/variantes.controllers.js";

const router = express.Router()

router.get("/buscar/:codigo", buscarVarianteController);
router.patch("/:id", modificarVarianteController);


export default router;