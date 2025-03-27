import { BASE_URL } from './config';
import api from "../api/api";
import bcryptjs from 'bcryptjs';

export const verificarSenha = async (senha, hashArmazenado) => {
  const corresponde = await bcryptjs.compare(senha, hashArmazenado);
  return corresponde; 
};


export const getAllUtentes = async () => {

  const response = await api.get(`${BASE_URL}/utentes/`);
  return response.data;
  
}
export const registarUtente = async (payload) => {
  const response = await fetch(`${BASE_URL}/utentes/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar conta");
  }

  return data;
};
export const updateUtente = async (utenteId, updatedData) => {
  try {
    console.log(updatedData);
    console.log(utenteId);
    const response = await api.put(`/utentes/${utenteId}`, updatedData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Utente não encontrado");
    }
    throw error;
  }
};
export const BloquearUtente = async (utenteId) => {
  try {
    
    const response = await api.get(`/auth/rejeitar/${utenteId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Utente não encontrado");
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  
  
 try{
  const response = await api.get('/utentes/current');
  return response.data.utente;

 }
 catch(error){
  if (error.response?.status === 404) {
    window.location.href = "/";
    return;
  }

 
};
}




export const RecoveryPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/utentes/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao recuperar senha");
  }

  return data;

}
export const Verifycode = async (email, codigo) => {
  const response = await fetch(`${BASE_URL}/utentes/verificar-codigo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, codigo}),
  });

  const data = await response.json();
  

  if (!response.ok) {
    throw new Error(data.message || "Erro ao verificar o código");
  }

  return data;

}
export const alterarSenha = async (email, novaSenha) => {
  const response = await fetch(`${BASE_URL}/utentes/alterar-senha`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, novaSenha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao alterar senha");
  }

  return data;
}