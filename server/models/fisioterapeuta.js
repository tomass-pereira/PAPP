const mongoose = require('mongoose');

const fisioterapeutaSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    required: false
  },
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
});

const Fisioterapeuta = mongoose.model('Fisioterapeuta', fisioterapeutaSchema);

module.exports = Fisioterapeuta;