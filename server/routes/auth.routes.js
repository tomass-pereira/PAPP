require('dotenv').config();

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Utente = require('../models/utente'); // Corrigido para maiúscula
const authMiddleware = require('../middlewares/auth.middleware');

// Chave secreta para o JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Rota de login
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
                message: 'Credenciais inválidas'
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
                nome: utente.nome,
                email: utente.email
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