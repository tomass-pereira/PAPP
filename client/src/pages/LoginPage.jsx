import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router-dom";
import Inputs from "../components/Inputs.jsx";
import Buttons from "../components/botoes.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guarda o token e os dados do utente
        localStorage.setItem('token', data.token);
        localStorage.setItem('utente', JSON.stringify(data.utente));
        
        // Redireciona para a página principal
        navigate('/Inicio');
      } else {
        alert(data.message); // Você pode usar um componente de toast aqui
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container flex gap-[150px] max-w-[1200px] mx-auto p-5">
        <div>
          <div className="mt-20 relative w-96 h-96">
            <div className="relative top-10 left-6 w-96 h-96 rounded-full overflow-hidden">
              <img
                src="../imgs/logo2.png"
                alt="Profile Image"
                className="absolute z-20 w-full h-full rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="form-section mt-[150px] flex-1 w-[600px] p-5 rounded-lg h-auto">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2 mb-6">
            Olá, outra vez! <span>👋</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-6">
              <Inputs
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
            </div>

            <div className="form-group mb-6">
              <Inputs
                id="senha"  // Mudei de password para senha para manter consistência com o backend
                label="Password"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
            </div>

            <div className="forgot-password text-right mb-8">
              <Link
                to="/RecuperarPasse"
                className="text-[#4f4fb9] hover:text-[#3e3e9e] text-sm"
              >
                Esqueceu-se a password?
              </Link>
            </div>

            <Buttons
              type="submit"
              style="login-button w-full p-3 bg-indigo-600 text-white rounded-md text-sm cursor-pointer mb-4 hover:bg-[#5558DD]"
              legenda="Iniciar Sessão"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;