const mongoose = require('mongoose');

const utenteSchema = new mongoose.Schema({
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
  dataNascimento: {
    type: String, // Mudado para String
    required: true,
    set: function(date) {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return date.split('T')[0];
    }
  },
  senha: {
    type: String,
    required: true
  },
  StatusConta: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  lesoesOuCirurgias: {
    type: String,
    default: ''
  },
  diagnosticoMedico: {
    type: String,
    default: ''
  },
  alergias: {
    type: String,
    default: ''
  },
  morada: {
    distrito: {
      type: String,
      required: true
    },
    concelho: {
      type: String,
      required: true
    },
    rua: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{3}$/, 'Por favor insira um código postal válido']
    },
    numPorta: {
      type: String,
      required: true
    },
    apartamento: {
      type: String,
      default: ''
    },
    distancia: {
      type: Object,
      required: true
    },
    duracao: {
      type: Object,
      required: true
    },
    
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  ultimaAtualizacao: {
    type: Date,
    default: Date.now
  }
});

const Utente = mongoose.model('utentes', utenteSchema);

module.exports = Utente;