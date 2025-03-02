import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import NavBar from "../../components/NavBar.jsx";
import Inputs from "../../components/Inputs.jsx";
import Buttons from "../../components/botoes.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser(); // Usar o context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        role: 'utente'
      },
      lembrar
    );

      if (data.token) {
        navigate("/Inicio", { replace: true });
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || "Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <NavBar />
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center min-h-[80vh]">
          {/* Formulário com design melhorado */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transform transition-all">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h1>
              <p className="text-gray-600">Faça login para acessar sua conta</p>
            </div>
            
            {/* Mensagem de erro com estilo melhorado */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Email input com label melhorado */}
              <div className="form-group mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Inputs
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  style="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Password input com toggle de visibilidade */}
              <div className="form-group mb-5">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Inputs
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* "Lembrar-me" e "Esqueceu senha" em uma linha */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="lembrar"
                    type="checkbox"
                    checked={lembrar}
                    onChange={() => setLembrar(!lembrar)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>
                <Link
                  to="/RecuperarPasse"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Botão de login com animação de carregamento */}
              <Buttons
                type="submit"
                disabled={loading}
                style="w-full p-3 bg-indigo-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
                legenda={
                  loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      A entrar...
                    </>
                  ) : (
                    "Iniciar Sessão"
                  )
                }
              />
              
              {/* Opção de registro */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800">
                    Criar conta
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;