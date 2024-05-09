"use strict";

const Joi = require("joi");
const Constants = require("../constants/periodos.constants");

const nombre_etapas_validos = Constants.map((periodo) => periodo.nombre_etapa);

const periodoBodySchema = Joi.object({
  nombre_etapa: Joi.string()
    .valid(...nombre_etapas_validos)
    .required()
    .messages({
      "string.empty": "El nombre del periodo no puede estar vacío.",
      "any.required": "El nombre del periodo es obligatorio.",
      "string.base": "El nombre del periodo debe ser de tipo string.",
      "any.only": "El nombre del periodo no es válido.",
    }),
  fechaInicio: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "date.base": "La fecha de inicio debe ser de tipo string.",
      "any.required": "La fecha de inicio es obligatoria.",
      "string.empty": "La fecha de inicio no puede estar vacía.",
      "string.pattern.base":
        "La fecha de inicio debe tener el formato yyyy-mm-dd.",
    }),
  procesoId: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id del proceso no puede estar vacío.",
      "any.required": "El id del proceso es obligatorio.",
      "string.pattern.base": "El id no tiene un formato válido.",
    }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const periodoIdSchema = Joi.object({
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
  periodoBodySchema,
  periodoIdSchema,
};
