import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Inputs from "../components/Inputs";
import { RecoveryPassword, Verifycode, alterarSenha } from "../api/utente";
import Alert from "../components/Alert";

export default function RecuperarPasse() {
  const [step, setStep] = useState("email");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [passe, setPasse] = useState("");
  const [confPasse, setConfPasse] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      await RecoveryPassword(email);
      setStep("code");
    } catch (error) {
      setError("Erro ao enviar email");
    }
  };

  const handleSubmitPasse = async (e) => {
    e.preventDefault();

    if (passe !== confPasse) {
      setError("As palavras-passe não coincidem");
      return;
    }

    if (passe.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres");
      return;
    }

    try {
      await alterarSenha(email, passe);
      setSuccess(true);
    } catch (error) {
      setError("Erro ao alterar palavra-passe");
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    try {
      const response = await Verifycode(email, codigo);

      if (response.success) {
        setStep("reset");
        setError("");
      } else {
        setError(response.message || "Código inválido");
      }
    } catch (error) {
      setError(error.message || "Erro ao verificar código");
    }
  };

  const renderForm = () => {
    if (step === "code") {
      return (
        <form
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          onSubmit={handleSubmitCode}
        >
          <p className="text-center text-lg font-medium">
            Digite o código enviado
          </p>
          <div className="relative">
            <Inputs
              id="cod-recu"
              label="Código de recuperação"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              style="w-full p-3 bg-white text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
            />
          </div>
          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Confirmar
          </button>
        </form>
      );
    }

    if (step === "reset") {
      return (
        <>
          <Alert
            isOpen={success}
            onClose={() => setSuccess(false)}
            texto="A sua palavra-passe foi alterada com sucesso!"
            
          />

          <form
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
            onSubmit={handleSubmitPasse}
          >
            <p className="text-center text-lg font-medium">
              Digite uma nova palavra-passe
            </p>
            <div className="relative">
              <Inputs
                id="nova-passe"
                label="Nova palavra-passe"
                type="password"
                value={passe}
                onChange={(e) => setPasse(e.target.value)}
                style="w-full p-3 bg-white  border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
              <Inputs
                id="confnova-passe"
                label="Confirmação da nova palavra passe"
                type="password"
                value={confPasse}
                onChange={(e) => setConfPasse(e.target.value)}
                style="w-full p-3 bg-white  border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
            </div>
            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Confirmar
            </button>
          </form>
        </>
      );
    }

    return (
      <form
        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        onSubmit={handleSubmitEmail}
      >
        <p className="text-center text-lg font-medium">
          Digite o seu endereço de email
        </p>
        <div className="relative">
          <Inputs
            id="email"
            label="Endereço email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="@"
            style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
          />
        </div>
        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
        >
          Enviar email
        </button>
      </form>
    );
  };

  return (
    <>
      <NavBar />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
            Recupere a sua password
          </h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {renderForm()}
        </div>
      </div>
    </>
  );
}
