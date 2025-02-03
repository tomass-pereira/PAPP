import { createContext, useState, useContext, useEffect } from "react";
import { loginUtente } from "../api/utente";
import api from "../api/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Inicializa loading como true e verifica token imediatamente
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setInitialized(true);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/utentes/current');
        setUserData(response.data.utente);
      } catch (error) {
        console.log("Erro na requisição:", error);
        localStorage.removeItem("token");

        setUserData(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchUserData();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await loginUtente(credentials);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUserData(data.utente);
      }
      
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const updateUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/utentes/current');
      setUserData(response.data.utente);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Não renderiza nada até a verificação inicial estar completa
  if (!initialized) {
    return null;
  }

  const value = {
    userData,
    login,
    logout,
    loading,
    updateUserData,
    isAuthenticated: !!userData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
} 