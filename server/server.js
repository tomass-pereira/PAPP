require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');

const cors = require('cors');

const app = express();

connectDB();

app.use(cors({
  origin: ['http://192.168.1.100:5173/', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use('/', routes);  


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});