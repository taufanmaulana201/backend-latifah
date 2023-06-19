import express from "express";

import { verifyUser } from "../middleware/AuthUser.js";
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoiceById,
} from "../controllers/Invoice.js";

const router = express.Router();

router.get("/invoice", verifyUser, getInvoice);
router.get("/invoice/:id", verifyUser, getInvoiceById);
router.post("/invoice", verifyUser, createInvoice);
// router.patch("/invoice/:id", verifyUser, updateinvoice);
router.delete("/invoice/:id", verifyUser, deleteInvoice);

export default router;
