"use strict";
import Joi from "joi";

// Validación para la creación de ofertas
export const ofertaValidation = Joi.object({
  titulo: Joi.string()
    .min(10)
    .max(100)
    .required()
    .messages({
      "string.empty": "El título no puede estar vacío.",
      "any.required": "El título es obligatorio.",
      "string.base": "El título debe ser de tipo texto.",
      "string.min": "El título debe tener al menos 10 caracteres.",
      "string.max": "El título debe tener como máximo 100 caracteres.",
    }),
  descripcion: Joi.string()
    .min(50)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "any.required": "La descripción es obligatoria.",
      "string.base": "La descripción debe ser de tipo texto.",
      "string.min": "La descripción debe tener al menos 50 caracteres.",
      "string.max": "La descripción debe tener como máximo 500 caracteres.",
    }),
  empresa: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre de la empresa no puede estar vacío.",
      "any.required": "El nombre de la empresa es obligatorio.",
      "string.base": "El nombre de la empresa debe ser de tipo texto.",
      "string.min": "El nombre de la empresa debe tener al menos 3 caracteres.",
      "string.max": "El nombre de la empresa debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre de la empresa solo puede contener letras y espacios.",
    }),
  cupos: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "number.base": "Los cupos deben ser un número.",
      "number.integer": "Los cupos deben ser un número entero.",
      "number.min": "Debe haber al menos 1 cupo disponible.",
      "number.max": "No puede haber más de 100 cupos.",
      "any.required": "Los cupos son obligatorios.",
    }),
  fechaInicio: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe estar en formato ISO.",
      "any.required": "La fecha de inicio es obligatoria.",
    }),
  fechaTermino: Joi.date()
    .iso()
    .greater(Joi.ref('fechaInicio'))
    .required()
    .messages({
      "date.base": "La fecha de término debe ser una fecha válida.",
      "date.format": "La fecha de término debe estar en formato ISO.",
      "date.greater": "La fecha de término debe ser posterior a la fecha de inicio.",
      "any.required": "La fecha de término es obligatoria.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Validación para la subida de archivos
export const archivoValidation = Joi.object({
  archivo: Joi.object({
    fieldname: Joi.string()
      .required()
      .messages({
        "any.required": "El campo fieldname es obligatorio.",
      }),
    originalname: Joi.string()
      .pattern(/\.pdf$/)
      .required()
      .messages({
        "string.pattern.base": "El archivo debe ser un PDF.",
        "any.required": "El nombre original del archivo es obligatorio.",
      }),
    encoding: Joi.string()
      .required()
      .messages({
        "any.required": "El encoding del archivo es obligatorio.",
      }),
    mimetype: Joi.string()
      .valid('application/pdf')
      .required()
      .messages({
        "any.only": "El archivo debe ser un PDF.",
        "any.required": "El tipo MIME del archivo es obligatorio.",
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024) // 5MB en bytes
      .required()
      .messages({
        "number.max": "El archivo no debe exceder los 5MB.",
        "any.required": "El tamaño del archivo es obligatorio.",
      }),
  })
    .required()
    .messages({
      "any.required": "Se requiere un archivo.",
    }),
  tipoDocumento: Joi.string()
    .valid('cv', 'certificado', 'carta_motivacion')
    .required()
    .messages({
      "any.only": "El tipo de documento debe ser: cv, certificado o carta_motivacion.",
      "any.required": "El tipo de documento es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Validación para consultas de ofertas
export const ofertaQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  empresa: Joi.string()
    .min(3)
    .max(50)
    .messages({
      "string.min": "El nombre de la empresa debe tener al menos 3 caracteres.",
      "string.max": "El nombre de la empresa debe tener como máximo 50 caracteres.",
    }),
  estado: Joi.string()
    .valid('activa', 'inactiva', 'finalizada')
    .messages({
      "any.only": "El estado debe ser: activa, inactiva o finalizada.",
    }),
})
  .or('id', 'empresa', 'estado')
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro de búsqueda: id, empresa o estado.",
  });