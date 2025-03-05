const mongoose = require('mongoose');

const planosSchema = new mongoose.Schema({
  titulo: String,
  utenteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'utentes', 
    required: true 
  },
  detalhes: String,
  objetivos: [String],
  tipotratamento: String,
  
  dataInicio: Date,
  dataFim: Date,
  duracao: {
    valor: Number,
    unidade: String
  },
  status: String,
  sessoes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'sessoes' 
  }]
}, { timestamps: true });

const Planos = mongoose.model('planos', planosSchema);

module.exports = Planos;