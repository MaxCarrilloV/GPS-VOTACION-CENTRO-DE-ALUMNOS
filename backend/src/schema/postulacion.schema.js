"use strict";
const Joi = require("joi");

const postulacionBodySchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  programa_trabajo: Joi.string().required().messages({
    "string.empty": "El programa de trabajo no puede estar vacío.",
    "any.required": "El programa de trabajo es obligatorio.",
    "string.base": "El programa de trabajo debe ser de tipo string.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const postulacionIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const productosFileSchema = Joi.object({
  file: Joi.string().required().messages({
    "string.empty": "El filename no puede estar vacío.",
    "any.required": "La fotografia es obligatoria.",
  }),
});

module.exports = {
  postulacionBodySchema,
  postulacionIdSchema,
  productosFileSchema,
};
