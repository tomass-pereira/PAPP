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
    type: Date,
    required: true
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
  queixaPrincipal: {
    type: String,
    required: true
  },
  inicioSintomas: {
    type: Date,
    required: true
  },
  condicaoMedica: {
    type: String,
    default: ''
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
    apartamento: {
      type: String,
      default: ''
    }
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