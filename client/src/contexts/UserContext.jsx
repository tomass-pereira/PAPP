// src/contexts/UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react"; // Adicionar useEffect
import { loginUtente } from "../api/utente";
import axios from "axios"; // Importar axios

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("utente");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (credentials) => {
    try {
      const data = await loginUtente(credentials);
      setUserData(data.utente);
      console.log("Dados do utilizador:", data.utente);
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUserData(null);
    window.location.href = "/login";
  };

  // Verificação periódica do status
  useEffect(() => {
    if (userData) {
      const checkStatus = async () => {
        try {
          const response = await axios.get("/api/utentes/status"); // Ajuste a rota conforme sua API

          if (response.data.StatusConta === "rejeitado") {
            logout();
            alert("A sua conta foi bloqueada "); 
          }
        } catch (error) {
          console.error("Erro ao verificar status:", error);
        }
      };

      // Verifica a cada 30 segundos
      const interval = setInterval(checkStatus, 30000);

      // Limpa o interval
      return () => clearInterval(interval);
    }
  }, [userData]);

  // Interceptor para verificar status em todas as respostas
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (response.data?.utente?.StatusConta) {
          const StatusConta = response.data.utente.status;
          if (
            StatusConta === "rejeitado" ||
            StatusConta === "aprovado" ||
            StatusConta === "inativo"
          ) {
            logout();
            alert("Sua conta foi " + StatusConta);
          }
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    userData,
    login,
    logout,
    isAuthenticated: !!userData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
