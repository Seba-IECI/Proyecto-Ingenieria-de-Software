"use strict";
import Joi from "joi";

export const periodosPracticaQueryValidation = Joi.object({
    fechaInicio: Joi.date()
    .required()
    .custom((value, helpers) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(today);
        startOfTomorrow.setDate(today.getDate() + 1); 
        if (value < today || value >= startOfTomorrow) {
            return helpers.error("date.min", { message: "La fecha de inicio debe ser hoy." });
        }
        return value; 
    })
    .messages({
        "date.empty": "La fecha de inicio no puede estar vacia.",
        "date.min": "La fecha de inicio debe ser en el presente.",
        }),
    fechaFin: Joi.date()
    .required()
    .min(new Date(new Date().setDate(new Date().getDate() + 1)))
    .messages({
        "date.empty":"La fecha final no puede estar vacia.",
        "date.min": "La fecha final debe ser mayor a la fecha de inicio.",
    })
    });