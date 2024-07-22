"use strict";
// Importa el modelo de datos 'User'
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const { handleError } = require("../utils/errorHandler");
const { notificationVerifyToken } = require("./notificacion.service");
const fs = require('fs');
const path = require('path');

/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getUsers() {
  try {
    const users = await User.find()
      .select("-password")
      .populate("roles")
      .exec();
    if (!users) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsers");
  }
}

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createUser(user) {
  try {
    const { username, email, password, roles } = user;

    // Verificar el dominio del correo
    const dominiosAdmitidos = ['alumnos.ubiobio.cl', 'ubb.cl', 'email.com']; // Agrega los dominios permitidos aquí
    const emailDominio = email.split('@')[1];
    if (!dominiosAdmitidos.includes(emailDominio)) {
      return [null, "Debes ingresar un correo institucional"];
    }

    const userFound = await User.findOne({ email: user.email });
    if (userFound) return [null, "Ya existe un usuario con ese correo"];

    const rolesFound = await Role.find({ name: { $in: roles } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];
    const myRole = rolesFound.map((role) => role._id);

    const codigo = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      roles: myRole,
      verifyToken: codigo,
      profileImage: "/public/user.png",
    });
    await notificationVerifyToken(newUser);
    await newUser.save();

    return [newUser, null];
  } catch (error) {
    handleError(error, "user.service -> createUser");
  }
}

/**
 * Confirma un código de usuario en la base de datos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 * id: usuario a confirmar
 * code: código de confirmación	
 */
async function confirmUser(id, code) {
  try {
    const userFound = await User.findById(id);
    if (!userFound) return [null, "El usuario no existe"];
   
    if (userFound.verifyToken !== code) {
      return [null, "El código no coincide"];
    } else if (userFound.isActive) {
      return [null, "El usuario ya está activo"];
    } else {
      const userUpdated = await User.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true },
      );
      return [userUpdated, null];
    }

  } catch (error) {
    handleError(error, "user.service -> confirmUser");
  }
}

/**
 * Obtiene un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario
 */
async function getUserById(id) {
  try {
    const user = await User.findById({ _id: id })
      .select("-password")
      .populate("roles")
      .exec();

    if (!user) return [null, "El usuario no existe"];

    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserById");
  }
}

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email: email })
      .select("-password")
      .populate("roles")
      .exec();

    if (!user) return [null, "El usuario no existe"];

    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserByEmail");
  }
}

/**
 * Actualiza un usuario por su id en la base de datos
 * @param {string} id Id del usuario
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updateUser(id, user, imagen_perfil) {
  try {
    const userFound = await User.findById(id);
    if (!userFound) return [null, "El usuario no existe"];

    const { username, rut, contact } = user;
    
    let url;

    if (userFound.profileImage && userFound.profileImage !== "/public/user.png") {
      const oldImagePath = path.join(__dirname, '../..', userFound.profileImage);
      fs.unlink(oldImagePath, (err) => {
          if (err) {
              console.error('Error al eliminar la imagen antigua:', err);
          }
      });
    }

    if (userFound.profileImage && imagen_perfil !== "user.png") {
      url = `/public/${imagen_perfil}`;
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        username,
        rut,
        profileImage: url,
        contact,
      },
      { new: true },
    );

    return [userUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateUser");
  }
}


async function updateRoleUser(id, role ) {
  try {
    const userFound = await User.findById(id);
    if (!userFound) return [null, "El usuario no existe"];

    const rolesFound = await Role.find({ name: { $in: role } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];

    const myRole = rolesFound[0]._id;

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        roles: [myRole],
      },
      { new: true }
    );

    return [userUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateUser");
    return [null, error.message];
  }
}

/**
 * Elimina un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario eliminado
 */
async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "user.service -> deleteUser");
  }
}

async function getUsersTricel() {
  try {
    const users = await User.find({ roles: { $in: ["663fd0fd78dee408d2a3582c", "663fd1d61af43a2f88d89a71"] } })
      .select("-password")
      .populate("roles")
      .exec();
    if (!users) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsersTricel");
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  updateRoleUser,
  deleteUser,
  confirmUser,
  getUsersTricel,
};
