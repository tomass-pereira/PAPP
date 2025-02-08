const express = require('express');
const router = express.Router();
const Sessoes = require('../models/sessoes');
const VerificarSessaoMesmoDia=require('../middlewares/sessoes.middleware');
router.post('/criarSessao', async (req, res, next) => {
    try {
      const { dataHoraInicio, dataHoraFim, duracao, observacoes } = req.body;
  
      const novaSessao = new Sessoes({
        dataHoraInicio,
        dataHoraFim,
        duracao,
        observacoes,
        // clienteId começa como null por padrão
        // status começa como 'disponivel' por padrão
      });
  
      const sessaoSalva = await novaSessao.save();
      res.status(201).json(sessaoSalva);
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.get('/buscarSessoes', async (req, res) => {
    try {
      const sessoes = await Sessoes.find();
      res.status(200).json(sessoes);
    } catch (error) {
      res.status(500).json({ 
        message: "Erro ao buscar sessões",
        error: error.message 
        
      });
      next(error);
    }
  });
  router.post('/:id/reservar', VerificarSessaoMesmoDia,async (req, res, next) => {
    try {
     
      const sessaoId = req.params.id;
      const utenteId = req.body.utenteId;

    

    
      // Busca a sessão pelo ID
      const sessao = await Sessoes.findById(sessaoId);
  
      if (!sessao) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
      }
  
      if (sessao.status !== 'disponivel') {
        return res.status(400).json({ message: 'Sessão não está disponível para reserva' });
      }
  
      // Atualiza os campos da sessão
      sessao.clienteId = utenteId;
      sessao.status = 'reservada';
  
      await sessao.save();
  
      res.json(sessao);
    } catch (error) {
      console.error('Erro ao reservar sessão:', error);
      res.status(500).json({ message: 'Erro ao reservar sessão' });
      next(error);
    }
  });



module.exports=router;
