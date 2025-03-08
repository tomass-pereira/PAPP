import React, { createContext, useState, useContext } from 'react';
import { getPlanos, PostPlano } from '../api/planos';

// Criar o contexto
const PlanoContext = createContext();


export const usePlanos = () => useContext(PlanoContext);

// Provider que envolverá a aplicação
export const PlanoProvider = ({ children }) => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlano, setCurrentPlano] = useState(null);

  
  const fetchPlanos = async (utenteId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPlanos(utenteId);
      setPlanos(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao buscar planos');
      return [];
    } finally {
      setLoading(false);
    }
  };

    const criarPlano = async (dadosplano) => {
      setLoading(true);
    setError(null);
    
    try {
      console.log("API:", dadosplano);
      const response = await PostPlano(dadosplano);
      setPlanos(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao criar plano');
      return [];
    } finally {
      setLoading(false);
    }
  };

  
 

  const updatePlanoState = (planoAtualizado) => {
    setPlanos(prevPlanos => 
      prevPlanos.map(p => p._id === planoAtualizado._id ? planoAtualizado : p)
    );
    
    if (currentPlano && currentPlano._id === planoAtualizado._id) {
      setCurrentPlano(planoAtualizado);
    }
    
    return planoAtualizado;
  };

  // Função para atualizar o estado depois de remover um plano
  const removePlano = (planoId) => {
    setPlanos(prevPlanos => prevPlanos.filter(p => p._id !== planoId));
    
    // Limpar o plano atual se for o mesmo
    if (currentPlano && currentPlano._id === planoId) {
      setCurrentPlano(null);
    }
    
    return true;
  };

  // Calcular o progresso de um plano
  const calcularProgressoPlano = (plano) => {
    if (!plano || !plano.sessoes || plano.sessoes.length === 0) {
      return {
        sessoesRealizadas: 0,
        sessoesTotais: 0,
        percentualConcluido: 0
      };
    }

    const sessoesTotais = plano.sessoes.length;
    const sessoesRealizadas = plano.sessoes.filter(
      sessao => sessao.status === 'Realizada'
    ).length;

    const percentualConcluido = Math.round((sessoesRealizadas / sessoesTotais) * 100);

    return {
      sessoesRealizadas,
      sessoesTotais,
      percentualConcluido
    };
  };

  const value = {
    planos,
    loading,
    error,
    currentPlano,
    fetchPlanos,
    criarPlano,
    updatePlanoState,
    removePlano,
    calcularProgressoPlano,
    setLoading,
    setError
  };

  return (
    <PlanoContext.Provider value={value}>
      {children}
    </PlanoContext.Provider>
  );
};

export default PlanoContext;