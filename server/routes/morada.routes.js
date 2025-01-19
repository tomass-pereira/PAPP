require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const CTT_API_BASE_URL = process.env.CTT_BASE_URL;
const API_KEY = process.env.CTT_API_KEY; 



router.get('/:codigoPostal', async (req, res) => {
  const { codigoPostal } = req.params;                                          
  try {
    const response = await axios.get(`${CTT_API_BASE_URL}/${API_KEY}/${codigoPostal}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar a morada:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Não foi possível obter a morada a partir do código postal.',
    });
  }
});

module.exports = router;
