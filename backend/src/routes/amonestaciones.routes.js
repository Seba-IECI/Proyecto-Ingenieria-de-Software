"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { 
    addAmonestacionRutController
    
} from "../controllers/amonestaciones.controller.js";
import { isAdmin, isProfesor } from "../middlewares/authorization.middleware.js";

const router = Router();
    

router
    .use(authenticateJwt)

    .post("/rut",isProfesor, addAmonestacionRutController)
    
export default router;
