const mongoose = require('mongoose');

const UtenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  password: { type: Number, required: true },
  email: { type: String, required: true },
  idade: { type: Number, unique: true },

});

module.exports = mongoose.model('Utente', UtenteSchema);
