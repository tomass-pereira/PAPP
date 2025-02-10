// contexts/SessoesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getSessoes, getSessoesCanceladas } from "../api/sessoes";

const SessoesContext = createContext({});

export function SessoesProvider({ children }) {
  const [sessoes, setSessoes] = useState([]);
  const [sessoesCanceladas, setSessoesCanceladas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessoesReservadas, setSessoesReservadas] = useState([]);
  const token = sessionStorage.getItem("token");
  const utenteId= sessionStorage.getItem("utenteId");

  const fetchSessoesCanceladas = async () => {
    try {
      const data = await getSessoesCanceladas(utenteId);
      setSessoesCanceladas(data);
    } catch (error) {
      console.error("Erro ao buscar sessões canceladas:", error);
    }
  };

  

  const fetchSessoes = async () => {
   
    try {
      setLoading(true);
      setError(null);
      const data = await getSessoes(utenteId);
      setSessoes(data);
      const reservadas = data.filter(sessao => sessao.status === "reservada");
      setSessoesReservadas(reservadas);
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (token && utenteId) {
      fetchSessoes();
      fetchSessoesCanceladas();
    } else {
      setSessoes([]);
      setSessoesCanceladas([]);
      setError(null);
    }
  }, [token, utenteId]);
  

  return (
    <SessoesContext.Provider
      value={{
        sessoes,
        sessoesCanceladas,
        sessoesReservadas,
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
