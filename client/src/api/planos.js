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
export const PostPlano = async (dadosPlano) => {
  try {
    const response = await fetch(`${BASE_URL}/planos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosPlano)
    });
    
    const data = await response.json();
   
    if (!response.ok) {
      throw new Error(data.message || "Erro ao criar plano");
    }

    return data;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
};