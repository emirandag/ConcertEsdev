/*
 * Importacion dels moduls necesaris
 */
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');

/*
 * Creació del Schema/Objecte de les compres
 */
var CompraSchema = mongoose.Schema({
  codiCompra: {
    type: Number,
    unique: true,
    required: true
  },
  numEntrada: {
    type: Number,
    required: true
  },
  targetaPagament: {
    type: Number,
    required: true
  },
  preuEntrada: {
    type: Number,
    required: true
  },
  preuTotal: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('compres', CompraSchema);
