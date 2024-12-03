const express = require('express');
const connectDB = require('./db'); 

const app = express();

// Conecta ao MongoDB
connectDB();

app.use(express.json()); 
app.get('/api/test', (req, res) => {
  res.send('MongoDB is connected');
});


app.listen(5000, () => console.log('Server running on port 5000'));