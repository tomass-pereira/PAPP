const mongoose = require('mongoose');

const sessoesSchema = new mongoose.Schema({
  utenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utentes',
    default:null
  },
  dataHoraInicio: {
    type: Date,
    required: true,
    get: function(date) {
      return date ? date.toISOString().split('.')[0] : date;
    }
  },
  dataHoraFim: {
    type: Date,
    required: true,
    get: function(date) {
      return date ? date.toISOString().split('.')[0] : date;
    }
  },
  duracao: {
    type: Number,
    required: true,
    default: 45
  },
  status: {
    type: String,
    enum: ['disponivel','reservada', 'cancelada', 'concluida'],
    default: 'disponivel'
  },
  motivo: {
    type: String,
    default: ''
  },
  descricao: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});




const Sessoes = mongoose.model('sessoes', sessoesSchema);

module.exports = Sessoes;