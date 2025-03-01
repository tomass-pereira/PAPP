// client/src/api/fisioterapeuta.js
import { BASE_URL } from './config';
import api from "../api/api";

export const getCurrentFisio = async () => {
  try {
    console.log('Chamando getCurrentFisio');
    
    // Verifica se o token existe
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error('Token não encontrado em getCurrentFisio');
      throw new Error('Token não encontrado');
    }
    
    // Usando fetch diretamente em vez de axios para maior controle
    const response = await fetch(`${BASE_URL}/fisioterapeutas/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Resposta do getCurrentFisio:', data);
    
    // Verifica diferentes possibilidades de nomes de propriedades
    if (data.fisioterapeuta) {
      return data.fisioterapeuta;
    } else if (data.Fisio) {
      return data.Fisio;
    } else if (data.success && data.fisioterapeuta) {
      return data.fisioterapeuta;
    } else {
      console.log('Estrutura completa de resposta:', JSON.stringify(data));
      // Se não conseguir encontrar a propriedade esperada, retorna os dados completos
      return data;
    }
  } catch (error) {
    console.error('Erro em getCurrentFisio:', error);
    throw error;
  }
};

export const updateFisio = async (fisioId, updatedData) => {
  try {
    // Usando fetch diretamente também para update
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const response = await fetch(`${BASE_URL}/fisioterapeutas/${fisioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro em updateFisio:', error);
    throw error;
  }
};