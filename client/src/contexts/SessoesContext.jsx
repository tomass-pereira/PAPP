// contexts/SessoesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getSessoes } from "../api/sessoes";

const SessoesContext = createContext({});

export function SessoesProvider({ children }) {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = sessionStorage.getItem("token");
  const utenteId= sessionStorage.getItem("utenteId");



  const fetchSessoes = async () => {
   
    try {
      setLoading(true);
      setError(null);
      const data = await getSessoes(utenteId);
      setSessoes(data);

    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
   
      console.log("entrou");
      fetchSessoes();
   
      setSessoes([]);
      setError(null);
    
  }, [token]);
  

  return (
    <SessoesContext.Provider
      value={{
        sessoes,
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
