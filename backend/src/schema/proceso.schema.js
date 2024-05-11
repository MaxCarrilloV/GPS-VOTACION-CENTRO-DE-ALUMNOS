"use strict";

const Joi = require("joi");

const procesoIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.pattern.base": "El id no tiene un formato válido.",
    }),
});

const finalizadoSchema = Joi.object({
  finalizado: Joi.boolean().required().messages({
    "boolean.empty": "El campo finalizado no puede estar vacío.",
    "any.required": "El campo finalizado es obligatorio.",
    "boolean.base": "El campo finalizado debe ser de tipo boolean.",
  }),
});

module.exports = {
  procesoIdSchema,
  finalizadoSchema,
};
