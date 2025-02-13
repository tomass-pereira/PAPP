const mongoose = require('mongoose');


const cancelamentoSchema = {
  id: String,                // ID único do registro de cancelamento
  consultaId: String,        // ID da consulta original que foi cancelada
  utenteId: String,        // ID do paciente que cancelou
  dataCancelamento: Date,    // Quando foi cancelado
  dataConsultaOriginal: Date,// Data que a consulta estava marcada
  horaConsulta: String,      // Hora que estava marcada
  motivoCancelamento: String,
  canceladoPor: String,     
  createdAt: Date,          
  updatedAt: Date           //
}

const Cancelamentos = mongoose.model('cancelamentos', cancelamentoSchema);

module.exports = Cancelamentos;