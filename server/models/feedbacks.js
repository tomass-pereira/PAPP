const mongoose = require('mongoose');


const feedbackSchema = {
  id: String,                
  sessaoId: String,               
  avaliacao: String,   
  dor: String,
  satisfacao: String,
  comentario: String,
}

const Feedbacks = mongoose.model('feedbacks', feedbackSchema);

module.exports = Feedbacks;