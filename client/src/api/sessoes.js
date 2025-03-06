import { BASE_URL } from './config';
import api from './api';


export const getAllSessoes = async () => {

  const response = await fetch(`${BASE_URL}/sessoes/`, {
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
export const DeleteSessao = async (sessaoId) => {
  try {
    const response = await api.delete(`/sessoes/eliminar/${sessaoId}`);
    
    // Com Axios, os dados já vêm parseados em response.data
    return response.data;
  } catch (error) {
    // Tratamento de erro com Axios
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Erro ao eliminar sessão");
    }
    throw new Error("Erro ao eliminar sessão");
  }
};

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

export const createSessao = async (sessaoData) => {
  try {
    // Calcular dataHoraFim com base na dataHoraInicio e duração
    const dataInicio = new Date(sessaoData.dataHoraInicio);
    const dataFim = new Date(dataInicio.getTime() + sessaoData.duracao * 60000);
    
    // Preparar o payload conforme esperado pela API
    const payload = {
      dataHoraInicio: sessaoData.dataHoraInicio,
      dataHoraFim: dataFim.toISOString().split('.')[0],
      duracao: sessaoData.duracao,
      status: sessaoData.status,
      motivo: sessaoData.motivo || "",
      descricao: sessaoData.descricao || ""
    };
    
    console.log(payload);
    if (sessaoData.status === 'reservada' && sessaoData.utenteId) {
      payload.utenteId = sessaoData.utenteId;
    }

    const response = await api.post('/sessoes/criarSessao', payload);
    return response.data.sessao;
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    throw error.response?.data?.mensagem 
      ? new Error(error.response.data.mensagem) 
      : error;
  }
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

export const getSessao = async (id) => {
  try {
    const response = await fetch(`/api/sessoes/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || 'Erro ao buscar sessão');
    }
    
    const data = await response.json();
    return data.sessao;
  } catch (error) {
    console.error('Erro ao buscar sessão:', error);
    throw error;
  }
};
export const feedbackSessao = async (dados) => {
  console.log("Dados recebidos:", dados);
  
  // Extrair as propriedades do objeto
  const { sessaoId, avaliacao, dor, satisfacao, comentario } = dados;
  
  // Verificar se os campos obrigatórios existem
  if (!sessaoId) {
    throw new Error("ID da sessão é obrigatório");
  }
  
  if (!avaliacao && avaliacao !== 0) {
    throw new Error("Avaliação é obrigatória");
  }
  
  const response = await fetch(`${BASE_URL}/feedbacks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessaoId,
      avaliacao,
      dor: dor || '',
      satisfacao: satisfacao || '',
      comentario: comentario || ''
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.mensagem || 'Erro ao enviar feedback');
  }
  
  return data;
};
