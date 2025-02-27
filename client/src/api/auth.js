import { BASE_URL } from './config';

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();


  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer login");
  }
  

  return data;
}