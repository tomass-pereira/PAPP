import React, { useState, useRef } from "react";
import { Settings, Home, CircleUser } from "lucide-react";
import Inputs from "../../components/Inputs";
import Sidebar from "../../components/SideBar";
import Section from "../../components/Section";
import Buttons from "../../components/botoes";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { useUser } from "../../contexts/UserContext.jsX";
import { buscaMorada } from "../../api/morada";

const Config = () => {
  const { userData, updateUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loadingpostal, setLoadingpostal] = useState(false);
  const [flagdis, setFlagdis] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const modalRef = useRef(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    codpostal: userData.morada.codigoPostal,
    distrito: userData.morada.distrito,
    concelho: userData.morada.concelho,
    rua: userData.morada.rua,
    nome: userData.nome,
    telefone: userData.telefone,
    email: userData.email,
    senha: userData.senha,
    dataNascimento: userData.dataNascimento,
    numPorta: userData.morada.numPorta,
    diagnosticoMedico: userData.diagnosticoMedico,
    lesoesCirurgias: userData.lesoesOuCirurgias,
    alergias: userData.alergias,
    edificio: "",
  });

  const handleEditClick = () => {
    if (!isEditing) {
      modalRef.current?.showModal();
    } else {
      setIsEditing(false);
    }
  };
  const handlePasswordConfirm = () => {
    if (confirmPassword === userData.senha) {
      setShowPasswordModal(false);
      setIsEditing(true);
      setConfirmPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta");
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
      setError("Código postal inválido");
      // Limpar campos quando há erro
      setFormData((prev) => ({
        ...prev,
        distrito: "",
        concelho: "",
        rua: "",
      }));
      setFlagdis(false);
      return;
    }

    setLoadingpostal(true);
    setError("");

    try {
      const data = await buscaMorada(formData.codpostal);

      if (!data || data.length === 0) {
        setError("Código postal não encontrado");
        // Limpar campos quando não encontra o código postal
        setFormData((prev) => ({
          ...prev,
          distrito: "",
          concelho: "",
          rua: "",
        }));
        setFlagdis(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        distrito: data[0].distrito || "",
        concelho: data[0].concelho || "",
        rua: data[0].morada || "",
      }));

      if (data[0].distrito !== "Porto" && data[0].distrito !== "Aveiro") {
        setError(
          "O código postal inserido não corresponde a um distrito suportado."
        );
        // Limpar campos quando o distrito não é suportado
        setFormData((prev) => ({
          ...prev,
          distrito: "",
          concelho: "",
          rua: "",
        }));
        setFlagdis(false);
      }
    } catch (err) {
      console.error("Erro completo:", err);
      setError("Erro ao buscar o endereço. Tente novamente.");
      // Limpar campos quando há erro na busca
      setFormData((prev) => ({
        ...prev,
        distrito: "",
        concelho: "",
        rua: "",
      }));
      setFlagdis(false);
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
      senha: formData.senha,
      telefone: formData.telefone.replace(/\D/g, ""),
      dataNascimento: formData.dataNascimento,
      lesoesOuCirurgias: formData.lesoesCirurgiasDesc || "",
      alergias: formData.alergiasDesc || "",
      morada: {
        distrito: formData.distrito,
        concelho: formData.concelho,
        rua: formData.rua,
        codigoPostal: formData.codpostal,
        numPorta:formData.numPorta,
        apartamento: formData.edificioDesc || "",
      },
    };

    try {
      await updateUserData(userData._id, payload);
      setIsAlertOpen(true);
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
    <Modal
      ref={modalRef}
      page="config"
      password={confirmPassword}
      onPasswordChange={setConfirmPassword}
      passwordError={passwordError}
      onConfirm={handlePasswordConfirm}
      onClose={() => {
        setConfirmPassword("");
        setPasswordError("");
      }}
    />
    <Alert
      isOpen={isAlertOpen}
      onClose={() => setIsAlertOpen(false)}
      texto="Os seus dados foram atualizados com sucesso!"
    />
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          {/* Header */}
          <div className="bg-white px-8 pt-16 pb-20 mb-8 -mx-8 -mt-8 border-b border-gray-100">
            <div className="w-100% mx-auto">
              <div className="flex items-center gap-3 text-indigo-600 mb-3">
                <Settings size={20} />
                <span className="text-sm font-medium">Configurações</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Configurações da Conta
                  </h1>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-500">
                      Gerencie suas informações pessoais e preferências
                    </p>
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                   
                  </div>
                </div>
                <Buttons
                  onClick={handleEditClick}
                  type="button"
                  style={`px-6 py-3 rounded-xl font-medium transition-all ${
                    isEditing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  legenda={isEditing ? "Cancelar Edição" : "Editar Dados"}
                />
              </div>
            </div>
          </div>

          <div className="-mt-24">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Informação Pessoal */}
                <Section
                  title="Informação Pessoal"
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg"
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
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="telefone"
                      label="Número de telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                  </div>
                </Section>

                {/* Informação Médica */}
                <Section
                  title="Informação Médica"
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg"
                >
                  <div className="space-y-5">
                    <Inputs
                      id="diagnosticoMedico"
                      label="Diagnóstico Médico"
                      type="text"
                      value={formData.diagnosticoMedico}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                    <Inputs
                      id="lesoesCirurgias"
                      label="Lesões ou cirurgias"
                      type="text"
                      value={formData.lesoesCirurgias}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={`w-full px-4 py-3 rounded-xl transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                          ? "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          : "bg-slate-50 border-transparent"
                      } border focus:outline-none focus:ring-2`}
                    />
                  </div>
                </Section>
              </div>

              {/* Seção de Morada */}
             {/* Seção de Morada */}
<Section
  title={
    <div className="flex items-center gap-3 text-gray-900">
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Home size={20} className="text-indigo-600" />
      </div>
      Morada
    </div>
  }
  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-all hover:shadow-2xl"
>
  <div className="space-y-5">
    {/* Código Postal e Nº Porta */}
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
      <div className="sm:col-span-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código-postal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.codpostal}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? "bg-white border-gray-200 focus:border-indigo-600 focus:ring-indigo-600"
                    : "bg-slate-50 border-transparent"
                } border focus:outline-none focus:ring-2`}
                placeholder="XXXX-XXX"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePostalSearch();
                }}
                disabled={loadingpostal}
                className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 whitespace-nowrap"
              >
                {loadingpostal ? "..." : "Procurar"}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">Formato: XXXX-XXX</p>
          </div>
        </div>
      </div>
      
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nº Porta
        </label>
        <input
          type="text"
          value={formData.numPorta}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 rounded-xl transition-all ${
            isEditing
              ? "bg-white border-gray-200 focus:border-indigo-600 focus:ring-indigo-600"
              : "bg-slate-50 border-transparent"
          } border focus:outline-none focus:ring-2`}
        />
      </div>
    </div>

    {/* Distrito e Concelho */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Distrito
        </label>
        <input
          type="text"
          value={formData.distrito}
          disabled={true}
          className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Concelho
        </label>
        <input
          type="text"
          value={formData.concelho}
          disabled={true}
          className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
    </div>

    {/* Rua */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rua
      </label>
      <input
        type="text"
        value={formData.rua}
        disabled={true}
        className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
              {isEditing && !error && (
                <div className="flex justify-end pt-4">
                  <Buttons
                    type="submit"
                    disabled={loading}
                    style="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-base font-medium shadow-sm hover:shadow-md"
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
