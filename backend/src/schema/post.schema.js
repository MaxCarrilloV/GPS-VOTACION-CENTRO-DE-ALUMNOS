"use strict";

const Joi = require("joi");

const commentSchema = Joi.object({
  text: Joi.string().required().messages({
    "string.empty": "El texto del comentario no puede estar vacío.",
    "any.required": "El texto del comentario es obligatorio.",
  }),
  createdBy: Joi.string().hex().required().messages({
    //"string.empty": "El ID del creador del comentario no puede estar vacío.",
    //"any.required": "El ID del creador del comentario es obligatorio.",
    //"string.hex": "El ID del creador del comentario debe ser un identificador hexadecimal válido.",
  }),
  username: Joi.string().hex().required().messages({
    "string.empty": "El nombre de usuario del creador del comentario no puede estar vacío.",
    //"any.required": "El ID del creador del comentario es obligatorio.",
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
  text: Joi.string(),
  type: Joi.string().valid("List", "Normal").default("Normal").messages({
    "any.only": "El tipo de publicación debe ser 'List' o 'Normal'.",
  }),
  listMembers: Joi.array().items(Joi.string()),
  comments: Joi.array().items(commentSchema),
  username: Joi.string().hex().required().messages({
    "string.empty": "El nombre de usuario del creador del comentario no puede estar vacío.",
    //"any.required": "El ID del creador del comentario es obligatorio.",
  }),
  createdBy: Joi.string().hex().required().messages({
    //"string.empty": "El ID del creador de la publicación no puede estar vacío.",
    //"any.required": "El ID del creador de la publicación es obligatorio.",
    //"string.hex": "El ID del creador de la publicación debe ser un identificador hexadecimal válido.",
  }),
  createdAt: Joi.date().default(Date.now),
});

module.exports = postSchema;
