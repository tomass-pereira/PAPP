const codigosRecuperacao = new Map();
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');  
const mongoose = require('mongoose');  
const Utente = require('../models/utente');
const { validateUserData } = require('../middlewares'); 
 const emailService = require('../services/nodemailer');
 const authMiddleware = require('../middlewares/auth.middleware');
 const {getCoordenadas, getDuracao} = require('../services/gps');
const {hashPassword} =require('../services/hash');


 function gerarCodigo4Digitos() {
  // Gera um número entre 0000 e 9999
  const codigo = Math.floor(1000 + Math.random() * 9000);
  
 
  return codigo.toString().padStart(4, '0');
}

router.get('/', async (req, res) => {
  try {
   
      const utentes = await Utente.find()
         
      
      res.status(200).json(utentes);
      
  } catch (error) {
      res.status(500).json({ 
          message: "Erro ao buscar utentes",
          error: error.message 
      });
  }
});
router.post('/register',validateUserData, async (req, res, next) => {
  try {
    const {
      profileImage,
      nome,
      telefone,
      email,
      dataNascimento,
      senha,     
      lesoesOuCirurgias,
      diagnosticoMedico,
      alergias,
      morada
    } = req.body;

      const coordenadas = await getCoordenadas(`${morada.rua}, ${morada.concelho}`);
      const viagemInfo = await getDuracao(coordenadas);
    console.log(senha);
      const moradaAtualizada = {
        ...morada,
        distancia: viagemInfo.distancia, // Convertendo para string conforme definido no schema
        duracao: viagemInfo.duracao // Convertendo para string conforme definido no schema
      };
   console.log('Viagem:', viagemInfo);

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
    const hashedPassword=hashPassword(senha);
    const novoUtente = await Utente.create({
      profileImage,
      nome,
      telefone,
      email: email.toLowerCase(),
      dataNascimento: new Date(dataNascimento),
      senha:hashedPassword,
      StatusConta: 'pendente',    
      lesoesOuCirurgias: lesoesOuCirurgias || '',
      diagnosticoMedico: diagnosticoMedico || '',
      alergias: alergias || '',
      morada:moradaAtualizada
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
                <li><strong>Nome:</strong> ${nome}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefone:</strong> ${telefone}</li>
                <li><strong>Data do Pedido:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <div style="margin-top: 20px;">
                <h3>Informações Médicas:</h3>
                <ul>
                    ${diagnosticoMedico ? `<li><strong>Diagnóstico Médico:</strong> ${diagnosticoMedico}</li>` : ''}
                    ${lesoesOuCirurgias ? `<li><strong>Lesões ou Cirurgias:</strong> ${lesoesOuCirurgias}</li>` : ''}
                    ${alergias ? `<li><strong>Alergias:</strong> ${alergias}</li>` : ''}
                </ul>
            </div>
            <div style="margin-top: 20px;">
                <h3>Morada:</h3>
                <ul>
                    <li><strong>Distrito:</strong> ${morada.distrito}</li>
                    <li><strong>Concelho:</strong> ${morada.concelho}</li>
                    <li><strong>Rua:</strong> ${morada.rua}</li>
                   <li><strong>Código-Postal:</strong> ${morada.codigoPostal}</li>
                   <li><strong>Número da Porta:</strong> ${morada.numPorta}</li>


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
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      utente: novoUtente
    });

  } catch (error) {
    console.error('Erro completo:', error);
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
  
  const codigoSalvo = codigosRecuperacao.get(email);
  
 

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
router.put('/alterar-senha', async (req, res) => {
  const { email, novaSenha } = req.body;
 
  try {
    
    const utente = await Utente.findOne({ email });
    if (!utente) {
      return res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }
 
   
    await Utente.findOneAndUpdate(
      { email },
      { $set: { senha: novaSenha }},
      { new: true }
    );
 

 
    res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso'
    });
 
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha',
      error: error.message
    });
  }
 });
 router.get('/Verificar-Status', (req, res) => {
 const email=req.body.email;


  res.status(400).json({ 
    success: false, 
    message: 'Código inválido' 
  });
});
// Rota para buscar o utente atual
router.get('/current', authMiddleware, async (req, res) => {
  try {
    // Verifica se o usuário é um utente (isAdmin = false ou undefined)
    if (req.user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: "Acesso não autorizado. Apenas utentes podem acessar esta rota." 
      });
    }
    
    const utente = await Utente.findById(req.user.id);
    
    if (!utente) {
      return res.status(404).json({ 
        success: false,
        message: "Utente não encontrado" 
      });
    }
    
    res.json({ 
      success: true,
      utente: utente 
    });
  } catch (error) {
    console.log("Erro na rota:", error);

    res.status(500).json({ 
      success: false,
      message: "Erro ao buscar dados do utente" 
    });
  }
});
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const updateFields = {
      profileImage: req.body.profileImage,
      nome: req.body.nome,
      email: req.body.email,
      senha:req.body.senha,
      telefone: req.body.telefone,
      dataNascimento: new Date(req.body.dataNascimento),
      lesoesOuCirurgias: req.body.lesoesOuCirurgias || '',
      diagnosticoMedico: req.body.diagnosticoMedico || '',
      alergias: req.body.alergias || '',
      morada: {
        distrito: req.body.morada.distrito,
        concelho: req.body.morada.concelho,
        rua: req.body.morada.rua,
        codigoPostal: req.body.morada.codigoPostal,
        numPorta:req.body.morada.numPorta,
        apartamento: req.body.morada.apartamento || ''
      },
      updatedAt: new Date()
    };
    const result = await Utente.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }  // retorna o documento atualizado
    );
    if (!result) {
      return res.status(404).json({ message: 'Utente não encontrado' });
    }
    res.json(result);

  } catch (error) {
    console.error('Erro ao atualizar utente:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar dados do utente',
      error: error.message 
    });
  }
});



module.exports = router;