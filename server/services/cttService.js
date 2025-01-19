require('dotenv').config();

const axios = require('axios');

const API_KEY = process.env.CTT_API_KEY;
const BASE_URL = process.env.CTT_BASE_URL;

const buscarMoradaCTT = async (codigoPostal) => {
    try {
      const response = await axios.get(`${BASE_URL}/${API_KEY}/${codigoPostal}`);
      
      if (response.data && response.data.length > 0) {
        const endereco = response.data[0];
        return {
          morada: endereco.morada,
          porta: endereco.porta,
          localidade: endereco.localidade, 
          freguesia: endereco.freguesia,
          concelho: endereco.concelho,
          distrito: endereco.distrito,
          codigoPostal: endereco["codigo-postal"]
        };
      }
      
      throw new Error('Código postal não encontrado');
    } catch (error) {
      if (error.response) {
        throw new Error('Erro ao buscar morada: ' + error.response.data);
      }
      throw error;
    }
   };

module.exports = { buscarMoradaCTT };