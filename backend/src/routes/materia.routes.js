"use strict";
import { Router } from "express";
import { isProfesor } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    deleteMateria,
    getMateria,
    subirMateria,
    updateMateria,
    
  
} from "../controllers/materia.controller.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isProfesor);

router
    .post("/sub", subirMateria)
    .get("/mos/:id", getMateria)
    .patch("/up/:id", updateMateria)
    .delete("/del/:id", deleteMateria);
    
export default router;