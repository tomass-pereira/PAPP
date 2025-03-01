import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, updateUtente } from "../api/utente";
import { getCurrentFisio } from "../api/fisioterapeuta";
import { loginUser } from "../api/auth.js";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Inicializa loading como true e verifica token imediatamente
  const [loading, setLoading] = useState(() => {
    return !!sessionStorage.getItem("token");
  });
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [IsFisio, setIsFisio] = useState(() => {
  
    return sessionStorage.getItem("isFisio") === "true";
  });
  
  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!sessionStorage.getItem("token")) {
          setInitialized(true);
          setLoading(false);
          return;
        }
        
        // Verifica se é fisioterapeuta ou utente
        const userIsFisio = sessionStorage.getItem("isFisio") === "true";
        
        // Chama a API correta com base no isAdmin
        if (userIsFisio) {
          const fisioterapeuta = await getCurrentFisio();
          setUserData(fisioterapeuta);
        } else {
          const utente = await getCurrentUser();
          setUserData(utente);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        window.location.href = '/';
        setUserData(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeUser();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await loginUser(credentials);
       
      if (data.token) {
        // Armazena o token e o ID do usuário
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.user.id);
        
        // Armazena e define o isAdmin
        const userIsFisio = !!data.user.isAdmin;
      
        setIsFisio(userIsFisio);
        
        // Define os dados do usuário
        setUserData(data.user);
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
    setIsFisio(false);
    sessionStorage.clear();
    window.location.href = "/";
  };

  const updateUserData = async (userId, updatedData) => {
    try {
      setLoading(true);
      
      let updatedUser;
      
      // Com base no isAdmin, chama a API de atualização correta
      if (IsFisio) {
        // Usuário é fisioterapeuta
        updatedUser = await updateFisioterapeuta(userId, updatedData);
      } else {
        // Usuário é utente
        updatedUser = await updateUtente(userId, updatedData);
      }
      
      // Atualiza os dados do usuário no contexto
      setUserData(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      
      if (error.response?.status === 404) {
        console.error("Usuário não encontrado");
      }
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
    IsFisio,
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