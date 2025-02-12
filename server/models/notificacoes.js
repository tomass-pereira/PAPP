const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificacoesSchema = new Schema({
  utenteId: {
    type: Schema.Types.ObjectId,
    ref: 'utentes',
    required: true,
   
  },
  titulo: {
    type: String,
    required: true,
 
  },
  descricao: {
    type: String,
    required: true,
   
  },
  tempo: {
    type: Date,
    default: Date.now,
    required: true,
   
  },
  tipo: {
    type: String,
    enum: ['success', 'error', 'info', 'warning'],
   
  },
  lida: {
    type: Boolean,
    default: false,
    required: true,
  },
  dataLeitura: {
    type: Date,
    default: null
  },
  ativa: {
    type: Boolean,
    default: true,
    required: true,
    index: true
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt
});
const notificacoes = mongoose.model('notificacoes', NotificacoesSchema);

module.exports = notificacoes;