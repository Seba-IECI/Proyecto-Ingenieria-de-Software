"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import inventarioRoutes from "./inventario.routes.js";
import materiaRoutes from "./materia.routes.js";
import documentosPracticaRoutes from "./documentosPractica.routes.js";
import tareaRoutes from "./tarea.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/inventario", inventarioRoutes)
    .use("/materia",materiaRoutes)
    .use("/documentos", documentosPracticaRoutes)
    .use("/tarea", tareaRoutes);
    
export default router;