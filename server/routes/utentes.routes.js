const codigosRecuperacao = new Map();
const express = require('express');
const router = express.Router();
const Utente = require('../models/utente');
 const { validateUserData } = require('../middlewares'); // Comentar temporariamente
 const emailService = require('../services/nodemailer');


 function gerarCodigo4Digitos() {
  // Gera um número entre 0000 e 9999
  const codigo = Math.floor(1000 + Math.random() * 9000);
  
  // Converte para string e garante que sempre terá 4 dígitos
  // padStart garante que se for menor que 4 dígitos, será preenchido com zeros à esquerda
  return codigo.toString().padStart(4, '0');
}


router.post('/register',validateUserData, async (req, res, next) => {
  try {
  

    const {
      profileImage,
      nome,
      telefone,
      email,
      dataNascimento,
      senha,
      StatusConta,
      queixaPrincipal,
      inicioSintomas,
      condicaoMedica,
      lesoesOuCirurgias,
      diagnosticoMedico,
      alergias,
      morada
    } = req.body;

   
    const utenteExists = await Promise.all([
      Utente.findOne({ email: email.toLowerCase() }),
      Utente.findOne({ telefone: telefone })
    ]);

    if (utenteExists[0]) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    if (utenteExists[1]) {
      return res.status(400).json({ message: 'Telefone já cadastrado' });
    }

    const novoUtente = await Utente.create({
      profileImage,
      nome,
      telefone,
      email: email.toLowerCase(),
      dataNascimento: new Date(dataNascimento),
      senha,
      StatusConta: 'pendente',
      queixaPrincipal,
      inicioSintomas: new Date(inicioSintomas),
      condicaoMedica,
      lesoesOuCirurgias,
      diagnosticoMedico,
      alergias,
      morada
    });
    try {
      await emailService.enviarEmail(
        'tj0816499@gmail.com',
        'Pedido de aprovação de conta',
        `
        <div style="padding: 20px; background-color: #f5f5f5;">
            <h2>Novo Pedido de Aprovação de Conta</h2>
            <p>Um novo utilizador registrou-se e aguarda aprovação:</p>
            <ul>
                <li><strong>Nome:</strong> ${req.body.nome}</li>
                <li><strong>Email:</strong> ${req.body.email}</li>
                <li><strong>Telefone:</strong> ${req.body.telefone}</li>
                <li><strong>Data do Pedido:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <div style="margin-top: 20px;">
                <h3>Informações Médicas:</h3>
                <ul>
                    <li><strong>Queixa Principal:</strong> ${req.body.queixaPrincipal}</li>
                    <li><strong>Início dos Sintomas:</strong> ${new Date(req.body.inicioSintomas).toLocaleDateString()}</li>
                    <li><strong>Condição Médica:</strong> ${req.body.condicaoMedica}</li>
                    <li><strong>Diagnóstico Médico:</strong> ${req.body.diagnosticoMedico}</li>
                </ul>
            </div>
             <div style="margin-top: 20px;">
                <h3>Morada:</h3>
                <ul>
                    <li><strong>Distrito:</strong> ${req.body.morada.distrito}</li>
                    <li><strong>Concelho:</strong> ${req.body.morada.concelho}</li>
                    <li><strong>Rua:</strong> ${req.body.morada.rua}</li>
                </ul>
            </div>
        </div>
         <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/auth/aprovar/${novoUtente._id}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 10px 20px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      margin-right: 10px;
                      display: inline-block;">
                Aprovar Conta
            </a>
            <a href="http://localhost:3000/auth/rejeitar/${novoUtente._id}" 
               style="background-color: #f44336; 
                      color: white; 
                      padding: 10px 20px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
                Rejeitar Conta
            </a>
        </div>
    </div>
        `
      );
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não retornamos erro ao usuário pois a conta já foi criada
    }
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      utente: novoUtente
    });

  } catch (error) {
    console.error('Erro completo:', error); // Log do erro completo
    next(error);
  }
});
router.post('/send-email', async (req, res) => {
  const codigo = gerarCodigo4Digitos();
  try {
    const { email } = req.body;

    // Guarda o código com um tempo de expiração (15 minutos)
    codigosRecuperacao.set(email, {
      codigo: codigo
      
    });
    console.log('Código salvo:', codigosRecuperacao.get(email)); 

    await emailService.enviarEmail(
      email,
      'Recuperação de Senha',
      `
      <div style="padding: 20px; background-color: #f5f5f5;">
          <h2>Código de recuperação de senha</h2>
          <p>${codigo}</p>
      </div>
      `
    );
      
    res.status(200).json({ 
        success: true, 
        message: 'Email enviado com sucesso'
    });
  } catch (error) {
      console.error('Erro ao enviar email:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Erro ao enviar email',
          error: error.message 
      });
  }
});
router.post('/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body;
  console.log('Dados recebidos:', { email, codigo }); // Debug
  
  const codigoSalvo = codigosRecuperacao.get(email);
  console.log('CODIGO:', codigoSalvo.codigo); // Debug
  
 

  if (codigo === codigoSalvo.codigo) {
    return res.status(200).json({ 
      success: true, 
      message: 'Código verificado com sucesso' 
    });
  }

  res.status(400).json({ 
    success: false, 
    message: 'Código inválido' 
  });
});


module.exports = router;