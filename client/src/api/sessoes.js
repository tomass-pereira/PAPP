import { BASE_URL } from './config';

export const getSessoes = async () => {

    const response = await fetch(`${BASE_URL}/sessoes/buscarSessoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    const data = await response.json();
   
  
    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar sessões");
    }
  
    return data;
};
export const reservarSessao = async (sessaoId, utenteId) => {
  try {

   
    const response = await fetch(`${BASE_URL}/sessoes/${sessaoId}/reservar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ utenteId, sessaoId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao reservar sessão');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error('Erro ao reservar sessão');
    }
    return data;
  } catch (error) {
    console.error('Erro ao reservar sessão:', error);
    throw error;
  }
};