"use strict";
const mongoose = require("mongoose");
const PERIODOS = require("../utils/constants");
// Periodo o etapa de elecciones
/**
 * Art. 28: periodo de postulaciones, el cual durará 5 días hábiles. Las postulaciones sólo podrán retirarse dentro de esos 5 días.
 * Art. 29: Una vez terminado el periodo de postulaciones, se abrirá una etapa de revisión, cuya duración será determinada por TRICEL. Seguido por un periodo de información y propaganda, el cual durará 5 días hábiles y
 versará sobre la identidad y propósitos de cada lista. Esta etapa será dirigida por el TRICEL, quien organizará (y moderará) todos los eventos necesarios para una información adecuada y completa. Por ejemplo:
 propaganda digital, impresa, debates, etc.
 Art. 30 Terminada la etapa de información y propaganda, luego de a lo menos 2 días hábiles, se llevará a cabo el acto de votación, en los horarios propuestos por TRICEL y durante 2 días consecutivos
 */

const periodoSchema = new mongoose.Schema({
  nombre_etapa: {
    type: String,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.nombre_etapa),
  },

  fecha_inicio: {
    type: Date,
    required: true,
  },

  // automáticamente calculada
  fecha_fin: {
    type: Date,
    required: true,
  },

  duracion: {
    type: Number,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.duracion),
  },

  //orden o secuencia de etapas
  numero_etapa: {
    type: Number,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.numero_etapa),
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Periodo = mongoose.model("Periodo", periodoSchema);
module.exports = Periodo;
