"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const UserService = require("../services/user.service");
const { userBodySchema, userIdSchema, userUpdateBodySchema, roleUpdateSchema, codeSchema } = require("../schema/user.schema");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUsers(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsers();
    if (errorUsuarios) return respondError(req, res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsers");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createUser(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newUser, userError] = await UserService.createUser(body);

    if (userError) return respondError(req, res, 400, userError);
    if (!newUser) {
      return respondError(req, res, 400, "No se creo el usuario");
    }

    respondSuccess(req, res, 201, newUser);
  } catch (error) {
    handleError(error, "user.controller -> createUser");
    respondError(req, res, 500, "No se creo el usuario");
  }
}

/**
 * Confirma un código de usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function confirmUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = codeSchema.validate(body.code);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [user, errorUser] = await UserService.confirmUser(params.id, body.code.codigo);

    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> confirmUser");
    respondError(req, res, 500, "No se pudo confirmar el usuario");
  }
}

/**
 * Obtiene un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUserById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [user, errorUser] = await UserService.getUserById(params.id);

    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> getUserById");
    respondError(req, res, 500, "No se pudo obtener el usuario");
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.params; // Suponiendo que el correo está en los parámetros de la URL
    const [user, error] = await UserService.getUserByEmail(email);

    if (error) {
      // Manejar el error (por ejemplo, enviar una respuesta de error)
      return res.status(404).json({ error: error });
    }

    // Enviar el usuario como respuesta
    return res.status(200).json({ user: user });
  } catch (error) {
    // Manejar otros errores inesperados
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateUser(req, res) {
  try {
      const { params, body } = req;
      const file = req.file ? req.file.filename : 'user.png';

      console.log(file);

      const { error: paramsError } = userIdSchema.validate(params);
      if (paramsError) return respondError(req, res, 400, paramsError.message);

      // Añadir el nombre del archivo de la imagen al cuerpo de la solicitud
      body.profileImage = file;

      const { error: bodyError } = userUpdateBodySchema.validate(body);
      if (bodyError) return respondError(req, res, 400, bodyError.message);
      
      const [user, userError] = await UserService.updateUser(params.id, body, file);
      if (userError) return respondError(req, res, 400, userError);

      respondSuccess(req, res, 200, user);
  } catch (error) {
      handleError(error, "user.controller -> updateUser");
      respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}

async function updateRoleUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message); 

    const { error: bodyError } = roleUpdateSchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [user, userError] = await UserService.updateRoleUser(params.id, body.roles);

    if (userError) return respondError(req, res, 400, userError);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> updateRoleUser");
    respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}

/**
 * Elimina un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteUser(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const user = await UserService.deleteUser(params.id);
    !user
      ? respondError(
          req,
          res,
          404,
          "No se encontro el usuario solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> deleteUser");
    respondError(req, res, 500, "No se pudo eliminar el usuario");
  }
}

async function getUsersTricel(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsersTricel();
    if (errorUsuarios) return respondError(req, res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsersTricel");
    respondError(req, res, 400, error.message);
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
