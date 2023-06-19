import express from "express";

import { verifyUser } from "../middleware/AuthUser.js";
import {
  createPengeluaran,
  deletePengeluaran,
  getPengeluaran,
  getPengeluaranById,
  updatePengeluaran,
} from "../controllers/Pengeluaran.js";

const router = express.Router();

router.get("/pengeluaran", verifyUser, getPengeluaran);
router.get("/pengeluaran/:id", verifyUser, getPengeluaranById);
router.post("/pengeluaran", verifyUser, createPengeluaran);
router.patch("/pengeluaran/:id", verifyUser, updatePengeluaran);
router.delete("/pengeluaran/:id", verifyUser, deletePengeluaran);

export default router;
