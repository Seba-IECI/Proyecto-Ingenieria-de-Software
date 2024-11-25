"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import emailRoutes from "./email.routes.js";
import inventarioRoutes from "./inventario.routes.js";
import prestamosRoutes from "./prestamos.routes.js";
import materiaRoutes from "./materia.routes.js";
import documentosPracticaRoutes from "./documentosPractica.routes.js";
import tareaRoutes from "./tarea.routes.js";
import semestreRoutes from "./semestre.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import periodoPracticaRoutes from "./periodoPracticas.routes.js";
import documentosTareaRoutes from "./documentosTarea.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/inventario", inventarioRoutes)
    .use("/materia",materiaRoutes)
    .use("/documentos", documentosPracticaRoutes)
    .use("/prestamos", prestamosRoutes)
    .use("/tarea", tareaRoutes)
    .use("/email", emailRoutes)
    .use("/semestres", semestreRoutes)
    .use("/asistencia", asistenciaRoutes)
    .use("/documentosTarea", documentosTareaRoutes)
    .use("/periodoPractica", periodoPracticaRoutes);
    
export default router;
