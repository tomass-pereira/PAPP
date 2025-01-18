// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/utente');

router.post('/register', async (req, res) => {
  try {
    const {
      profileImage,
      nome,
      telefone,
      email,
      dataNascimento,
      senha,
      queixaPrincipal,
      inicioSintomas,
      condicaoMedica,
      lesoesOuCirurgias,
      diagnosticoMedico,
      alergias,
      morada
    } = req.body;

    // Verifica se o email já existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria o novo usuário
    const user = await User.create({
      profileImage,
      nome,
      telefone,
      email,
      dataNascimento: new Date(dataNascimento),
      senha,
      queixaPrincipal,
      inicioSintomas: new Date(inicioSintomas),
      condicaoMedica,
      lesoesOuCirurgias,
      diagnosticoMedico,
      alergias,
      morada
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

module.exports = router;