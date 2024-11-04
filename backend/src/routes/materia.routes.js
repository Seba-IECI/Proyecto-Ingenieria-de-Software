"use strict";
import { Router } from "express";
import { isProfesor, isProfesorOrEstudiante } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    deleteMateria,
    getMateria,
    subirMateria,
    updateMateria,
    
  
} from "../controllers/materia.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/sub", isProfesor,subirMateria)
    .get("/mos/:id",isProfesorOrEstudiante, getMateria)
    .patch("/up/:id", isProfesor,updateMateria)
    .delete("/del/:id",isProfesor, deleteMateria);
    
export default router;
