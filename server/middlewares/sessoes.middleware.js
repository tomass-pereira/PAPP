const sessoes = require('../models/sessoes');  // Importando o modelo de Sessão

// Middleware para verificar se o utente já tem uma sessão no mesmo dia
const VerificarSessaoMesmoDia = async (req, res, next) => {
  try {
    const { userId } = req.body;  // Pegando o 'utenteId' do corpo da requisição
    const sessaoId = req.params.id; // Pegando o 'sessaoId' da URL

    // Busca a sessão que o utente está tentando reservar
    const sessao = await sessoes.findById(sessaoId);
    if (!sessao) {
      return res.status(404).json({ message: 'Sessão não encontrada' });
    }

    const dataHoraInicio = sessao.dataHoraInicio;  // Usando 'dataHoraInicio' para a comparação

    // Verifica se há uma sessão agendada para o mesmo utente no mesmo dia
    const existingSession = await sessoes.findOne({
      utenteId: userId,  
      dataHoraInicio: {
        $gte: new Date(dataHoraInicio).setHours(0, 0, 0, 0), // Começo do dia
        $lt: new Date(dataHoraInicio).setHours(23, 59, 59, 999) // Fim do dia
      }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'Você já tem uma sessão agendada para esse dia.' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return res.status(500).json({ message: 'Erro interno ao verificar a sessão.' });
  }
};

module.exports = VerificarSessaoMesmoDia;
