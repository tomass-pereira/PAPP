import React, { useState, useEffect } from "react";
import {
  Settings
} from "lucide-react";
import Inputs from "../../components/Inputs";
import Sidebar from "../../components/SideBar";
import Section from "../../components/Section";
import Buttons from "../../components/botoes";
import Modal from "../../components/Modal"
import { useUser } from "../../contexts/UserContext.jsX";

const Config = () => {
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingpostal, setLoadingpostal] = useState(false);
  const [errorpostal, setErrorpostal] = useState("");
  const [flagdis, setFlagdis] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const InicioSintomas = userData.inicioSintomas.split("T")[0];
  const DataNasc = userData.dataNascimento.split("T")[0];

  const [formData, setFormData] = useState({
    codpostal: userData.morada.codigoPostal,
    distrito: userData.morada.distrito,
    concelho: userData.morada.concelho,
    rua: userData.morada.rua,
    nome: userData.nome,
    telefone: userData.telefone,
    email: userData.email,
    senha: userData.senha,
    dataNascimento: DataNasc,
    queixaPrincipal: userData.queixaPrincipal,
    inicioSintomas: InicioSintomas,
    numPorta: userData.morada.apartamento,
    condicaoMedica: userData.condicaoMedica,
    diagnosticoMedico: userData.diagnosticoMedico,
    lesoesCirurgias: userData.lesoesOuCirurgias,
    alergias: userData.alergias,
    edificio: "",
  });
  const handleEditClick = () => {
    if (!isEditing) {
      setShowPasswordModal(true);
    } else {
      setIsEditing(false);
    }
  };
  const handlePasswordConfirm = () => {
    if (confirmPassword === userData.senha) {
      setShowPasswordModal(false);
      setIsEditing(true);
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Senha incorreta');
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG format and reduce quality
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const validateForm = () => {
    if (!formData.numPorta) {
      setError("Preencha o número da porta");
      return false;
    }
    // Validate password confirmation
    if (formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setPreview(compressedImage);
        setFormData((prev) => ({
          ...prev,
          foto: compressedImage,
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        setError("Erro ao processar a foto de perfil. Tente novamente.");
      }
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);
    setError("");

    const payload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone.replace(/\D/g, ""),
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
      // await atualizarUtente(payload);
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao atualizar dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          {/* Header */}
          <div className="bg-white px-8 pt-16 pb-20 mb-8 -mx-8 -mt-8">
            <div className="w-100% mx-auto">
              <div className="flex items-center gap-3 text-purple-600 mb-3">
                <Settings size={20} />
                <span className="text-sm font-medium">Configurações</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Configurações da Conta
                  </h1>
                  <p className="text-gray-500">
                    Gerencie suas informações pessoais e preferências
                  </p>
                </div>
                <Buttons
                  onClick={() => setIsEditing(!isEditing)}
                  type="button"
                  style={`px-6 py-3 rounded-xl font-medium transition-all ${
                    isEditing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                    legenda={isEditing ? "Cancelar Edição" : "Editar Dados"}
                    />
              </div>
            </div>
          </div>

          <div className="-mt-24">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grid Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informação Pessoal */}
                <Section
                  title="Informação Pessoal"
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="space-y-5">
                    <Inputs
                      id="nome"
                      label="Nome Completo"
                      type="text"
                      value={formData.nome}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="telefone"
                      label="Número de telefone"
                      type="text"
                      value={userData.telefone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                        } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="dataNascimento"
                      label="Data de nascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="email"
                      label="Endereço email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                      />
                    <Inputs
                      id="senha"
                      label="Palavra-passe"
                      type="password"
                      value={formData.senha}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                  </div>
                </Section>

                {/* Informação Médica */}
                <Section
                  title="Informação Médica"
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="space-y-5">
                    <Inputs
                      id="queixaPrincipal"
                      label="Queixa principal"
                      type="text"
                      value={formData.queixaPrincipal}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="inicioSintomas"
                      label="Início dos sintomas"
                      type="date"
                      value={InicioSintomas}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="condicaoMedicaDesc"
                      label="Condição médica"
                      type="text"
                      value={formData.condicaoMedica}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                        ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                      />
                    <Inputs
                      id="diagonosticoMedico"
                      label="Diagnóstico Médico"
                      type="text"
                      value={formData.diagnosticoMedico}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="cirurgias"
                      label="Lesões ou cirurgias"
                      type="text"
                      value={formData.lesoesCirurgias}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                        ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                      />
                    <Inputs
                      id="alergias"
                      label="Alergias"
                      type="text"
                      value={formData.alergias}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          : "bg-slate-50 border-transparent"
                        } border focus:outline-none focus:ring-2`}
                        />
                  </div>
                </Section>
              </div>

              {/* Seção de Morada */}
              <Section
                title="Morada"
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
                  {/* Linha 1: Código Postal e Nº Porta */}
                  <div className="md:col-span-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Inputs
                          id="codpostal"
                          label="Código-postal"
                          type="text"
                          value={formData.codpostal}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={`w-full px-4 py-3 rounded-xl transition-all ${
                            isEditing
                            ? "bg-white border-gray-200 focus:border-indigo-600 focus:ring-indigo-600"
                              : "bg-slate-50 border-transparent"
                          } border focus:outline-none focus:ring-2`}
                          />
                      </div>
                      <div className="mt-7">
                        <Buttons
                          onClick={(e) => {
                            e.preventDefault();
                            handlePostalSearch();
                          }}
                          type="button"
                          disabled={loadingpostal}
                          style="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all h-[46px]"
                          legenda={loadingpostal ? "..." : "Procurar"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <Inputs
                      id="numPorta"
                      label="Nº Porta"
                      type="text"
                      value={formData.numPorta}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-indigo-600 focus:ring-indigo-600"
                          : "bg-slate-50 border-transparent"
                        } border focus:outline-none focus:ring-2`}
                        />
                  </div>

                  {/* Linha 2: Distrito, Concelho e Rua */}
                  <div className="md:col-span-2">
                    <Inputs
                      id="distrito"
                      label="Distrito"
                      type="text"
                      value={formData.distrito}
                      disabled={true}
                      style="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Inputs
                      id="concelho"
                      label="Concelho"
                      type="text"
                      value={formData.concelho}
                      disabled={true}
                      style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                      />
                  </div>
                  <div className="md:col-span-6">
                    <Inputs
                      id="rua"
                      label="Rua"
                      type="text"
                      value={formData.rua}
                      disabled={true}
                      style="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </Section>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {error}
                </div>
              )}

              {/* Botão de submissão */}
              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Buttons
                    type="submit"
                    disabled={loading}
                    style="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-base font-medium"
                    legenda={loading ? "A processar..." : "Guardar alterações"}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
              </>
  );
};

export default Config;
