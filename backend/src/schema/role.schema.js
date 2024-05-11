"use strict";

const Joi = require("joi");
const Constants = require("../constants/roles.constants");

const roleBodySchema = Joi.object({
  name: Joi.string()
    .valid(...Constants)
    .required()
    .messages({
      "string.empty": "El nombre del rol no puede estar vacío.",
      "any.required": "El nombre del rol es obligatorio.",
      "string.base": "El nombre del rol debe ser de tipo string.",
      "any.only": "El nombre del rol no es válido.",
    }),
}).messages({
  "object.unknown":
    "Propiedad desconocida. No se permiten propiedades adicionales.",
});

const roleIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.pattern.base": "El id no tiene un formato válido.",
    }),
});

module.exports = {
  roleBodySchema,
  roleIdSchema,
};
