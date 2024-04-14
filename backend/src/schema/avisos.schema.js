"use strict";

const Joi = require("joi");
const AVISOS = require("../constants/avisos.constants");

const avisosBodySchema = Joi.object({
    titulo: Joi.string().required().messages({
        "string.empty": "El título no puede estar vacío.",
        "any.required": "El título es obligatorio.",
        "string.base": "El título debe ser de tipo string.",
    }),
    tipo: Joi.string().valid(...AVISOS).required().messages({
        "string.empty": "El tipo no puede estar vacío.",
        "any.required": "El tipo es obligatorio.",
        "string.base": "El tipo debe ser de tipo string.",
        "any.only": "El tipo proporcionado no es válido.",
    }),
    contenido: Joi.string().required().messages({
        "string.empty": "El contenido no puede estar vacío.",
        "any.required": "El contenido es obligatorio.",
        "string.base": "El contenido debe ser de tipo string.",
    }),
    fechaPublicacion: Joi.date().messages({
        "date.base": "La fecha de publicación debe ser de tipo date.",
    }),
    }).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    });

module.exports = {
    avisosBodySchema,
};