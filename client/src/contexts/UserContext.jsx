import { createContext, useState, useContext, useEffect } from "react";
import { loginUtente } from "../api/utente";
import api from "../api/api";

const UserContext = createContext();

export function UserProvider({ children }) {
   console.log("Provider renderizou");
  const [userData, setUserData] = useState();


 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Não há token");
      return;
    }

    api.get('/utentes/current')
      .then(response => {
        setUserData(response.data.utente);
      })
      .catch(error => {
        console.log("Erro na requisição:", error);
      });

  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUtente(credentials);
      setUserData(data.utente);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // O resto do seu código permanece igual...

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