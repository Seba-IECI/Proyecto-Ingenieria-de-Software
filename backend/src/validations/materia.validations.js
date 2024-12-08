"use strict";
import Joi from "joi";

export const materiaQueryValidation = Joi.object({
    titulo: Joi.string()
    .required()
    .min(5)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
        "string.empty": "El título no puede estar vacío.",
        "string.min": "El título debe tener al menos 5 caracteres.",
        "string.max": "El título no puede tener más de 50 caracteres.",
        "string.pattern.base": "El título solo puede contener letras y espacios.",
     }),
     descripcion: Joi.string()
     .required()
     .min(10)
    .max(255)
    .messages({
        "string.empty": "La descripción no puede estar vacía.",
        "string.min": "La descripción debe tener al menos 10 caracteres.",
        "string.max": "La descripción no puede tener más de 255 caracteres.",
        }),
    url: Joi.string()
    .optional()
        });
    