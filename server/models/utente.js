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
  queixaPrincipal: {
    type: String,
    required: true
  },
  inicioSintomas: {
    type: Date,
    required: true
  },
  condicaoMedica: {
    type: {
      tem: {
        type: String,
        enum: ['Sim', 'Não'],
        default: 'Não'
      },
      descricao: {
        type: String,
        required: function() {
          return this.tem === 'Sim';
        }
      }
    },
    required: false
  },
  lesoesOuCirurgias: {
    type: {
      tem: {
        type: String,
        enum: ['Sim', 'Não'],
        default: 'Não'
      },
      descricao: {
        type: String,
        required: function() {
          return this.tem === 'Sim';
        }
      }
    },
    required: false
  },
  diagnosticoMedico: {
    type: {
      tem: {
        type: String,
        enum: ['Sim', 'Não'],
        default: 'Não'
      },
      descricao: {
        type: String,
        required: function() {
          return this.tem === 'Sim';
        }
      }
    },
    required: false
  },
  alergias: {
    type: {
      tem: {
        type: String,
        enum: ['Sim', 'Não'],
        default: 'Não'
      },
      descricao: {
        type: String,
        required: function() {
          return this.tem === 'Sim';
        }
      }
    },
    required: false
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
      type: {
        vive: {
          type: String,
          enum: ['Sim', 'Não'],
          default: 'Não'
        },
        detalhes: {
          type: String,
          required: function() {
            return this.vive === 'Sim';
          }
        }
      },
      required: false
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