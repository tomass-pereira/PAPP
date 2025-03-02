import { createContext, useContext, useState, useEffect } from "react";
import { getNotificacoes } from "../api/notificacao";
import { useUser } from "./UserContext";
const NotificacoesContext = createContext({});

export function NotificacoesProvider({ children }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [naoLidas, setnaoLidas] = useState(0);

  const token = sessionStorage.getItem("token");
  const {userId} = useUser();

  const fetchNotificacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotificacoes(userId);
    
      
      setNotificacoes(data);

      
      const naoLidas = data.filter(notificacao => !notificacao.lida);


      setnaoLidas(naoLidas.length);
    
    } catch (error) {
      setError(error.message);
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchNotificacoes();
    } else {
      setNotificacoes([]);
      setnaoLidas([]);
      setError(null);
    }
  }, [token,userId]);

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        naoLidas,
        loading,
        error,
        fetchNotificacoes,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error("useNotificacoes deve ser usado dentro de um NotificacoesProvider");
  }
  return context;
};