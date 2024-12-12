const express = require('express');
const connectDB = require('./db');

const app = express();


connectDB();

app.use(express.json());
app.get('/api/test', (req, res) => {
  res.send('Test route');
 
});
app.get('/fisioterapeuta', async (req, res) => {
  try {
    const fisioterapeuta = await fisioterapeuta.find();
    res.status(200).json(fisioterapeuta);
  } catch (err) {

    res.send(err);
  }
});



app.listen(5000, () => console.log('Server running on port 5000'));