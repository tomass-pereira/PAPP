const mongoose = require('mongoose');


const cancelamentoSchema = {
  id: String,                
  consultaId: String,        
  utenteId: String,        //
  dataCancelamento: Date,    
  dataConsultaOriginal: Date,
  horaConsulta: String,      
  motivoCancelamento: String,
  canceladoPor: String,     
  createdAt: Date,          
  updatedAt: Date           //
}

const Cancelamentos = mongoose.model('cancelamentos', cancelamentoSchema);

module.exports = Cancelamentos;