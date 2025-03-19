const { getCoordenadas, getDuracao } = require('../services/gps'); // ajuste o caminho conforme necessário
const express = require('express');
const axios = require('axios');
const router = express.Router();
router.get('/coordenadas', async (req, res) => {
  try {
    const { endereco } = req.query;
    const resultado = await getCoordenadas(endereco);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/duracao', async (req, res) => {
    try {
      const start = req.query.start;
      const end = req.query.end;
  
      if (!start || !end) {
        return res.status(400).json({ erro: 'Parâmetros start e end são obrigatórios' });
      }
  
      const resultado = await getDuracao({ start, end });
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  });





module.exports = router;