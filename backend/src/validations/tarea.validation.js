"use strict";
import Joi from "joi";

export const tareaQueryValidation = Joi.object({
    titulo: Joi.string()
    .required()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9 ]+$/) 
    .messages({
        "string.empty": "El título no puede estar vacío.",
        "string.min": "El título debe tener al menos 3 caracteres.",
        "string.max": "El título no puede tener más de 50 caracteres.",
        "string.pattern.base": "El título solo puede contener letras y números.",
        }),
    descripcion: Joi.string()
    .required()
    .min(10)
    .max(200)
    .messages({
        "string.empty": "La descripción no puede estar vacía.",
        "string.min": "La descripción debe tener al menos 10 caracteres.",
        "string.max": "La descripción no puede tener más de 200 caracteres.",
        }),
    fecha_entrega: Joi.date()
    .required()
    .min("now")
    .messages({
        "date.empty": "La fecha de entrega no puede estar vacía.",
        "date.min": "La fecha de entrega debe ser en el futuro.",
        }),
    });