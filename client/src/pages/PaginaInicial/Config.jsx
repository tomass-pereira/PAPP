import React, { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Lock, Heart, Home } from "lucide-react";
import Inputs from "../../components/Inputs";
import Sidebar from "../../components/SideBar";
import Section from "../../components/Section";
import Buttons from "../../components/botoes";
import { useUser } from "../../contexts/UserContext.jsX";

const Config = () => {
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingpostal, setLoadingpostal] = useState(false);
  const [errorpostal, setErrorpostal] = useState("");
  const [flagdis, setFlagdis] = useState(true);

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
    senha:userData.senha,
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
    
    if(!formData.numPorta){
      setError('Preencha o número da porta');
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <div className="h-full p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Configurações da Conta
            </h1>
            <Buttons
              onClick={() => setIsEditing(!isEditing)}
              type="button"
              style="py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e]"
              legenda={isEditing ? "Cancelar Edição" : "Editar Dados"}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção de Informação Pessoal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section
                title="Informação Pessoal"
                className="p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="space-y-4">
                  <Inputs
                    id="nome"
                    label="Nome Completo"
                    type="text"
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                  <Inputs
                    id="telefone"
                    label="Número de telefone"
                    type="text"
                    value={userData.telefone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                  <Inputs
                    id="dataNascimento"
                    label="Data de nascimento"
                    type="date"
                    value={formData.dataNascimento}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                  <Inputs
                    id="email"
                    label="Endereço email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                  <Inputs
                    id="senha"
                    label="Palavra-passe"
                    type="password"
                    value={formData.senha}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                </div>
              </Section>

              {/* Seção de Informação Médica */}
              <Section
                title="Informação Médica"
                className="p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="space-y-4">
                  <Inputs
                    id="queixaPrincipal"
                    label="Queixa principal"
                    type="text"
                    value={formData.queixaPrincipal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                  <Inputs
                    id="inicioSintomas"
                    label="Início dos sintomas"
                    type="date"
                    value={InicioSintomas}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                  <Inputs
                    id="condicaoMedicaDesc"
                    label="Condição médica"
                    type="text"
                    value={formData.condicaoMedica}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                   <Inputs
                    id="diagonosticoMedico"
                    label="Diagonóstico Médico"
                    type="text"
                    value={formData.diagnosticoMedico}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                   <Inputs
                    id="cirurgias"
                    label="Lesões ou cirurgias"
                    type="text"
                    value={formData.lesoesCirurgias}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                   <Inputs
                    id="alergias"
                    label="Alergias"
                    type="text"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={
                      isEditing
                        ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                        : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                    }
                  />
                </div>
              </Section>
            </div>

            {/* Seção de Morada */}
            <Section
              title="Morada"
              className="md:col-span-2 p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Inputs
                  id="codpostal"
                  label="Código-postal"
                  type="text"
                  value={formData.codpostal}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={
                    isEditing
                      ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                      : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  }
                />
                <div className="flex items-center">
                <Buttons
                  onClick={(e) => {
                    e.preventDefault(); // Previne o submit do formulário
                    handlePostalSearch();
                  }}
                  type="button"
                  disabled={loadingpostal}
                  style="py-2 px-4 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e]"
                  legenda={loadingpostal ? "A procurar..." : "Procurar"}
                />
              </div>
                <Inputs
                  id="numPorta"
                  label="Nº Porta"
                  type="text"
                  value={formData.numPorta}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={
                    isEditing
                      ? "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                      : "w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  }
                />
                <Inputs
                  id="distrito"
                  label="Distrito"
                  type="text"
                  value={formData.distrito}
                  disabled={true}
                  style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="concelho"
                  label="Concelho"
                  type="text"
                  value={formData.concelho}
                  disabled={true}
                  style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
                <Inputs
                  id="rua"
                  label="Rua"
                  type="text"
                  value={formData.rua}
                  disabled={true}
                  style="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />
              </div>
            </Section>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            {/* Botão de submissão */}
            {isEditing && (
              <div className="flex justify-end">
                <Buttons
                  type="submit"
                  disabled={loading}
                  style="py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-lg hover:bg-[#3e3e9e]"
                  legenda={loading ? "A processar..." : "Guardar alterações"}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Config;
