require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GPS_API_KEY;
const GPS_COORDENADAS_BASE_URL = process.env.GPS_COORDENADAS_BASE_URL;
const GPS_DURACAO_BASE_URL = process.env.GPS_DURACAO_BASE_URL;
const GPS_LONGITUDE = process.env.GPS_MINHA_LONGITUDE;
const GPS_LATITUDE = process.env.GPS_MINHA_LATITUDE;



const getCoordenadas = async (endereco) => {
    try {
        console.log('Endereço:', endereco);
        const response = await axios.get(GPS_COORDENADAS_BASE_URL, {
            params: {
              api_key: API_KEY,
              text: endereco,
              size: 1 // Limita para apenas o resultado mais relevante
            }
          });
          if (response.data && 
            response.data.features && 
            response.data.features.length > 0) {
          
          const coordenadas = response.data.features[0].geometry.coordinates;
          
          
          return {
            coordenadas: {
              longitude: coordenadas[0],
              latitude: coordenadas[1]
            }
           
          };
        }
        
        throw new Error('Endereço não encontrado');
      } catch (error) {
        if (error.response) {
          throw new Error('Erro ao buscar coordenadas: ' + (error.response.data.error || error.response.statusText));
        }
        throw error;
      }
    };
    const getDuracao = async (coordenadas) => {
        try {

          const response = await axios.get(GPS_DURACAO_BASE_URL, {
            params: {
              api_key: API_KEY,
              start: GPS_LONGITUDE + ',' + GPS_LATITUDE,
              end: coordenadas.coordenadas.longitude + ',' + coordenadas.coordenadas.latitude
            }
          });
      
          if (response.data ) {
            const summary = response.data.features[0].properties.summary;
            const duracao = summary.duration;
            const distancia = summary.distance;
            
            return {
              duracao: {
                segundos: duracao.toString(),
                minutos: Math.round(duracao / 60).toString(),
                horas: (duracao / 3600).toFixed(2)
              },
              distancia: {
                metros: distancia.toString(),
                quilometros: (distancia / 1000).toFixed(2)
              }
            };
          }
          
          throw new Error('Não foi possível calcular a duração');
        } catch (error) {
          if (error.response) {
            throw new Error('Erro ao calcular duração: ' + (error.response.data.error || error.response.statusText));
          }
          throw error;
        }
      };
   module.exports = { getCoordenadas, getDuracao };