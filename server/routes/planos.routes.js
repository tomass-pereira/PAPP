const express = require('express');
const router = express.Router();
const Planos = require('../models/planos'); 
const Sessao = require('../models/sessoes');
const notificacoes = require('../models/notificacoes');

// Rota para criar um novo plano de tratamento
router.post('/', async (req, res) => {
    try {
      const {
        titulo,
        utenteId,
        detalhes,
        objetivos,
        tipotratamento,
        dataInicio,
        dataFim,
        duracao,
        status,
        sessoes
      } = req.body;
  
      // Validações básicas
      if (!titulo || !utenteId || !dataInicio || !dataFim) {
        return res.status(400).json({ 
          success: false, 
          message: 'Campos obrigatórios não preenchidos' 
        });
      }
  
      // Criar o novo plano
      const novoPlano = new Planos({
        titulo,
        utenteId,
        detalhes,
        objetivos: objetivos || [],
        tipotratamento,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        duracao,
        status: status || 'Em Andamento',
        sessoes: [] // Começamos com array vazio
      });
  
      // Salvar o plano para obter seu ID
      const planoSalvo = await novoPlano.save();

      
      // Array para armazenar os IDs das sessões criadas
      const sessoesIds = [];
      
      // Se houver informações de sessões no request
      if (sessoes && sessoes.length > 0) {
        // Crie as sessões baseadas nas informações recebidas
        for (const sessaoInfo of sessoes) {
          // Verificar se dataHoraInicio e dataHoraFim existem
          if (!sessaoInfo.dataHoraInicio) {
            console.error("dataHoraInicio não fornecido para uma sessão");
            continue; // Pula esta sessão
          }
          
          // Determinar duração e dataHoraFim
          let duracaoMinutos = 45; // Valor padrão do schema
          let dataHoraFim;
          
          if (sessaoInfo.duracao) {
            // Se a duração for fornecida, usamos ela
            duracaoMinutos = sessaoInfo.duracao;
          }
          
          if (sessaoInfo.dataHoraFim) {
            // Se dataHoraFim for fornecido, usamos diretamente
            dataHoraFim = sessaoInfo.dataHoraFim;
          } else {
            // Caso contrário, calculamos com base na dataHoraInicio e duração
            const dataInicioObj = new Date(sessaoInfo.dataHoraInicio);
            const dataFimObj = new Date(dataInicioObj.getTime() + duracaoMinutos * 60000);
            dataHoraFim = dataFimObj.toISOString().split('.')[0]; // Formato: "2025-03-29T11:45:00"
          }
          
          const novaSessao = new Sessao({
            dataHoraInicio: sessaoInfo.dataHoraInicio, // Já no formato "2025-03-29T11:00:00"
            dataHoraFim: dataHoraFim,                  // No formato "2025-03-29T11:45:00"
            duracao: duracaoMinutos,
            descricao: sessaoInfo.descricao || `Sessão do plano: ${titulo}`,
            status: "reservada",
            motivo: titulo,
            utenteId: utenteId,
            planoId: planoSalvo._id,
            plano: true
          });
          
          const sessaoSalva = await novaSessao.save();
          sessoesIds.push(sessaoSalva._id);
        }
        
        // Atualize o plano com os IDs das sessões criadas
        planoSalvo.sessoes = sessoesIds;
        await planoSalvo.save();
      }
  await notificacoes.create({
      utenteId: utenteId,
        titulo: 'Plano de tratamento',
        descricao:  `Você foi adicionado a um novo plano de tratamento com ${sessoesIds.length} sessões`,
        tipo: 'info'
    });
      // Responder com o plano criado
      res.status(201).json({
        success: true,
        data: planoSalvo,
        message: 'Plano de tratamento criado com sucesso com suas sessões'
      });
  
    } catch (error) {
      console.error('Erro ao criar plano de tratamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar plano de tratamento',
        error: error.message
      });
    }
});
router.post('/concluir/:id',async (req, res) => {
  try {
   
    const planoId = req.params.id;
    const plano = await Planos.findById(planoId);
    if (!plano) {
      return res.status(404).json({ message: 'Sessão não encontrada' });
    }
    plano.status = 'concluido';
    await plano.save();
    res.json(plano);
  
  } catch (error) {
   console.log(error.message);
  }
});

router.get('/:id', async (req, res) => {
    try {
      const planoId = req.params.id;
      

      const plano = await Planos.findById(planoId)
        .populate('utenteId')    
        .populate('sessoes');    
      
      if (!plano) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: plano
      });
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar plano',
        error: error.message
      });
    }
  });
  
 // Rota para buscar todos os planos de um utente específico
router.get('/buscarPlanos/:utenteId', async (req, res) => {
    try {
      const { utenteId } = req.params;
      
      // Buscar todos os planos associados ao utente
      const planos = await Planos.find({ utenteId })
        .populate('sessoes')  // Opcional: popula as sessões
        .sort({ dataInicio: -1 }); // Ordena do mais recente para o mais antigo
      
      // Verificar se existem planos
      if (!planos || planos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum plano encontrado para este utente'
        });
      }
      
      // Retornar os planos
      res.status(200).json({
        success: true,
        count: planos.length,
        data: planos
      });
      
    } catch (error) {
      console.error('Erro ao buscar planos do utente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar planos do utente',
        error: error.message
      });
    }
  });

module.exports = router;