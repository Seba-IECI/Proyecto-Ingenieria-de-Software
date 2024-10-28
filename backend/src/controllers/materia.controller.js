"use strict";
import{
    subirMaterialService,
    getMateriaService,
    updateMateriaService,
    deleteMateriaService
}from "../services/materia.service.js";
  import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
  } from "../handlers/responseHandlers.js";

  export async function subirMateria(req, res) {
    try {
        
        const { titulo, descripcion, url } = req.body;

        
        const [material, errorMaterial] = await subirMaterialService({ titulo, descripcion, url });

        if (errorMaterial) return handleErrorClient(res, 404, errorMaterial);

        
        handleSuccess(res, 200, "Material subido", material);
    } catch (error) {
        
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMateria(req, res){
    try {
        const { id } = req.params;

        const [materia, errorMateria] = await getMateriaService({ id });

        if (errorMateria) return handleErrorClient(res, 404, errorMateria);

        handleSuccess(res, 200, "Materia encontrada", materia);
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