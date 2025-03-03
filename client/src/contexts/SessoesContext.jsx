import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSessoes, getSessoesCanceladas, concluirSessao } from "../api/sessoes";
import { useUser } from "./UserContext";

const SessoesContext = createContext({});

export function SessoesProvider({ children }) {
  const [sessoes, setSessoes] = useState([]);
  const [sessoesCanceladas, setSessoesCanceladas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessoesReservadas, setSessoesReservadas] = useState([]);
  const [sessoesConcluidas, setSessoesConcluidas] = useState([]);
  // Novo estado para rastrear sessões que precisam de feedback
  const [sessoesPendenteFeedback, setSessoesPendenteFeedback] = useState([]);
  // Estado para armazenar feedbacks enviados (simula banco de dados)
  const [feedbacks, setFeedbacks] = useState([]);

  const token = sessionStorage.getItem("token");
  const { userId } = useUser();

  const fetchSessoesCanceladas = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await getSessoesCanceladas(userId);
      setSessoesCanceladas(data);
    } catch (error) {
      console.error("Erro ao buscar sessões canceladas:", error);
    }
  }, [userId]);

  const concluirSessoesPassadas = useCallback(async (sessoesReservadas) => {
    const agora = new Date();
    const sessoesParaConcluir = sessoesReservadas.filter(sessao => {
      const dataInicio = new Date(sessao.dataHoraInicio);
      return dataInicio < agora;
    });

    if (!sessoesParaConcluir.length) return false;

    let houveErro = false;
    
    // Concluir as sessões passadas
    await Promise.all(
      sessoesParaConcluir.map(async (sessao) => {
        try {
          await concluirSessao(sessao._id);
        } catch (err) {
          console.error(`Erro ao concluir sessão ${sessao._id}:`, err);
          houveErro = true;
        }
      })
    );

    return houveErro || sessoesParaConcluir.length > 0;
  }, []);

  const fetchSessoes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Buscar todas as sessões
      const data = await getSessoes(userId);
      setSessoes(data);
      
      // Filtrar sessões reservadas pelo usuário
      const reservadas = data.filter(sessao => 
        sessao.status === "reservada" && sessao.utenteId === userId
      );
      setSessoesReservadas(reservadas);
      
      // Concluir sessões passadas se necessário
      const necessitaRecarregar = await concluirSessoesPassadas(reservadas);
      
      // Recarregar dados se necessário
      if (necessitaRecarregar) {
        const dadosAtualizados = await getSessoes(userId);
        setSessoes(dadosAtualizados);
        
        // Atualizar listas filtradas
        setSessoesReservadas(
          dadosAtualizados.filter(s => s.status === "reservada" && s.utenteId === userId)
        );
        
        const concluidas = dadosAtualizados.filter(s => 
          s.status === "concluida" && s.utenteId === userId
        );
        setSessoesConcluidas(concluidas);
        
        // Verificar sessões que precisam de feedback
        atualizarSessoesPendenteFeedback(concluidas);
      } else {
        // Se não recarregou, apenas atualizar a lista de concluídas
        const concluidas = data.filter(s => 
          s.status === "concluida" && s.utenteId === userId
        );
        setSessoesConcluidas(concluidas);
        
        // Verificar sessões que precisam de feedback
        atualizarSessoesPendenteFeedback(concluidas);
      }
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, concluirSessoesPassadas]);

  // Identifica sessões concluídas que ainda não receberam feedback
  const atualizarSessoesPendenteFeedback = useCallback((sessoesConcluidas) => {
    // Recuperar IDs de sessões que já receberam feedback do localStorage
    const feedbacksConcluidos = JSON.parse(localStorage.getItem('feedbacksConcluidos') || '[]');
    
    // Filtrar sessões concluídas recentemente (últimos 2 dias) que ainda não têm feedback
    const agora = new Date();
    const doisDiasAtras = new Date(agora);
    doisDiasAtras.setDate(agora.getDate() - 2);
    
    const pendentes = sessoesConcluidas.filter(sessao => {
      const dataConclusao = new Date(sessao.dataHoraFim || sessao.dataHoraInicio);
      const recente = dataConclusao >= doisDiasAtras;
      const semFeedback = !feedbacksConcluidos.includes(sessao._id);
      return recente && semFeedback;
    });
    
    setSessoesPendenteFeedback(pendentes);
  }, []);

  // Efeito para carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    if (token && userId) {
      fetchSessoes();
      fetchSessoesCanceladas();
      
      // Carregar feedbacks salvos do localStorage
      const feedbacksSalvos = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      setFeedbacks(feedbacksSalvos);
    } else {
      // Limpar dados quando não autenticado
      setSessoes([]);
      setSessoesCanceladas([]);
      setSessoesReservadas([]);
      setSessoesConcluidas([]);
      setSessoesPendenteFeedback([]);
      setError(null);
    }
  }, [token, userId, fetchSessoes, fetchSessoesCanceladas]);

  // Função para enviar feedback de uma sessão
  const enviarFeedback = useCallback((dadosFeedback) => {
   
    const novosFeedbacks = [...feedbacks, dadosFeedback];
    setFeedbacks(novosFeedbacks);
    
    // Salvar no localStorage (simulando banco de dados)
    localStorage.setItem('feedbacks', JSON.stringify(novosFeedbacks));
    
    // Marcar a sessão como "já recebeu feedback"
    const feedbacksConcluidos = JSON.parse(localStorage.getItem('feedbacksConcluidos') || '[]');
    feedbacksConcluidos.push(dadosFeedback.sessaoId);
    localStorage.setItem('feedbacksConcluidos', JSON.stringify(feedbacksConcluidos));
    
  
    setSessoesPendenteFeedback(prev => 
      prev.filter(sessao => sessao._id !== dadosFeedback.sessaoId)
    );
    
    return true;
  }, [feedbacks]);

  // Função para pular o feedback de uma sessão
  const pularFeedback = useCallback((sessaoId) => {
    // Marcar a sessão como "já recebeu feedback" mesmo que tenha sido pulada
    const feedbacksConcluidos = JSON.parse(localStorage.getItem('feedbacksConcluidos') || '[]');
    feedbacksConcluidos.push(sessaoId);
    localStorage.setItem('feedbacksConcluidos', JSON.stringify(feedbacksConcluidos));
    
    // Atualizar a lista de sessões pendentes
    setSessoesPendenteFeedback(prev => 
      prev.filter(sessao => sessao._id !== sessaoId)
    );
  }, []);

  const getProximaSessaoPendenteFeedback = useCallback(() => {
    return sessoesPendenteFeedback.length > 0 ? sessoesPendenteFeedback[0] : null;
  }, [sessoesPendenteFeedback]);

  const contextValue = {
    sessoes,
    sessoesCanceladas,
    sessoesReservadas,
    sessoesConcluidas,
    sessoesPendenteFeedback,
    loading,
    error,
    fetchSessoes,
    fetchSessoesCanceladas,
    enviarFeedback,
    pularFeedback,
    getProximaSessaoPendenteFeedback,
    feedbacks
  };

  return (
    <SessoesContext.Provider value={contextValue}>
      {children}
    </SessoesContext.Provider>
  );
}

export function useSessoes() {
  const context = useContext(SessoesContext);
  if (!context) {
    throw new Error("useSessoes deve ser usado dentro de um SessoesProvider");
  }
  return context;
}