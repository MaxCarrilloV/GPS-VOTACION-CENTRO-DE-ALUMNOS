"use strict";

const Joi = require("joi");
const ACTIVIDADES = require("../constants/actividades.constants");

const actividadCEEBodySchema = Joi.object({
    nombre: Joi.string().required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
    }),
    descripcion: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "La fecha debe ser de tipo date.",
        "any.required": "La fecha es obligatoria.",
    }),
    hora: Joi.string().required().messages({
        "string.empty": "La hora no puede estar vacía.",
        "any.required": "La hora es obligatoria.",
        "string.base": "La hora debe ser de tipo string.",
    }),
    lugar: Joi.string().required().messages({
        "string.empty": "El lugar no puede estar vacío.",
        "any.required": "El lugar es obligatorio.",
        "string.base": "El lugar debe ser de tipo string.",
    }),
    completado: Joi.boolean().messages({
        "boolean.base": "El campo completado debe ser de tipo boolean.",
    }),
    tipo: Joi.string().valid(...ACTIVIDADES).required().messages({
        "string.empty": "El tipo no puede estar vacío.",
        "any.required": "El tipo es obligatorio.",
        "string.base": "El tipo debe ser de tipo string.",
        "any.only": "El tipo proporcionado no es válido.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const actividadCEEIdSchema = Joi.object({
    id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
});

module.exports = {
    actividadCEEBodySchema,
    actividadCEEIdSchema,
};
