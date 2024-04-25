"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const RoleService = require("../services/role.service");
const { handleError } = require("../utils/errorHandler");

async function getRoles(req, res) {
    try {
        const [roles, errorRoles] = await RoleService.getRoles();
        if (errorRoles) return respondError(req, res, 404, errorRoles);
    
        roles.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, roles);
    } catch (error) {
        handleError(error, "roles.controller -> getRoles");
        respondError(req, res, 400, error.message);
    }
    }

async function deleteRole(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = userIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);
    
        const [role, errorRole] = await RoleService.deleteRole(params.id);
        if (errorRole) return respondError(req, res, 404, errorRole);
    
        respondSuccess(req, res, 200, role);
    } catch (error) {
        handleError(error, "roles.controller -> deleteRole");
        respondError(req, res, 400, error.message);
    }
}

module.exports = { getRoles, deleteRole };