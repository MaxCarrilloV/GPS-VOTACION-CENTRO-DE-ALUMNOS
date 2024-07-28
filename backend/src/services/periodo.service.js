"use strict";
const Periodo = require("../models/periodo.model.js");
const Proceso = require("../models/proceso.model.js");
const Constants = require("../constants/periodos.constants.js");
const { handleError } = require("../utils/errorHandler");

async function getPeriodos() {
  try {
    const periodos = await Periodo.find();
    if (periodos.length === 0)
      return [null, "No hay periodos electivos registrados"];

    return [periodos, null];
  } catch (error) {
    handleError(error, "periodo.service -> getPeriodos");
  }
}

function truncateTime(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

async function ValidarSecuencia(
  fechaInicioDate,
  numero_etapa,
  procesoId,
  proceso,
) {
  try {
    console.log("Iniciando ValidarSecuencia");

    // Truncar las fechas para eliminar la parte de la hora
    const fechaInicio = truncateTime(new Date(fechaInicioDate));
    const fechaCreacionProceso = truncateTime(new Date(proceso.fechaCreacion));

    console.log("Fecha de inicio (sin hora):", fechaInicio);
    console.log("Número de etapa:", numero_etapa);
    console.log(
      "Fecha de creación del proceso (sin hora):",
      fechaCreacionProceso,
    );

    if (numero_etapa !== 1) {
      const periodoPrevio = await Periodo.findOne({
        numero_etapa: numero_etapa - 1,
        procesoId: procesoId,
      });

      if (!periodoPrevio) {
        console.error("La secuencia de etapas es incorrecta");
        return [new Error("La secuencia de etapas es incorrecta"), null];
      }

      const fechaFinPrevio = truncateTime(new Date(periodoPrevio.fechaFin));
      console.log(
        "Fecha de finalización del periodo previo (sin hora):",
        fechaFinPrevio,
      );

      if (fechaInicio <= fechaFinPrevio) {
        return [
          new Error("Fecha de inicio inválida"),
          `La fecha de inicio debe ser posterior a la fecha de finalización de la etapa anterior: '${fechaFinPrevio.toLocaleDateString(
            "es-ES",
          )}'`,
        ];
      }

      if (
        fechaInicio >
        new Date(fechaFinPrevio.getTime() + 14 * 24 * 60 * 60 * 1000)
      ) {
        return [
          new Error("Fecha de inicio inválida"),
          `La fecha de inicio no puede exceder los 14 días después de la fecha de finalización de la etapa anterior: '${fechaFinPrevio.toLocaleDateString(
            "es-ES",
          )}'`,
        ];
      }
    } else {
      if (fechaInicio < fechaCreacionProceso) {
        return [
          new Error("Fecha de inicio inválida"),
          `La fecha de inicio debe ser posterior o igual a la fecha de creación del proceso: '${fechaCreacionProceso.toLocaleDateString(
            "es-ES",
          )}'`,
        ];
      }

      if (
        fechaInicio >
        new Date(fechaCreacionProceso.getTime() + 14 * 24 * 60 * 60 * 1000)
      ) {
        return [
          new Error("Fecha de inicio inválida"),
          `La fecha de inicio no puede exceder los 14 días después de la fecha de creación del proceso: '${fechaCreacionProceso.toLocaleDateString(
            "es-ES",
          )}'`,
        ];
      }
    }
    return [null, null];
  } catch (error) {
    console.error("Error en ValidarSecuencia:", error);
    handleError(error, "periodo.service -> ValidarSecuencia");
    return [error, null];
  }
}

async function createPeriodo(periodo) {
  try {
    const { nombre_etapa, fechaInicio, procesoId } = periodo;

    const fechaInicioDate = new Date(
      fechaInicio.split("-").reverse().join("-") + "T00:00:00Z",
    );
    console.log("Fecha de inicio createPeriodo:", fechaInicioDate);
    const duracion = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).duracion;

    const numero_etapa = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).numero_etapa;

    // validar proceso
    const proceso = await Proceso.findById({ _id: procesoId });
    if (!proceso) return [null, "El proceso no existe"];
    if (proceso.finalizado === true)
      return [null, "No se pueden añadir etapas a un proceso finalizado"];

    // Verificar si el periodo ya existe dentro del proceso
    const periodoFound = await Periodo.findOne({
      nombre_etapa: nombre_etapa,
      procesoId: procesoId,
    });
    if (periodoFound)
      return [
        null,
        `El periodo: '${nombre_etapa}' ya existe dentro del proceso: '${proceso.nombre}'`,
      ];

    //Validar secuencia y fechas de las etapas.
    const [error, mensajeError] = await ValidarSecuencia(
      fechaInicioDate,
      numero_etapa,
      procesoId,
      proceso,
    );
    if (mensajeError || error) return [null, mensajeError];

    // Calcular la fecha de finalización correcta
    const fechaFin = new Date(fechaInicioDate);
    fechaFin.setDate(fechaFin.getDate() + duracion - 1); //  Se resta 1 para incluir el día de inicio, caso contrario se contaría un día de más. Es decir, se contaría el día de inicio + los días de duración.
    fechaFin.setUTCHours(23, 59, 59, 999); // Ajustar la hora a las 23:59:59

    //crear el periodo
    const newPeriodo = new Periodo({
      nombre_etapa: nombre_etapa,
      fechaInicio: fechaInicioDate,
      procesoId: procesoId,
      fechaFin: fechaFin,
      duracion,
      numero_etapa,
    });
    await newPeriodo.save();

    // Actualizar el proceso
    let vueltas = 0;
    if (numero_etapa === 5) vueltas = 1;
    if (numero_etapa === 8) vueltas = 2;
    let finalizado = false;
    if (numero_etapa === 9) finalizado = true;

    const ProcesoUpdated = await Proceso.findByIdAndUpdate(
      procesoId,
      {
        $push: { periodos: newPeriodo._id },
        $set: { "proceso.vueltas": vueltas, "proceso.finalizado": finalizado },
      },
      { new: true },
    );
    if (!ProcesoUpdated)
      return [null, "No se pudo actualizar el proceso proceso correspondiente"];

    return [newPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> createPeriodo");
  }
}

async function updatePeriodo(id, periodo) {
  try {
    const { fechaInicio } = periodo;
    console.log("Iniciando updatePeriodo");

    let fechaInicioDate = new Date(
      fechaInicio.split("-").reverse().join("-") + "T00:00:00Z",
    );
    console.log("Fecha de inicio:", fechaInicioDate);

    const periodoFound = await Periodo.findById(id);
    if (!periodoFound) {
      console.error("El periodo no existe");
      return [null, "El periodo no existe"];
    }

    const proceso = await Proceso.findById({ _id: periodoFound.procesoId });
    if (!proceso) {
      console.error("El proceso no se pudo encontrar");
      return [null, "El proceso no se pudo encontrar"];
    }

    const duracion = Constants.find(
      (periodo) => periodo.nombre_etapa === periodoFound.nombre_etapa,
    ).duracion;

    // Validar la secuencia y fechas de las etapas.
    const [error, mensajeError] = await ValidarSecuencia(
      fechaInicioDate,
      periodoFound.numero_etapa,
      periodoFound.procesoId,
      proceso,
    );
    if (error || mensajeError) {
      console.error("Validación fallida:", mensajeError);
      return [null, mensajeError];
    }

    // Calcular la fecha de finalización correcta
    const fechaFin = new Date(fechaInicioDate);
    fechaFin.setDate(fechaFin.getDate() + duracion - 1); //  Se resta 1 para incluir el día de inicio, caso contrario se contaría un día de más. Es decir, se contaría el día de inicio + los días de duración.
    fechaFin.setUTCHours(23, 59, 59, 999); // Ajustar la hora a las 23:59:59

    const updatedPeriodo = await Periodo.findByIdAndUpdate(
      id,
      {
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFin,
      },
      { new: true },
    );

    console.log("Periodo actualizado:", updatedPeriodo);
    return [updatedPeriodo, null];
  } catch (error) {
    console.error("Error en updatePeriodo:", error);
    handleError(error, "periodo.service -> updatePeriodo");
    return [null, error.message];
  }
}

async function deletePeriodo(id) {
  try {
    const periodoFound = await Periodo.findById(id);
    if (!periodoFound) return [null, "El periodo no existe"];

    const deletedPeriodo = await Periodo.findByIdAndDelete(id);
    if (!deletedPeriodo) return [null, "No se pudo eliminar el periodo"];

    const proceso = await Proceso.findByIdAndUpdate(
      { _id: deletedPeriodo.procesoId },
      { $pull: { periodos: deletedPeriodo._id } },
      { new: true },
    );
    if (!proceso) return [null, "No se pudo eliminar el periodo del proceso"];

    return [deletedPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> deletePeriodo");
  }
}

module.exports = { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo };
