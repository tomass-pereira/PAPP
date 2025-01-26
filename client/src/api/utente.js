import { BASE_URL } from './config';
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

export const loginUtente = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  console.log("Dados do usuário:", data);

  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer login");
  }
  

  return data;
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