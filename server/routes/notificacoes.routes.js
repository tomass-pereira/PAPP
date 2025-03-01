const express = require('express');
const router = express.Router();
const Notificacao = require('../models/notificacoes');

// Buscar notificações de um utente
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const notificacoes = await Notificacao.find({ 
            userId,
            ativa: true 
        }).sort({ tempo: -1 });

        return res.json(notificacoes);
    } catch (erro) {
        console.error('Erro ao buscar notificações:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar notificações' });
    }
});


router.put('/lida/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const agora = new Date();

        await Notificacao.updateMany(
            { 
                userId,
                lida: false,
                ativa: true 
            },
            { 
                lida: true,
                dataLeitura: agora
            }
        );

        return res.json({ mensagem: 'Todas as notificações foram marcadas como lidas' });
    } catch (erro) {
        console.error('Erro ao marcar notificações como lidas:', erro);
        return res.status(500).json({ erro: 'Erro ao marcar notificações como lidas' });
    }
});


module.exports = router;