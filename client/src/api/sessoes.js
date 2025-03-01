import { BASE_URL } from './config';


export const getSessoes = async (utenteId) => {

    const response = await fetch(`${BASE_URL}/sessoes/buscarSessoes/${utenteId}`, {
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
export const getSessoesCanceladas = async (utenteId) => {
  try {
    const response = await fetch(`${BASE_URL}/sessoes/canceladas/${utenteId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar sessões canceladas');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erro ao buscar sessões canceladas');
  }
};



export const reservarSessao = async (sessaoId, userId, motivo) => {
  const response = await fetch(`${BASE_URL}/sessoes/${sessaoId}/reservar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, sessaoId, motivo }),
  });                                 
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message);
  }
  
  return data;
};
export const cancelarSessao = async (sessaoId, motivo) => {
  const response = await fetch(`${BASE_URL}/sessoes/${sessaoId}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ motivo }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message);
  }
  
  return data;
};


export const concluirSessao = async (sessaoId) => {
  
  const response = await fetch(`${BASE_URL}/sessoes/${sessaoId}/concluida`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });                                 
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message);
  }
  
  return data;
};