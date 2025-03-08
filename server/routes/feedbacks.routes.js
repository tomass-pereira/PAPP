
const express = require('express');
const router = express.Router();
const Feedbacks = require('../models/feedbacks'); 
const Sessoes = require('../models/sessoes');

router.post('/', async (req, res) => {
    try {
      const { sessaoId, avaliacao, dor, satisfacao, comentario } = req.body;
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
  
      const feedbackSalvo = await novoFeedback.save();
    
      const sessao = await Sessoes.findById(sessaoId);
      sessao.feedbackId = feedbackSalvo._id;
      await sessao.save();
  
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