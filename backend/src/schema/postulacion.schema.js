"use strict";
const Joi = require("joi");

const EstadoConstants = [
  "Enviado",
  "Aceptado",
  "Rechazado",
  "Se debe modificar",
];

const postulacionBodySchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  procesoId: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id del proceso no puede estar vacío.",
      "any.required": "El id del proceso es obligatorio.",
      "string.base": "El id del proceso debe ser de tipo string.",
    }),
  estado: Joi.string()
    .valid(...EstadoConstants)
    .required()
    .messages({
      "string.empty": "El estado no puede estar vacío.",
      "any.required": "El estado es obligatorio.",
      "string.base": "El estado debe ser de tipo string.",
      "any.only": "El estado no tiene un formato válido.",
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

const postulacionFileSchema = Joi.object({
  file: Joi.string().required().messages({
    "string.empty": "El filename no puede estar vacío.",
    "any.required": "El programa de trabajo es obligatorio.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = {
  postulacionBodySchema,
  postulacionIdSchema,
  postulacionFileSchema,
};
