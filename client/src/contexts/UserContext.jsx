import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUser, updateUtente } from "../api/utente";
import { getCurrentFisio } from "../api/fisioterapeuta";
import { loginUser } from "../api/auth.js";

const UserContext = createContext();

const decodeToken = () => {
  
  const token = sessionStorage.getItem("token");

  // Se não houver token, retornar valores padrão
  if (!token) {
    return { userId: null, isAdmin: false };
  }

  try {
    // Dividir o token em suas partes (header, payload, signature)
    const tokenParts = token.split(".");

    // Verificar se o token tem o formato esperado
    if (tokenParts.length !== 3) {
      throw new Error("Formato de token inválido");
    }

    // Decodificar a parte do payload (segunda parte do token)
    const payload = tokenParts[1];

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Decodificar Base64 para string
    const decodedPayload = atob(base64);

    // Converter string JSON para objeto
    const payloadObj = JSON.parse(decodedPayload);

    // Extrair dados do payload
    const userId = payloadObj.id;
    const isAdmin = payloadObj.isAdmin;
    const email = payloadObj.email;
    const nome = payloadObj.nome;

    // Retornar os valores extraídos
    return { userId, isAdmin, email, nome };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return { userId: null, isAdmin: false, email: null, nome: null };
  }
};

export function UserProvider({ children }) {
  // Extrair informações do token para inicialização
  const tokenInfo = decodeToken();

  // Inicializa loading como true e verifica token imediatamente
  const [loading, setLoading] = useState(() => {
    return !!sessionStorage.getItem("token");
  });
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Extrair e armazenar userId e isAdmin diretamente do token
  const [userId, setUserId] = useState(tokenInfo.userId);

  // Renomeado para seguir convenção camelCase
  const [isFisio, setIsFisio] = useState(tokenInfo.isAdmin);

  // Função para atualizar as informações do token nos estados
  const updateTokenInfo = useCallback(() => {
    const { userId, isAdmin } = decodeToken();
    setUserId(userId);

    setIsFisio(isAdmin);
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!sessionStorage.getItem("token")) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        // Atualiza informações do token
        updateTokenInfo();

        // Verifica se o token contém um ID válido
        if (!userId) {
          console.error("Token inválido ou sem ID de usuário");
          logout();
          return;
        }

        // Chama a API correta com base no isAdmin do token
        if (isFisio) {
          const fisioterapeuta = await getCurrentFisio();
          setUserData(fisioterapeuta);
        } else {
          const utente = await getCurrentUser();
          setUserData(utente);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeUser();
  }, [userId, isFisio, updateTokenInfo]);

  const login = async (credentials, lembrar) => {
    try {
      setLoading(true);
      const data = await loginUser(credentials);

      if (data.token) {
        console.log(lembrar);
        if (lembrar) {
          
          localStorage.setItem("token", data.token);
          sessionStorage.setItem("token", data.token);

        } else {
          sessionStorage.setItem("token", data.token);
        }

        // Atualiza as informações do token nos estados
        updateTokenInfo();

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
    setUserId(null);

    sessionStorage.clear();
    window.location.href = "/";
  };

  const updateUserData = async (userId, updatedData) => {
    try {
      setLoading(true);

      let updatedUser;

      // Com base no isAdmin, chama a API de atualização correta
      if (isFisio) {
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
    isFisio,
    userId,

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
