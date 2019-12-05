/*
 * Importacion dels moduls necesaris
 */
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');

/*
 * Creació del Schema/Objecte dels esdeveniment
 */
var UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  cognom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  pass: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.pass, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.pass = hash;
    next();
  })
});

/**
* Metode per fer la compararació de que la contrasenya i la seva confirmació siguin iguals
**/
UserSchema.methods.comparePassword = function(candidatePassword, cb) {

  bcrypt.compare(candidatePassword, this.pass, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


UserSchema.statics.getAuthenticated = function(email, password, cb) {
  this.findOne({email: email}, function(err, user) {
    if (err) {
      console.log(err);
      return cb(err);
    } else if (!user) {
			console.log('No existeix aquest usuario');
			return cb(null, null, err);
    } else {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return cb(err);
        }
        if (isMatch) {
          console.log('Usuari validat => ' + user.email + '\n');
          return cb(null, user);
        } else {
					console.log('Contrasenya incorrecta');
          return cb(null);
        }

      });
    }

  });
};

module.exports = mongoose.model('usuaris', UserSchema);
