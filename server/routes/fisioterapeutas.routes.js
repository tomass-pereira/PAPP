const codigosRecuperacao = new Map();
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');  
const mongoose = require('mongoose');  
const Fisioterapeuta = require('../models/fisioterapeuta');
const authMiddleware = require('../middlewares/auth.middleware');



// Rota para buscar o fisioterapeuta atual
router.get('/current', authMiddleware, async (req, res) => {
  try {
    // Verifica se o usuário é um fisioterapeuta (isAdmin = true)
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: "Acesso não autorizado. Apenas fisioterapeutas podem acessar esta rota." 
      });
    }
    
    const fisio = await Fisioterapeuta.findById(req.user.id);
    
    if (!fisio) {
      return res.status(404).json({ 
        success: false,
        message: "Fisioterapeuta não encontrado" 
      });
    }
    
    res.json({ 
      success: true,
      fisioterapeuta: fisio 
    });
  } catch (error) {
    console.log("Erro na rota:", error);

    res.status(500).json({ 
      success: false,
      message: "Erro ao buscar dados do fisioterapeuta" 
    });
  }
});
  module.exports = router;