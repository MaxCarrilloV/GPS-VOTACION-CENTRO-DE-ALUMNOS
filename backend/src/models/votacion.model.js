"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modelo EXTREMADAMENTE TENTATIVO de votacion

const VotacionSchema = new Schema({
    
    //lista votada
    
    });

module.exports = mongoose.model("Votacion", VotacionSchema);