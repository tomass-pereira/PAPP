import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import Inputs from "../../components/Inputs.jsx";
import Buttons from "../../components/botoes.jsx";
import { useUser} from "../../contexts/UserContext.jsx";
function FisioLoginPage() {
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
        role: 'fisioterapeuta'
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
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:gap-[200px] max-w-[1200px] mx-auto">
          {/* Formulário */}
          <div className="form-section w-full lg:w-[600px] mt-[50px] lg:mt-[150px] p-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
              Área do Fisioterapeuta <span>👨‍⚕️</span>
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Acesse sua conta para gerenciar seus pacientes
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-6">
                <Inputs
                  id="email"
                  label="Email Profissional"
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

              <div className="forgot-password text-right mb-6">
                <Link
                  to="/RecuperarPasseFisioterapeuta"
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

          {/* SVG */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="mt-20 relative w-72 md:w-96 h-72 md:h-96">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-full h-full">
                {/* Círculo principal */}
                <circle 
                  cx="150" 
                  cy="150" 
                  r="100" 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="2"
                  opacity="0.1"
                />
                
                {/* Círculo pontilhado */}
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

                {/* Forma de corpo humano simplificada */}
                <path
                  d="M150,90
                     C180,90 190,110 190,130
                     C190,150 180,160 150,160
                     C120,160 110,150 110,130
                     C110,110 120,90 150,90
                     Z"
                  fill="#50e0b6"
                  opacity="0.2"
                />
                
                {/* Bastão de Asclépio (símbolo médico) simplificado */}
                <path
                  d="M150,120 L150,190"
                  stroke="#4f46e5"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                
                <path
                  d="M135,150 Q150,135 165,150 Q150,165 135,150"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Ondas representando movimento/terapia */}
                <path
                  d="M90,180 Q120,170 150,180 Q180,190 210,180"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  opacity="0.4"
                  strokeLinecap="round"
                />

                <path
                  d="M90,200 Q120,190 150,200 Q180,210 210,200"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  opacity="0.3"
                  strokeLinecap="round"
                />
                
                {/* Pontos decorativos */}
                <circle cx="150" cy="70" r="4" fill="#4f46e5" />
                <circle cx="150" cy="220" r="4" fill="#4f46e5" />
                <circle cx="90" cy="150" r="4" fill="#4f46e5" />
                <circle cx="210" cy="150" r="4" fill="#4f46e5" />
                
                {/* Símbolo de mais (Cruz médica) */}
                <path
                  d="M130,100 L170,100
                     M150,80 L150,120"
                  stroke="#4f46e5"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FisioLoginPage;
