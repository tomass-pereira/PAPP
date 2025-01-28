import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router-dom";
import Inputs from "../components/Inputs.jsx";
import Buttons from "../components/botoes.jsx";
import { loginUtente } from '../api/utente';

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
      
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const credentials = {
      email: formData.email,
      senha: formData.senha
    };
    
    try {
      const data = await loginUtente(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('utente', JSON.stringify(data.utente));
      navigate('/Inicio'); // Usando navigate em vez de window.location
    } catch (err) {

      setError(err.message || 'Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
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
                id="senha"
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
              disabled={loading}
              style="login-button w-full p-3 bg-indigo-600 text-white rounded-md text-sm cursor-pointer mb-4 hover:bg-[#5558DD] disabled:bg-gray-400 disabled:cursor-not-allowed"
              legenda={loading ? "A entrar..." : "Iniciar Sessão"}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;