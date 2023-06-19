import express from "express";

import { verifyUser } from "../middleware/AuthUser.js";
import {
  createBarang,
  deleteBarang,
  getBarang,
  getBarangById,
  updateBarang,
} from "../controllers/Barang.js";

const router = express.Router();

router.get("/barang", getBarang);
router.get("/barang/:id", verifyUser, getBarangById);
router.post("/barang", verifyUser, createBarang);
router.patch("/barang/:id", verifyUser, updateBarang);
router.delete("/barang/:id", verifyUser, deleteBarang);

export default router;
