"use strict";
import {
    deleteMateriaService,
    getMateriaService,
    subirMaterialService,
    updateMateriaService
} from "../services/materia.service.js";
    import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

import { materiaQueryValidation } from "../validations/materia.validations.js";

    export async function subirMateria(req, res) {
    try {

        const { titulo, descripcion, url } = req.body;

        const { error: queryError } = materiaQueryValidation.validate(req.body);

        if (queryError) return handleErrorClient(res, 400, queryError.message);

        
        const [material, errorMaterial] = await subirMaterialService({ titulo, descripcion, url });

        if (errorMaterial) return handleErrorClient(res, 404, errorMaterial);

        
        handleSuccess(res, 200, "Material subido", material);
    } catch (error) {
        
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMateria(req, res) {
    try {
        const [materias, errorMateria] = await getMateriaService();

        if (errorMateria) return handleErrorClient(res, 404, errorMateria);

        handleSuccess(res, 200, "Materias encontradas", materias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateMateria(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;

        const [materia, errorMateria] = await updateMateriaService({ id }, body);

        if (errorMateria) {
            return handleErrorClient(res, 404, errorMateria);
        }

        handleSuccess(res, 200, "Materia actualizada", materia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteMateria(req, res){
    try {
        const { id } = req.params;

        const [materia, errorMateria] = await deleteMateriaService({ id });

        if (errorMateria) return handleErrorClient(res, 404, errorMateria);

        handleSuccess(res, 200, "Materia eliminada", materia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}