// contexts/SessoesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getSessoes } from "../api/sessoes";

const SessoesContext = createContext({});

export function SessoesProvider({ children }) {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchSessoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessoes();

      setSessoes(data);
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setLoading(false);
    }
  };
  if (token) {
    useEffect(() => {
      fetchSessoes();
    }, []);
  }

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

// Hook personalizado para usar o context
export function useSessoes() {
  const context = useContext(SessoesContext);
  if (!context) {
    throw new Error("useSessoes deve ser usado dentro de um SessoesProvider");
  }
  return context;
}
