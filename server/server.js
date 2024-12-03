const express = require('express');
const connectDB = require('./db'); 

const app = express();

// Conecta ao MongoDB
connectDB();

app.use(express.json()); 
app.delete('/api/movies/title/:title', async (req, res) => {
  try {
    // Usa o parâmetro 'nome' na URL para buscar e deletar o fisioterapeuta
    const movies = await movies.findOneAndDelete({ title: req.params.title});

    // Verifica se o fisioterapeuta foi encontrado
    if (!movies) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: 'Filme deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));