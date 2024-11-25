"use strict";
import { Router } from "express";
import { login, logout, register, update } from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .put("/update", update);

export default router;