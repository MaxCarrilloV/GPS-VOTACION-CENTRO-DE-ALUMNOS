"use strict";
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");
const Votacion = require('../models/votacion.model.js');
const cron = require('node-cron');
/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "admin" });
    const user = await Role.findOne({ name: "user" });

    await Promise.all([
      new User({
        username: "user",
        email: "user@email.com",
        password: await User.encryptPassword("user123"),
        roles: user._id,
      }).save(),
      new User({
        username: "admin",
        email: "admin@email.com",
        password: await User.encryptPassword("admin123"),
        roles: admin._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

function cerrarVotacion() {
  cron.schedule('* * * * *', async () => {
    try {
      const votaciones = await Votacion.find();
      const now = new Date();
      const offset = now.getTimezoneOffset();
      now.setTime(now.getTime() - offset * 60 * 1000);

      votaciones.forEach(async (votacion) => {
        const fechaInicio = new Date(votacion.fechaInicio);
        const offsetInicio = fechaInicio.getTimezoneOffset();
        fechaInicio.setTime(fechaInicio.getTime() - offsetInicio * 60 * 1000);

        const fechaFin = new Date(votacion.fechaFin);
        const offsetFin = fechaFin.getTimezoneOffset();
        fechaFin.setTime(fechaFin.getTime() - offsetFin * 60 * 1000);

        if (fechaFin < now && votacion.estado === 'Abierta') {
            votacion.estado = 'Cerrada';
            await votacion.save();
            console.log(`Votación "${votacion.titulo}" cerrada automáticamente`);
        }

        if (fechaInicio < now && votacion.estado === 'Pendiente') {
          votacion.estado = "Abierta";
          await votacion.save();
          console.log(`Votación "${votacion.titulo}" abierta automáticamente`);
        }
      });
    } catch (err) {
      console.error('Error al actualizar el estado de las votaciones:', err);
    }
  });
}

module.exports = {
  createRoles,
  createUsers,
  cerrarVotacion,
};
