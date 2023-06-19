import express from "express";

import { verifyUser } from "../middleware/AuthUser.js";
import {
  createSuplier,
  deleteSuplier,
  getSuplier,
  getSuplierById,
  updateSuplier,
} from "../controllers/Suplier.js";

const router = express.Router();

router.get("/suplier", verifyUser, getSuplier);
router.get("/suplier/:id", verifyUser, getSuplierById);
router.post("/suplier", verifyUser, createSuplier);
router.patch("/suplier/:id", verifyUser, updateSuplier);
router.delete("/suplier/:id", verifyUser, deleteSuplier);

export default router;
