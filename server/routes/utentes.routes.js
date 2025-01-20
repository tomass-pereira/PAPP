// src/routes/utentes.routes.js
const express = require('express');
const router = express.Router();
const Utente = require('../models/utente');
 const { validateUserData } = require('../middlewares'); // Comentar temporariamente

router.post('/register',validateUserData, async (req, res, next) => {
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
      utente: novoUtente
    });

  } catch (error) {
    console.error('Erro completo:', error); // Log do erro completo
    next(error);
  }
});

module.exports = router;