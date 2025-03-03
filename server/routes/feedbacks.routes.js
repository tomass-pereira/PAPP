
const express = require('express');
const router = express.Router();
const Feedbacks = require('../models/feedbacks'); 
router.post('/', async (req, res) => {
    try {
      const { sessaoId, avaliacao, dor, satisfacao, comentario } = req.body;
   console.log("avaliaçaoo",avaliacao);
      // Validação básica
      console.log(req.body);
      if (!sessaoId) {
        return res.status(400).json({ mensagem: 'ID da sessão é obrigatório' });
      }
  
      if (!avaliacao) {
        return res.status(400).json({ mensagem: 'Avaliação por estrelas é obrigatória' });
      }
  
      
      const novoFeedback = new Feedbacks({
       
        sessaoId,
        avaliacao,
        dor: dor || '',
        satisfacao: satisfacao || '',
        comentario: comentario || ''
      });
  
      // Salvar no banco de dados
      const feedbackSalvo = await novoFeedback.save();
  
      res.status(201).json({
        sucesso: true,
        mensagem: 'Feedback criado com sucesso',
        feedback: feedbackSalvo
      });
    } catch (erro) {
      console.error('Erro ao criar feedback:', erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar feedback',
        erro: erro.message
      });
    }
  });
  module.exports = router;