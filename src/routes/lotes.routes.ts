import express from "express"
import {reponerStockController,modificarLoteController, eliminarLoteController} from "../controllers/lotes.controllers.js";

const router = express.Router()

router.post("/", reponerStockController);
router.patch("/:id", modificarLoteController);
router.delete("/:id", eliminarLoteController);

export default router;