import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Inputs from "../components/Inputs.jsx";
import Buttons from "../components/botoes.jsx";
import { useUser } from "../contexts/UserContext.jsX";
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser(); // Usar o context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login({
        email: formData.email,
        senha: formData.senha,
        lembrar,
      });

      if (data.token) {
        navigate("/Inicio", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar />
<div className="container flex gap-[200px] max-w-[1200px] mx-auto p-6">
  {/* Formulário agora à esquerda */}
  <div className="form-section mt-[150px] flex-1 w-[600px] p-2 pl-0 rounded-lg h-auto">
    <h1 className="text-3xl font-bold flex justify-center ml-0 pl-0 items-center gap-2 mb-6">
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
      <div className="flex items-center mb-6"></div>
      <Buttons
        type="submit"
        disabled={loading}
        style="login-button w-full p-3 bg-indigo-600 text-white rounded-md text-sm cursor-pointer mb-4 hover:bg-[#5558DD] disabled:bg-gray-400 disabled:cursor-not-allowed"
        legenda={loading ? "A entrar..." : "Iniciar Sessão"}
      />
    </form>
  </div>

  {/* SVG agora à direita */}
  <div className="flex items-center justify-center">
    <div className="mt-20 relative w-96 h-96">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-full h-full">
        {/* SVG content permanece o mesmo */}
        <circle 
          cx="150" 
          cy="150" 
          r="100" 
          fill="none" 
          stroke="#4f46e5" 
          strokeWidth="2"
          opacity="0.1"
        />
        
        <path
          d="M150,50 
             A100,100 0 0,1 250,150
             A100,100 0 0,1 150,250
             A100,100 0 0,1 50,150
             A100,100 0 0,1 150,50"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeDasharray="15,10"
        />

        <path
          d="M150,100
             C190,100 200,130 200,150
             C200,170 190,200 150,200
             C110,200 100,170 100,150
             C100,130 110,100 150,100
             Z"
          fill="#50e0b6"
          opacity="0.2"
        />

        <path
          d="M130,140 L170,140
             M150,120 L150,160"
          stroke="#4f46e5"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <path
          d="M80,150 Q150,180 220,150"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          opacity="0.3"
          strokeLinecap="round"
        />

        <path
          d="M90,120 Q150,150 210,120"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          opacity="0.2"
          strokeLinecap="round"
        />

        <circle cx="150" cy="90" r="4" fill="#4f46e5" />
        <circle cx="150" cy="210" r="4" fill="#4f46e5" />
        <circle cx="90" cy="150" r="4" fill="#4f46e5" />
        <circle cx="210" cy="150" r="4" fill="#4f46e5" />
      </svg>
    </div>
  </div>
</div>
    </>
  );
}

export default LoginPage;
