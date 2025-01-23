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