import React from "react";
import { useState } from "react";
import NavBar from "../components/NavBar";
import Inputs from "../components/Inputs";
import { RecoveryPassword } from "../api/utente";
import { Verifycode } from "../api/utente";
export default function RecuperarPasse() {
  const [success, setSuccess] = useState(false);
  const [successcod, setSuccesscod] = useState(false);
  const [error, setError] = useState("");


  const [email, setEmail] = useState("");
  const [codigo, setCodigo]=useState("");
 
 
  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      await RecoveryPassword(email);
      setSuccess(true);
    } catch (error) {
      alert("Erro ao enviar email");
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
     
    try {
      const response = await Verifycode(email, codigo);
      
      if (response.success) {
        // Se deu certo
        setSuccess(true);
        // Você pode redirecionar ou mostrar próximo passo
        // navigate('/reset-password') ou setStep(2)
      } else {
        // Se retornou falso mas não deu erro
        setError(response.message || 'Erro ao verificar código');
      }
    } catch (error) {
      // Se deu erro na requisição
      setError(error.message || 'Erro ao verificar código');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleCodigoChange = (e) => {
    setCodigo(e.target.value);
  };

  return (
    <>
      <NavBar />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          {success ? (
            <>
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Recupere a sua password
              </h1>

             

              <form
                action="#"
                className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                onSubmit={handleSubmitCode}
              >
                <p className="text-center text-lg font-medium">
                  Digite o código que lhe foi fornecido
                </p>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>

                  <div className="relative">
                    <Inputs
                      id="cod-recu"
                      label="Código de recuperação"
                      type="text"
                      value={codigo}
                      onChange={handleCodigoChange}
                      placeholder=""
                      style="w-full p-3 bg-white text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    />
                  </div>
                </div>

                <div></div>

                <button
                  
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Confirmar
                </button>
              </form>
            </>
            
          ) : (
            <>
              <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Recupere a sua password
              </h1>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                Digite o seu endereço de email e iremos enviar-lhe um link para
                recuperar a sua password
              </p>

              <form
                action="#"
                className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                onSubmit={handleSubmitEmail}
              >
                <p className="text-center text-lg font-medium">
                  Digite o seu endereço de email
                </p>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>

                  <div className="relative">
                    <Inputs
                      id="email"
                      label="Endereço email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="@"
                      style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    />
                  </div>
                </div>

                <div></div>

                <button
                  onClick={handleSubmitEmail}
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Enviar email
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
