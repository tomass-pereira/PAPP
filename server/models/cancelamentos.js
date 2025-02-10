const mongoose = require('mongoose');


const cancelamentoSchema = {
  id: String,                // ID único do registro de cancelamento
  consultaId: String,        // ID da consulta original que foi cancelada
  utenteId: String,        // ID do paciente que cancelou
  dataCancelamento: Date,    // Quando foi cancelado
  dataConsultaOriginal: Date,// Data que a consulta estava marcada
  horaConsulta: String,      // Hora que estava marcada
  motivoCancelamento: String,// Razão do cancelamento
  canceladoPor: String,      // Quem cancelou ("paciente" ou "profissional")
  createdAt: Date,          // Data de criação do registro
  updatedAt: Date           // Data de atualização do registro
}

const Cancelamentos = mongoose.model('cancelamentos', cancelamentoSchema);

module.exports = Cancelamentos;