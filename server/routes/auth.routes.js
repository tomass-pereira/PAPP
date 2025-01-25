require('dotenv').config();

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Utente = require('../models/utente');
const authMiddleware = require('../middlewares/auth.middleware');

// Chave secreta para o JWT
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/aprovar/:id', async (req, res) => {
    try {
        await Utente.findByIdAndUpdate(req.params.id, { StatusConta: 'aprovado' });
        // Redireciona para uma página simples de sucesso
        res.send(`
            <div style="text-align: center; padding: 50px;">
                <h1 style="color: green;">Conta aprovada com sucesso!</h1>
                <p>Pode fechar esta janela.</p>
            </div>
        `);
    } catch (error) {
        res.status(500).send(`
            <div style="text-align: center; padding: 50px;">
                <h1 style="color: red;">Erro ao aprovar conta</h1>
                <p>Por favor, tente novamente.</p>
            </div>
        `);
    }
});
router.get('/rejeitar/:id', async (req, res) => {
    try {
        await Utente.findByIdAndUpdate(req.params.id, { StatusConta: 'rejeitado' });
        res.send(`
            <div style="text-align: center; padding: 50px;">
                <h1 style="color: red;">Conta rejeitada</h1>
                <p>Pode fechar esta janela.</p>
            </div>
        `);
    } catch (error) {
        res.status(500).send(`
            <div style="text-align: center; padding: 50px;">
                <h1 style="color: red;">Erro ao rejeitar conta</h1>
                <p>Por favor, tente novamente.</p>
            </div>
        `);
    }
});


router.post('/login', async (req, res) => {
    try {
        // 1. Validar dados de entrada
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // 2. Buscar utente no banco
        const utente = await Utente.findOne({ email: email.toLowerCase() });
       
       
      
        
        if (!utente) {
            return res.status(401).json({
                success: false,
                message: 'Conta não encontrada'
            });
        }
        if (utente.StatusConta != 'aprovado') {
            return res.status(401).json({
                success: false,
                message: 'Não tem permissão para aceder a esta aplicação'
            });
        }

        // 3. Verificar senha
       
        
        
        if (utente.senha!==senha) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }
        

        // 4. Gerar token JWT
        const token = jwt.sign(
            {
                id: utente._id,
                email: utente.email,
                nome: utente.nome
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Enviar resposta
        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            token,
            utente: {
                id: utente._id,
                profileImage: utente.profileImage,
                nome: utente.nome,
                email: utente.email,
                telefone: utente.telefone,
                
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;