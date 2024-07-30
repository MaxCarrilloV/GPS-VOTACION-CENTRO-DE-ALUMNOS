"use strict";

const Joi = require("joi");
const ROLES = require("../constants/roles.constants");
const { verify } = require("jsonwebtoken");

/**
 * Esquema de validación para el cuerpo de la solicitud de usuario.
 * @constant {Object}
 */
const userBodySchema = Joi.object({
  username: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "string.empty": "El nombre de usuario no puede estar vacío.",
    "any.required": "El nombre de usuario es obligatorio.",
    "string.base": "El nombre de usuario debe ser de tipo string.",
    "string.pattern.base": "El nombre de usuario solo puede contener letras.",
  }),
  rut: Joi.string().messages({
    "string.base": "El rut debe ser de tipo string.",
  }),
  password: Joi.string().required().min(5).messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  roles: Joi.array()
    .items(Joi.string().valid(...ROLES))
    .required()
    .messages({
      "array.base": "El rol debe ser de tipo array.",
      "any.required": "El rol es obligatorio.",
      "string.base": "El rol debe ser de tipo string.",
      "any.only": "El rol proporcionado no es válido.",
    }),
  profileImage: Joi.string().messages({
    "string.base": "La imagen de perfil debe ser de tipo string.",
  }),
  contact: Joi.string().messages({
    "string.base": "El contacto debe ser de tipo string.",
  }),
  verifyToken: Joi.string().messages({
    "string.base": "El token de verificación debe ser de tipo string.",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "El estado de activación debe ser de tipo boolean.",
  }),
  newPassword: Joi.string().min(5).messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const userUpdateBodySchema = Joi.object({
  username: Joi.string().pattern(/^[A-Za-z]+$/).messages({
    "string.base": "El nombre de usuario debe ser de tipo string.",
    "string.pattern.base": "El nombre de usuario solo puede contener letras."
  }),
  rut: Joi.string().pattern(/^[0-9.-]+$/).allow("No especificado").messages({
    "string.base": "El rut debe ser de tipo string.",
    "string.pattern.base": "El rut solo puede contener números, puntos y guiones."
  }),
  contact: Joi.string().pattern(/^[0-9+]+$/).allow("No especificado").messages({
    "string.base": "El contacto debe ser de tipo string.",
    "string.pattern.base": "El contacto solo puede contener números y el carácter '+'."
  }),
  profileImage: Joi.any().optional(),
  password: Joi.string().min(5).messages({
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
  }), 
});

/**
 * Esquema de validación para el id de usuario.
 * @constant {Object}
 */
const userIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});

const roleUpdateSchema = Joi.object({
  roles: Joi.array()
    .items(Joi.string().valid(...ROLES))
    .required()
    .messages({
      "array.base": "El rol debe ser de tipo array.",
      "any.required": "El rol es obligatorio.",
      "string.base": "El rol debe ser de tipo string.",
      "any.only": "El rol proporcionado no es válido.",
    }),
});

const codeSchema = Joi.object({
  codigo: Joi.string().pattern(/^[0-9]+$/).length(6).required().messages({
    "string.empty": "El código no puede estar vacío.",
    "any.required": "El código es obligatorio.",
    "string.base": "El código debe ser de tipo string.",
    "string.pattern.base": "El código solo puede contener números.",
    "string.length": "El código debe tener exactamente 6 caracteres."
  }),
});

module.exports = { userBodySchema, userIdSchema, userUpdateBodySchema, roleUpdateSchema, codeSchema};
