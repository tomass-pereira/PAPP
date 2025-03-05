import { BASE_URL } from './config';
export const getPlanos = async (utenteId) => {

    const response = await fetch(`${BASE_URL}/planos/buscarPlanos/${utenteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    
    });
  
    const data = await response.json();
   
    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar sessões");
    }
  
    return data;
};