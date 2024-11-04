import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
handleErrorClient,
handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) { // aca pueod agregar mas roles, tales como profe y alumnos
try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
    return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
    );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
        return handleErrorClient(
            res,
            403,
            "Error al acceder al recurso",
            "Se requiere un rol de administrador para realizar esta acción."
        );
    }
    next();
} catch (error) {
    handleErrorServer(
    res,
    500,
    error.message,
    );
}
}

export async function isEstudiante(req, res, next) { // aca pueod agregar mas roles, tales como profe y alumnos
    try {
        const userRepository = AppDataSource.getRepository(User);
    
        const userFound = await userRepository.findOneBy({ email: req.user.email });
    
        if (!userFound) {
        return handleErrorClient(
            res,
            404,
            "Usuario no encontrado en la base de datos",
        );
        }
    
        const rolUser = userFound.rol;
    
        if (rolUser !== "estudiante") {
            return handleErrorClient(
                res,
                403,
                "Error al acceder al recurso",
                "Se requiere un rol de estudiante para realizar esta acción."
            );
        }
        next();
    } catch (error) {
        handleErrorServer(
        res,
        500,
        error.message,
        );
    }
    }

    export async function isProfesor(req, res, next) { // aca pueod agregar mas roles, tales como profe y alumnos
        try {
            const userRepository = AppDataSource.getRepository(User);
        
            const userFound = await userRepository.findOneBy({ email: req.user.email });
        
            if (!userFound) {
            return handleErrorClient(
                res,
                404,
                "Usuario no encontrado en la base de datos",
            );
            }
        
            const rolUser = userFound.rol;
        
            if (rolUser !== "profesor") {
                return handleErrorClient(
                    res,
                    403,
                    "Error al acceder al recurso",
                    "Se requiere un rol de profesor para realizar esta acción."
                );
            }
            next();
        } catch (error) {
            handleErrorServer(
            res,
            500,
            error.message,
            );
        }
        }

        export async function isProfesorOrEstudiante(req, res, next) {
            try {
                const userRepository = AppDataSource.getRepository(User);
                const userFound = await userRepository.findOneBy({ email: req.user.email });
        
                if (!userFound) {
                    return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
                }
        
                const rolUser = userFound.rol;
        
                if (rolUser !== "profesor" && rolUser !== "estudiante") {
                    return handleErrorClient(
                        res,
                        403,
                        "Error al acceder al recurso",
                        "Se requiere un rol de profesor o estudiante para realizar esta acción."
                    );
                }
                next();
            } catch (error) {
                handleErrorServer(res, 500, error.message);
            }
        }