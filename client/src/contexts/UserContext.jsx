import { createContext, useState, useContext, useEffect } from "react";
import { loginUtente, getCurrentUser,  updateUtente } from "../api/utente";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Inicializa loading como true e verifica token imediatamente
  const [loading, setLoading] = useState(() => {
    return !!sessionStorage.getItem("token");
  });
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!sessionStorage.getItem("token")) {

          setInitialized(true);
          setLoading(false);
          return;
        }

        const utente = await getCurrentUser();
        setUserData(utente);
      } catch (error) {
        console.error("Error initializing user:", error);
        window.location.href='/';
        
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
      const data = await loginUtente(credentials);
       
      if (data.token) {
        sessionStorage.setItem("token", data.token);
       sessionStorage.setItem("utenteId", data.utente.id);
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
    sessionStorage.clear();

    window.location.href = "/";
  };

  const updateUserData = async (utenteId, updatedData) => {
    try {
      setLoading(true);
      console.log(utenteId);
      
      // Envia os dados atualizados no corpo da requisição
  const utenteAtualizado= await updateUtente(utenteId, updatedData);    
      // Acessa a resposta correta
      setUserData(utenteAtualizado); 
      return utenteAtualizado; // Vai conter o objeto atualizado
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      
      if (error.response?.status === 404) {
        console.error("Utente não encontrado");
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