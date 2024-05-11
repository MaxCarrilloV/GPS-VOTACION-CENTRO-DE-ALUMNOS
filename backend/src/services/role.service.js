"use strict";

const Role = require("../models/role.model.js");
const Constants = require("../constants/roles.constants.js");
const { handleError } = require("../utils/errorHandler.js");

async function getRoles() {
  try {
    const roles = await Role.find().exec();
    if (!roles) return [null, "No hay roles"];

    return [roles, null];
  } catch (error) {
    handleError(error, "roles.service -> getRoles");
  }
}

async function createRole(role) {
  const { name } = role;
  try {
    const roleExists = await Role.findOne({ name: name });
    if (roleExists) return [null, "El rol proporcionado ya ha sido creado anteriormente"];

    if (!Constants.includes(name)) return [null, "El rol no es válido"];

    const newRole = new Role({ name: name });
    await newRole.save();

    return [newRole, null];
  } catch (error) {
    handleError(error, "roles.service -> createRole");
  }
}

async function deleteRole(id) {
  try {
    const role = await Role.findByIdAndDelete(id).exec();
    if (!role) return [null, "El rol no existe o no fue eliminado"];

    return [role, null];
  } catch (error) {
    handleError(error, "roles.service -> deleteRole");
  }
}

module.exports = { getRoles, createRole, deleteRole };
