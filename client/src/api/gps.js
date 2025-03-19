import { BASE_URL } from './config';

export const getCoordenadas = async (endereco) => {
  const url = new URL(`${BASE_URL}/viagens/coordenadas`);
  url.searchParams.append('endereco', endereco);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao obter coordenadas");
  }
  
  return data;
}
export const getDuracao = async (coordenadas) => {
    const url = new URL(`${BASE_URL}/viagens/duracao`);
    
    url.searchParams.append('start', coordenadas.start);
    url.searchParams.append('end', coordenadas.end);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao calcular duração");
    }
    return data;
  }