const express = require('express');
const connectDB = require('./db');
const utente = require('./models/utente');

const app = express();


connectDB();

app.use(express.json());
app.get('/api/test', (req, res) => {
  res.send('Test route');
 
});
app.post('/utente', async (req, res) => {
  const {nome, email, password} = req.body;
  try {
    // Criar um novo documento na coleção 'utentes'
    const novoUtente = new utente({ nome, email,password });
    await novoUtente.save();

    res.status(201).json({ mensagem: 'Utente criado com sucesso', utente: novoUtente });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar o utente', erro });
  }
});




app.listen(5000, () => console.log('Server running on port 5000'));