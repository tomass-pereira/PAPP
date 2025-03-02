import { createContext, useContext, useState, useEffect } from "react";
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


  const token = sessionStorage.getItem("token");
  const { userId } = useUser();

  const fetchSessoesCanceladas = async () => {
    try {
      console.log("aqui",userId);
      const data = await getSessoesCanceladas(userId);
      setSessoesCanceladas(data);
    } catch (error) {
      console.error("Erro ao buscar sessões canceladas:", error);
    }
  };

  const fetchSessoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessoes(userId);
  
      setSessoes(data);
      const reservadas = data.filter(sessao => 
        sessao.status === "reservada" && sessao.utenteId === userId
      );
      setSessoesReservadas(reservadas);
  
      const agora = new Date();
   
      const sessoesParaConcluir = reservadas.filter(sessao => {
        const dataInicio = new Date(sessao.dataHoraInicio);
        return dataInicio < agora;
      });
  
      if (sessoesParaConcluir.length > 0) {
        let houveErro = false;
        
        for (const sessao of sessoesParaConcluir) {
          try {
            await concluirSessao(sessao._id);
          } catch (err) {
            console.error(`Erro ao concluir sessão ${sessao._id}:`, err);
            houveErro = true;
          }
        }
  
        if (houveErro) {
          console.log('Houve erros ao concluir algumas sessões. Recarregando dados...');
        }
  
        const dadosAtualizados = await getSessoes(userId);
        setSessoes(dadosAtualizados);
        
        const novasReservadas = dadosAtualizados.filter(sessao => 
          sessao.status === "reservada" && sessao.utenteId === userId
        );
        setSessoesReservadas(novasReservadas);
        
        const novasConcluidas = dadosAtualizados.filter(sessao => 
          sessao.status === "concluida" && sessao.utenteId === userId
        );
        setSessoesConcluidas(novasConcluidas);
      } else {
        const concluidas = data.filter(sessao => 
          sessao.status === "concluida" && sessao.utenteId === userId
        );
        setSessoesConcluidas(concluidas);
      }
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
   
      fetchSessoes();
      fetchSessoesCanceladas();
   
    } else {
      setSessoes([]);
      setSessoesCanceladas([]);
      setError(null);
    }
  }, [token, userId]);

  return (
    <SessoesContext.Provider
      value={{
        sessoes,
        sessoesCanceladas,
        sessoesReservadas,
        sessoesConcluidas,
        loading,
        error,
        fetchSessoes,
      }}
    >
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