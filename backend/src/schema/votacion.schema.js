"use strict";

const Joi = require("joi");

const votacionBodySchema = Joi.object({
    titulo: Joi.string().required().messages({
        "string.empty": "El título de la votación no puede estar vacío.",
        "any.required": "El título de la votación es obligatorio.",
        "string.base": "El título de la votación debe ser de tipo string.",
    }),
    descripcion: Joi.string().required().messages({
        "string.empty": "La descripción de la votación no puede estar vacía.",
        "any.required": "La descripción de la votación es obligatoria.",
        "string.base": "La descripción de la votación debe ser de tipo string.",
    }),
    fechaInicio: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser de tipo date.",
        "any.required": "La fecha de inicio es obligatoria.",
    }),
    fechaFin: Joi.date().required().messages({
        "date.base": "La fecha de fin debe ser de tipo date.",
        "any.required": "La fecha de fin es obligatoria.",
    }),
    opciones: Joi.array()
        .items(
            Joi.object({
                opcion: Joi.string().required().messages({
                    "string.empty": "La opción no puede estar vacía.",
                    "any.required": "La opción es obligatoria.",
                    "string.base": "La opción debe ser de tipo string.",
                }),
                cantidadVotos: Joi.number().default(0).messages({
                    "number.base": "La cantidad de votos debe ser de tipo number.",
                }),
            })
        )
        .min(2)
        .required()
        .messages({
            "array.min": "Debe haber al menos dos opciones.",
            "array.base": "Las opciones deben ser de tipo array.",
            "any.required": "Las opciones son obligatorias.",
        }),
}).messages({ "object.unknown": "No se permiten propiedades adicionales." });

const votacionIdSchema = Joi.object({
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
    votacionBodySchema,
    votacionIdSchema,
};
