"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { verify } = require("jsonwebtoken");

// Crea el esquema de la coleccion 'usuarios'
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 100,
    },
    rut: {
      type: String,
      required: false,
      maxLength: 12,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    profileImage: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
  },
);

/** Encripta la contraseña del usuario */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compara la contraseña del usuario */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** Modelo de datos 'User' */
const User = mongoose.model("User", userSchema);

// Exporta el modelo de datos 'User'
module.exports = User;
