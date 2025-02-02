import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import Inputs from '../../components/Inputs';
import Section from '../../components/Section';
import Buttons from '../../components/botoes';

const Config = () => {
  const [preview, setPreview] = useState(null);
  const [flagdis, setFlagdis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingpostal, setLoadingpostal] = useState(false);
  const [error, setError] = useState("");
  const [errorpostal, setErrorpostal] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    codpostal: "",
    distrito: "",
    concelho: "",
    rua: "",
    nome: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    senha: "",
    confirmSenha: "",
    queixaPrincipal: "",
    inicioSintomas: "",
    numPorta: "",
    condicaoMedicaDesc: "",
    diagnosticoMedicoDesc: "",
    lesoesCirurgiasDesc: "",
    alergiasDesc: "",
    edificioDesc: "",
    foto: null,
  });

  const handlePostalSearch = async () => {
    setFlagdis(true);
    if (!formData.codpostal.match(/^\d{4}-\d{3}$/)) {
      setErrorpostal("Código postal inválido");
      return;
    }

    setLoadingpostal(true);
    setErrorpostal("");

    try {
      const data = await buscaMorada(formData.codpostal);

      if (!data || data.length === 0) {
        setErrorpostal("Código postal não encontrado");
        setFlagdis(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        distrito: data[0].distrito || "",
        concelho: data[0].concelho || "",
        rua: data[0].morada || "",
      }));

      if (data[0].distrito != "Porto" && data[0].distrito != "Aveiro") {
        setErrorpostal(
          "O código postal inserido não corresponde a um distrito suportado."
        );
        setFlagdis(false);
      }
    } catch (err) {
      console.error("Erro completo:", err);
      setErrorpostal("Erro ao buscar o endereço. Tente novamente.");
    } finally {
      setLoadingpostal(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    if(!formData.numPorta){
      setError('Preencha o número da porta');
      return false;
    }
    if (formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      profileImage: formData.foto,
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone.replace(/\D/g, ""),
      senha: formData.senha,
      dataNascimento: formData.dataNascimento,
      queixaPrincipal: formData.queixaPrincipal,
      inicioSintomas: formData.inicioSintomas,
      condicaoMedica: formData.condicaoMedicaDesc || "",
      lesoesOuCirurgias: formData.lesoesCirurgiasDesc || "",
      diagnosticoMedico: formData.diagnosticoMedicoDesc || "",
      alergias: formData.alergiasDesc || "",
      morada: {
        distrito: formData.distrito,
        concelho: formData.concelho,
        rua: formData.rua,
        codigoPostal: formData.codpostal,
        apartamento: formData.edificioDesc || formData.numPorta || "",
      },
    };

    try {
      await registarUtente(payload);
      setSuccess(true);
    } catch (err) {
      console.error("Erro completo:", err);
      if (err.message === "Failed to fetch") {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o servidor está rodando."
        );
      } else {
        setError(
          err.message || "Erro ao criar conta. Por favor, tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-8">
            <div className="space-y-8">
              <Section title="Informação Pessoal">
                <Inputs
                  id="nome"
                  label="Nome Completo"
                  type="text"
                  placeholder="ex:Tomás Jesus Pereira"
                  value={formData.nome}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="telefone"
                  label="Número de telefone"
                  type="text"
                  placeholder="+351"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                  <Inputs
                    id="email"
                    label="Endereço email"
                    type="email"
                    placeholder="@"
                    value={formData.email}
                    onChange={handleInputChange}
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="dataNascimento"
                  label="Data de nascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="senha"
                  label="Palavra-passe"
                  type="password"
                  value={formData.senha}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="confirmSenha"
                  label="Confirmação da palavra-passe"
                  type="password"
                  value={formData.confirmSenha}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
              </Section>

              <Section title="Informação Médica">
                <Inputs
                  id="queixaPrincipal"
                  label="Queixa principal"
                  type="text"
                  value={formData.queixaPrincipal}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  required
                />
                <Inputs
                  id="condicaoMedicaDesc"
                  label="Condição médica (se tiver)"
                  type="text"
                  value={formData.condicaoMedicaDesc}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="diagnosticoMedicoDesc"
                  label="Diagnóstico médico (se tiver)"
                  type="text"
                  value={formData.diagnosticoMedicoDesc}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="inicioSintomas"
                  label="Início dos sintomas"
                  type="date"
                  value={formData.inicioSintomas}
                  onChange={handleInputChange}
                  required
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="lesoesCirurgiasDesc"
                  label="Lesões ou cirurgias anteriores (se tiver)"
                  type="text"
                  value={formData.lesoesCirurgiasDesc}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="alergiasDesc"
                  label="Alergias a medicamentos ou tratamentos (se tiver)"
                  type="text"
                  value={formData.alergiasDesc}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
              </Section>
            </div>

            <Section title="Morada" className="h-auto">
              <div className="flex gap-2">
                <div className="">
                  <Inputs
                    id="codpostal"
                    label="Código-postal"
                    type="text"
                    maxLength="8"
                    value={formData.codpostal}
                    onChange={handleInputChange}
                    pattern="\d{4}-\d{3}"
                    placeholder=""
                    style="w-32 p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>
                <div className="flex items-center">
                  <Buttons
                    onClick={(e) => {
                      e.preventDefault();
                      handlePostalSearch();
                    }}
                    type="button"
                    disabled={loadingpostal}
                    style="py-2 px-4 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e]"
                    legenda={loadingpostal ? "A procurar..." : "Procurar"}
                  />
                </div>
                {errorpostal && (
                  <div className="text-red-500 text-sm mt-2">{errorpostal}</div>
                )}
                <div className="ml-4">
                  <Inputs
                    id="numPorta"
                    label="Número da porta"
                    type="text"
                    placeholder=""
                    value={formData.numPorta}
                    onChange={handleInputChange}
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>
              </div>
              <Inputs
                id="distrito"
                label="Distrito"
                type="text"
                placeholder=""
                value={flagdis ? formData.distrito : ""}
                disabled={true}
                onChange={handleInputChange}
                style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
              <Inputs
                id="concelho"
                label="Concelho"
                type="text"
                placeholder=""
                onChange={handleInputChange}
                value={flagdis ? formData.concelho : ""}
                disabled={true}
                style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
              <Inputs
                id="rua"
                label="Rua"
                type="text"
                onChange={handleInputChange}
                value={flagdis ? formData.rua : ""}
                placeholder=""
                disabled={true}
                style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
              <Inputs
                id="edificioDesc"
                label="Detalhes do apartamento (se aplicável)"
                type="text"
                value={formData.edificioDesc}
                onChange={handleInputChange}
                style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
              />
            </Section>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          <div className="mt-4">
            <Buttons
              type="submit"
              disabled={loading}
              style="py-2 px-4 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e]"
              legenda={loading ? "A processar..." : "Guardar alterações"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Config;