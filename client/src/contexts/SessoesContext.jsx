import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  getSessoes, 
  getSessoesCanceladas, 
  concluirSessao, 
  feedbackSessao, 
  getAllSessoes 
} from "../api/sessoes";
import { useUser } from "./UserContext";

const SessoesContext = createContext({});

export function SessoesProvider({ children }) {
  const { userId } = useUser();
  const token = sessionStorage.getItem("token");
  
  // Core state
  const [sessoes, setSessoes] = useState([]);
  const [allSessoes, setAllSessoes] = useState([]);
  const [sessoesCanceladas, setSessoesCanceladas] = useState([]);
  const [sessoesReservadas, setSessoesReservadas] = useState([]);
  const [sessoesConcluidas, setSessoesConcluidas] = useState([]);
  const [sessoesPendenteFeedback, setSessoesPendenteFeedback] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cancelled sessions for current user
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

  // Update sessions that need feedback
  const atualizarSessoesPendenteFeedback = useCallback((sessoesConcluidas) => {
    // Get IDs of sessions that already received feedback from localStorage
    const feedbacksConcluidos = JSON.parse(
      localStorage.getItem('feedbacksConcluidos') || '[]'
    );
    
    // Filter recently completed sessions (last 2 days) without feedback
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

  // Main session fetch and processing
  const fetchSessoes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch user sessions
      const data = await getSessoes(userId);
      setSessoes(data);
      
      // Fetch all sessions (for physio role)
      const todasSessoes = await getAllSessoes();
      setAllSessoes(todasSessoes);
      
      // Filter sessions reserved by current user
      const reservadas = data.filter(sessao => 
        sessao.status === "reservada" && sessao.utenteId === userId
      );
      setSessoesReservadas(reservadas);
      
      // Complete past sessions if needed and refresh data
      const necessitaRecarregar = await concluirSessoesPassadas(reservadas);
      
      if (necessitaRecarregar) {
        // Reload data if sessions were completed
        const dadosAtualizados = await getSessoes(userId);
        setSessoes(dadosAtualizados);
        
        // Update filtered lists
        const novasReservadas = dadosAtualizados.filter(s => 
          s.status === "reservada" && s.utenteId === userId
        );
        setSessoesReservadas(novasReservadas);
        
        const novasConcluidas = dadosAtualizados.filter(s => 
          s.status === "concluida" && s.utenteId === userId
        );
        setSessoesConcluidas(novasConcluidas);
        
        // Update sessions needing feedback
        atualizarSessoesPendenteFeedback(novasConcluidas);
      } else {
        // If no reload needed, just update completed list
        const concluidas = data.filter(s => 
          s.status === "concluida" && s.utenteId === userId
        );
        setSessoesConcluidas(concluidas);
        
        // Update sessions needing feedback
        atualizarSessoesPendenteFeedback(concluidas);
      }
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, concluirSessoesPassadas, atualizarSessoesPendenteFeedback]);

  // Submit feedback for a session
  const enviarFeedback = useCallback((dadosFeedback) => {
    // Add to feedbacks list
    const novosFeedbacks = [...feedbacks, dadosFeedback];
    setFeedbacks(novosFeedbacks);
    
    // Send to API
    feedbackSessao(dadosFeedback);
    
    // Update localStorage to mark session as having received feedback
    const feedbacksConcluidos = JSON.parse(
      localStorage.getItem('feedbacksConcluidos') || '[]'
    );
    feedbacksConcluidos.push(dadosFeedback.sessaoId);
    localStorage.setItem('feedbacksConcluidos', JSON.stringify(feedbacksConcluidos));
    
    // Remove from pending feedback list
    setSessoesPendenteFeedback(prev => 
      prev.filter(sessao => sessao._id !== dadosFeedback.sessaoId)
    );
    
    return true;
  }, [feedbacks]);

  // Skip feedback for a session
  const pularFeedback = useCallback((sessaoId) => {
    // Mark session as having "received feedback" even though it was skipped
    const feedbacksConcluidos = JSON.parse(
      localStorage.getItem('feedbacksConcluidos') || '[]'
    );
    feedbacksConcluidos.push(sessaoId);
    localStorage.setItem('feedbacksConcluidos', JSON.stringify(feedbacksConcluidos));
    
    // Update pending feedback list
    setSessoesPendenteFeedback(prev => 
      prev.filter(sessao => sessao._id !== sessaoId)
    );
  }, []);

  // Get next session needing feedback
  const getProximaSessaoPendenteFeedback = useCallback(() => {
    return sessoesPendenteFeedback.length > 0 ? sessoesPendenteFeedback[0] : null;
  }, [sessoesPendenteFeedback]);

  // Load data when user is authenticated
  useEffect(() => {
    if (token && userId) {
      fetchSessoes();
      fetchSessoesCanceladas();
      
      // Load saved feedbacks from localStorage
      const feedbacksSalvos = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      setFeedbacks(feedbacksSalvos);
    } else {
      // Clear data when not authenticated
      setSessoes([]);
      setSessoesCanceladas([]);
      setSessoesReservadas([]);
      setSessoesConcluidas([]);
      setSessoesPendenteFeedback([]);
      setAllSessoes([]);
      setError(null);
    }
  }, [token, userId, fetchSessoes, fetchSessoesCanceladas]);

  // Prepare context value
  const contextValue = {
    sessoes,
    sessoesCanceladas,
    sessoesReservadas,
    sessoesConcluidas,
    sessoesPendenteFeedback,
    loading,
    error,
    fetchSessoes,
    allSessoes,
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