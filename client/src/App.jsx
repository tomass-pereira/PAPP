import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import { UserProvider } from './contexts/UserContext.jsX';
import RecuperarPasse from './pages/RecuperarPasse.jsx';
import First from './pages/First';
import MinhasSessoes from './pages/PaginaInicial/MinhasSessoes.jsx';
import Inicio from './pages/PaginaInicial/Inicio.jsx';
import Exercicios from './pages/PaginaInicial/Exercicios.jsx';
import AgendarSessao from './pages/PaginaInicial/AgendarSessao.jsx';
import ErrorPage from './pages/Error.jsx';

const AnimatedPage = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -200
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.3
      }
    }
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

// Wrapper for routes with animations
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <AnimatedPage>
              <First />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/RecuperarPasse" 
          element={
            <AnimatedPage>
              <RecuperarPasse />
            </AnimatedPage>
          } 
        />
       
        <Route 
          path="/AgendarSessao" 
          element={<AgendarSessao />} 
        />
        <Route 
          path="/exercicios" 
          element={<Exercicios />} 
        />
        <Route 
          path="/Inicio" 
          element={<Inicio />} 
        />
        <Route 
          path="/MinhasSessoes" 
          element={<MinhasSessoes />} 
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
    <UserProvider>

    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;