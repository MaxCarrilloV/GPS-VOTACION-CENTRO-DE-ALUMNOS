"use strict";

const Joi = require("joi");
const PERIODOS = require("../constants/periodos.constants");

const periodoBodySchema = Joi.object({
    nombre: Joi.string().required().messages({
        "string.empty": "El nombre del periodo no puede estar vacío.",
        "any.required": "El nombre del periodo es obligatorio.",
        "string.base": "El nombre del periodo debe ser de tipo string.",
    }),
    fecha_inicio: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser de tipo date.",
        "any.required": "La fecha de inicio es obligatoria.",
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