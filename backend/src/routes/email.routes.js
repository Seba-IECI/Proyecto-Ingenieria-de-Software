import express from "express";
import { sendCustomEmail } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send", sendCustomEmail);

export default router;