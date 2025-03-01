require('dotenv').config();

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Utente = require('../models/utente');
const Fisioterapeuta=require('../models/fisioterapeuta');
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
        const { email, senha, role } = req.body;
        console.log(email);
        console.log(senha);
        
        console.log(role);
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        let user;
        // 2. Buscar usuário baseado no role
        if (role === 'utente') {
            user = await Utente.findOne({ email: email.toLowerCase() });
            
            // Verificações específicas para utentes
            if (user && user.StatusConta !== 'aprovado') {
                return res.status(401).json({
                    success: false,
                    message: 'Não tem permissão para aceder a esta aplicação'
                });
            }
        } else if (role === 'fisioterapeuta') {
            user = await Fisioterapeuta.findOne({ email: email.toLowerCase() });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Tipo de usuário inválido'
            });
        }
        
       console.log(user);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Conta não encontrada'
            });
        }

        // 4. Verificar senha
        if (user.senha !== senha) {
            console.log(user.senha);
            console.log(senha);
            return res.status(401).json({
                success: false,
                message: 'Senha inválida'
                
            });
        }

        // 5. Gerar token JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                nome: user.nome,
                isAdmin:role==='fisioterapeuta'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );


        
        // 6. Enviar resposta
        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user._id,
                profileImage: user.profileImage,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                isAdmin:role ==='fisioterapeuta'
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