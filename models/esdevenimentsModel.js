/*
* Importacion dels moduls necesaris
*/
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');

/*
* Creació del Schema/Objecte dels esdeveniment
*/
var AsistentesSchema = mongoose.Schema({
  usuari: {
    type: String
  },
  email: {
    type: String
  }
});

var EventoSchema = mongoose.Schema({
  codiEsdev: {
       type: String,
       unique:true,
       required: false
       },
  nomEsdev: {
       type: String,
       required: false
       },
  tipus: {
       type: String,
       required: false
     },
  ubicacio: {
       type: String,
       required: false
             },
  preuEntrada: {
       type: Number,
       required: false
             },
  entradesDisponibles: {
       type: Number,
       required: false
           },
  descripcio: {
       type: String,
       required: false
           },
  dataEsdev: {
       type: String,
       required: false
            },
  organitzador: {
        type: String,
        required: false
      },
  assistents: [AsistentesSchema]
});

module.exports = mongoose.model('esdeveniment', EventoSchema);
