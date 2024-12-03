const mongoose = require('mongoose');

const fisioterapeutaSchema = new mongoose.Schema({
  nome: String,
  
});

const Fisioterapeuta = mongoose.model('Fisioterapeuta', fisioterapeutaSchema);

module.exports = Fisioterapeuta;