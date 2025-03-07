require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');

const cors = require('cors');

const app = express();

connectDB();

app.use(cors({
  origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use('/', routes);  


const PORT = process.env.PORT;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});