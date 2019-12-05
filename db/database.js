var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/concertesdev';

var db = mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>{
  console.log('Connectat a la base de dades concertesdev');
}).catch((error) =>{
  console.log('Error al intentar connectar a la base de dades' + error);
});

module.exports = db;
