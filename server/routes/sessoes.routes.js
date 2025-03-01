const express = require('express');
const router = express.Router();
const Sessoes = require('../models/sessoes');
const Utente =require("../models/utente")
const Cancelamentos=require("../models/cancelamentos")
const VerificarSessaoMesmoDia=require('../middlewares/sessoes.middleware');
const emailService = require('../services/nodemailer');
const notificacoes = require('../models/notificacoes');


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
  router.get('/buscarSessoes/:utenteId', async (req, res) => {
    console.log('Rota buscarSessoes chamada');
    try {
       
        const sessoes = await Sessoes.find();
        
        res.status(200).json(sessoes);
        console.log(sessoes);
        
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar sessões",
            error: error.message 
        });
    }
});
  router.get('/canceladas/:utenteId', async (req, res) => {
    try {
      const utenteId = req.params.utenteId;

      const cancelamentos = await Cancelamentos.find({ utenteId: utenteId });

      res.status(200).json(cancelamentos);
      
    } catch (error) {
      res.status(500).json({ 
        message: "Erro ao buscar sessões canceladas",
        error: error.message 
      });
    }
});



  router.post('/:id/reservar', VerificarSessaoMesmoDia,async (req, res, next) => {
    try {
     
      const sessaoId = req.params.id;
      const utenteId = req.body.userId;
      const motivo =req.body.motivo;

    

    
  
      const sessao = await Sessoes.findById(sessaoId);
      
        
  
      if (!sessao) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
      }
  
      if (sessao.status !== 'disponivel') {
        return res.status(400).json({ message: 'Sessão não está disponível para reserva' });
      }

  
      // Atualiza os campos da sessão
      sessao.utenteId = utenteId;
      sessao.status = 'reservada';
      sessao.motivo=motivo;
     
      const utente = await Utente.findById(sessao.utenteId);
   

     const userId=utenteId;
      await sessao.save();
      await notificacoes.create({
      userId,
        titulo: 'Sessão Reservada',
        descricao: `A sua sessão foi reservada com sucesso para ${sessao.
          dataHoraInicio}`,
        tipo: 'success'
    });
  
      res.json(sessao);
      try {
        await emailService.enviarEmail(
         'tj0816499@gmail.com',
'Nova Reserva de Sessão',
`
<div style="padding: 20px; background-color: #f5f5f5;">
<h2 style="color: #4F46E5;">Nova Sessão Reservada</h2>
<p>Uma nova sessão foi reservada. Detalhes da reserva:</p>

<div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #4F46E5; margin-bottom: 15px;">Informações da Sessão</h3>
    <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;"><strong>Data:</strong> ${new Date(sessao.dataHoraInicio).toLocaleDateString('pt-PT')}</li>
        <li style="margin-bottom: 10px;"><strong>Horário:</strong> ${new Date(sessao.dataHoraInicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - ${new Date(sessao.dataHoraFim).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</li>
        <li style="margin-bottom: 10px;"><strong>ID da Sessão:</strong> ${sessao._id}</li>
    </ul>
</div>

<div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #4F46E5; margin-bottom: 15px;">Informações do Utente</h3>
    <ul style="list-style: none; padding: 0;">
         <li style="margin-bottom: 10px;"><strong>Nome do utente:</strong> ${utente.nome}</li>
         <li style="margin-bottom: 10px;"><strong>Número do utente:</strong> ${utente.telefone}</li>
        <li style="margin-bottom: 10px;"><strong>Motivo da Sessão:</strong> ${sessao.motivo}</li>
    </ul>
</div>
<div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
 <div style="margin-top: 20px;">
            <h3>Morada:</h3>
            <ul>
                <li><strong>Distrito:</strong> ${utente.morada.distrito}</li>
                <li><strong>Concelho:</strong> ${utente.morada.concelho}</li>
                <li><strong>Rua:</strong> ${utente.morada.rua}</li>
               <li><strong>Código-Postal:</strong> ${utente.morada.codigoPostal}</li>
               <li><strong>Número da Porta:</strong> ${utente.morada.numPorta}</li>


            </ul>
        </div>
        </div>

<div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
    <p>Este é um email automático. Por favor, não responda.</p>
</div>
</div>
`
        );
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }
    } catch (error) {
      
      next(error);
     console.log(error.message);
    }
  });
 
  router.put('/:id/cancelar', async (req, res) => {
    try {
      const sessaoId = req.params.id;
      const { motivo } = req.body;
      console.log("motivo", motivo);
      
      // Busca a sessão pelo ID com os dados do utente
      const sessao = await Sessoes.findById(sessaoId).populate('utenteId');
  
      if (!sessao) {
        return res.status(404).json({ 
          error: true,
          message: 'Sessão não encontrada' 
        });
      }
  
      if (sessao.status !== 'reservada') {
        return res.status(400).json({ 
          error: true,
          message: 'Sessão não está reservada' 
        });
      }
  
      // Guarda os dados do utente antes de limpar
      const dadosUtente = sessao.utenteId;
      const novoCancelamento = new Cancelamentos({
        sessaoId: sessao._id,
        utenteId: dadosUtente._id,
        dataCancelamento: new Date(),
        dataConsultaOriginal: sessao.dataHoraInicio,
        horaConsulta: new Date(sessao.dataHoraInicio).toLocaleTimeString('pt-PT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        motivoCancelamento: motivo,
        canceladoPor: "utente", // ou você pode receber isso do frontend se necessário
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await novoCancelamento.save();
     
  
      sessao.status = 'disponivel';
      sessao.utenteId = null;
      sessao.motivo = null;
  
      await sessao.save();
  
      
  
      res.json({ 
        message: 'Sessão cancelada com sucesso',
        sessao 
      });
      await notificacoes.create({
        userId:dadosUtente._id,
        titulo: 'Sessão Cancelada',
        descricao: `A sua sessão foi cancelada`,
        tipo: 'info'
    });
      try {
        await emailService.enviarEmail(
          'tj0816499@gmail.com',
          'Sessão Cancelada',
          `
          <div style="padding: 20px; background-color: #f5f5f5;">
              <h2 style="color: #DC2626;">Sessão Cancelada</h2>
              <p>Uma sessão foi cancelada. Detalhes da sessão cancelada:</p>
  
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #DC2626; margin-bottom: 15px;">Informações da Sessão</h3>
                  <ul style="list-style: none; padding: 0;">
                      <li style="margin-bottom: 10px;"><strong>Data:</strong> ${new Date(sessao.dataHoraInicio).toLocaleDateString('pt-PT')}</li>
                      <li style="margin-bottom: 10px;"><strong>Horário:</strong> ${new Date(sessao.dataHoraInicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - ${new Date(sessao.dataHoraFim).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</li>
                      <li style="margin-bottom: 10px;"><strong>ID da Sessão:</strong> ${sessao._id}</li>
                  </ul>
              </div>
  
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #DC2626; margin-bottom: 15px;">Informações do Utente</h3>
                  <ul style="list-style: none; padding: 0;">
                      <li style="margin-bottom: 10px;"><strong>Nome do utente:</strong> ${dadosUtente.nome}</li>
                      <li style="margin-bottom: 10px;"><strong>Número do utente:</strong> ${dadosUtente.telefone}</li>
                  </ul>
              </div>
  
             
  
              <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                  <p>Este é um email automático. Por favor, não responda.</p>
              </div>
          </div>
          `
        );
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }
      
    } catch (error) {
      console.error('Erro ao cancelar sessão:', error);
      res.status(500).json({ 
        error: true,
        message: 'Erro ao cancelar sessão' 
      });
    }
  });

  router.post('/:id/concluida',async (req, res) => {
    try {
     
      const sessaoId = req.params.id;
      
      

    

    
  
      const sessao = await Sessoes.findById(sessaoId);
      
        
  
      if (!sessao) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
      }
  
    

  
      
      
      sessao.status = 'concluida';
     
     
    
   

   
      await sessao.save();
     
  
      res.json(sessao);
    
    } catch (error) {
      
    
     console.log(error.message);
    }
  });






module.exports=router;
