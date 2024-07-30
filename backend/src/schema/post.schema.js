"use strict";

const Joi = require("joi");

const commentSchema = Joi.object({
  text: Joi.string().required().messages({
    "string.empty": "El texto del comentario no puede estar vacío.",
    "any.required": "El texto del comentario es obligatorio.",
  }),
  createdAt: Joi.date().default(Date.now),
  replies: Joi.array().items(Joi.string().hex()).messages({
    "array.base": "El campo de respuestas debe ser una matriz.",
    "string.hex": "Cada respuesta debe ser un identificador hexadecimal válido.",
  }),
});

const postSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "El título de la publicación no puede estar vacío.",
    "any.required": "El título de la publicación es obligatorio.",
  }),
  text: Joi.string().required().messages({
    "string.empty": "El texto de la publicación no puede estar vacío.",
    "any.required": "El texto de la publicación es obligatorio.",
  }),
  type: Joi.string().valid("List", "Normal").default("Normal").messages({
    "any.only": "El tipo de publicación debe ser 'List' o 'Normal'.",
  }),
  listMembers: Joi.array().items(Joi.string()).when('type', {
    is: 'List',
    then: Joi.array().min(5).required().messages({
      "array.min": "Debe haber al menos 5 miembros en la lista.",
      "array.base": "El campo de miembros de la lista debe ser una matriz.",
      "any.required": "El campo de miembros de la lista es obligatorio cuando el tipo es 'List'.",
    }),
    otherwise: Joi.array().optional()
  }),
  comments: Joi.array().items(commentSchema),
  createdAt: Joi.date().default(Date.now),
});

module.exports = {
  commentSchema,
  postSchema,
};
