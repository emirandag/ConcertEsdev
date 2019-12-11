/*
* Importacion dels moduls necesaris
*/
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');

/*
* Creació del Schema/Objecte dels esdeveniment
*/
var EventoSchema = mongoose.Schema({
  codiEsdev: {
       type: String,
       unique:true,
       required: true
       },
  nomEsdev: {
       type: String,
       required: true
       },
  tipus: {
       type: String,
       required: true
     },
  ubicacio: {
       type: String,
       required: true
             },
  preuEntrada: {
       type: Number,
       required: true
             },
  entradesDisponibles: {
       type: Number,
       required: false
           },
  descripcio: {
       type: String,
       required: true
           },
  dataEsdev: {
       type: String,
       required: true
            },
  organitzador: {
        type: String,
        required: true
            }
});

module.exports = mongoose.model('esdeveniment', EventoSchema);
