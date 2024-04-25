"use strict";

const Role = require("../models/role.model.js");
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

async function deleteRole(id) {
  try {
    const role = await Role.findByIdAndDelete(id).exec();
    if (!role) return [null, "El rol no existe"];

    return [role, null];
  } catch (error) {
    handleError(error, "roles.service -> deleteRole");
  }
}

module.exports = { getRoles, deleteRole };