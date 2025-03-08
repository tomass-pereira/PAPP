import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "./pages/auth/LoginPage.jsx";
import FisioLoginPage from "./pages/auth/FisioLoginPage.jsx";

import CreateAccount from "./pages/CreateAccount.jsx";
import { UserProvider } from "./contexts/UserContext.jsX";
import { SessoesProvider } from "./contexts/SessoesContext.jsX";
import { NotificacoesProvider } from "./contexts/NotificacaoContext.jsx";
import { PlanoProvider } from "./contexts/PlanoContext.jsx";
import RecuperarPasse from "./pages/RecuperarPasse.jsx";
import First from "./pages/First";
import MinhasSessoes from "./pages/Main/MinhasSessoes.jsx";
import Inicio from "./pages/Main/Inicio.jsx";
import PlanosTratamento from "./pages/Main/PlanosTratamento.jsx";
import AgendarSessao from "./pages/Main/AgendarSessao.jsx";
import ErrorPage from "./pages/Error.jsx";
import NotificationsPage from "./pages/Main/NotificationsPage.jsx";
import CalendarioFisio from "./pages/admin/CalendarioFisio.jsx";
import Config from "./pages/Main/Config.jsx";
import Utentes from "./pages/admin/Utentes.jsx";
import GerirPlanos from "./pages/admin/GerirPlanos.jsx";

// AuthWrapper component
const AuthWrapper = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/LoginPage" replace />;
  }
  return children;
};

const AnimatedPage = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -200,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

// Protected AnimatedPage
const ProtectedAnimatedPage = ({ children }) => {
  return <AuthWrapper>{children}</AuthWrapper>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={
            <AnimatedPage>
              <First />
            </AnimatedPage>
          }
        />

        <Route path="/LoginFisio" element={<FisioLoginPage />} />
        <Route
          path="/RecuperarPasse"
          element={
            <AnimatedPage>
              <RecuperarPasse />
            </AnimatedPage>
          }
        />
        <Route
          path="/Registar"
          element={
            <AnimatedPage>
              <CreateAccount />
            </AnimatedPage>
          }
        />

        <Route
          path="/LoginPage"
          element={
            <AnimatedPage>
              <LoginPage />
            </AnimatedPage>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/AgendarSessao"
          element={
            <ProtectedAnimatedPage>
              <AgendarSessao />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/planosTratamento"
          element={
            <ProtectedAnimatedPage>
              <PlanosTratamento />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/Fisio/Calendario"
          element={
            <ProtectedAnimatedPage>
              <CalendarioFisio />
            </ProtectedAnimatedPage>
          }
         
        />
         <Route
          path="/Fisio/Utentes"
          element={
            <ProtectedAnimatedPage>
              <Utentes />
            </ProtectedAnimatedPage>
          }
         
        />
        <Route
          path="/NotificationsPage"
          element={
            <ProtectedAnimatedPage>
              <NotificationsPage />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/Config"
          element={
            <ProtectedAnimatedPage>
              <Config />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/Inicio"
          element={
            <ProtectedAnimatedPage>
              <Inicio />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/MinhasSessoes"
          element={
            <ProtectedAnimatedPage>
              <MinhasSessoes />
            </ProtectedAnimatedPage>
          }
        />
        <Route
          path="/Fisio/GerirPlanos"
          element={
            <ProtectedAnimatedPage>
              <GerirPlanos />
            </ProtectedAnimatedPage>
          }
        />

        {/* Rota de erro */}
        <Route
          path="*"
          element={
            <AnimatedPage>
              <ErrorPage />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <UserProvider>
        <PlanoProvider>
          <NotificacoesProvider>
            <SessoesProvider>
              <AnimatedRoutes />
            </SessoesProvider>
          </NotificacoesProvider>
        </PlanoProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
