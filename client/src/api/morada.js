import { BASE_URL } from './config';

export const buscaMorada = async (codigoPostal) => {
  const response = await fetch(`${BASE_URL}/api/morada/${codigoPostal}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao buscar endereço");
  }

  return data;
};
