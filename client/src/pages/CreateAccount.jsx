import { useState } from "react";
import { Camera } from "lucide-react";
import NavBar from "../components/NavBar.jsx";
import Section from "../components/Section.jsx";
import Inputs from "../components/Inputs.jsx";
import RadioButton from "../components/RadioButton.jsx";
import Buttons from "../components/botoes.jsx";
import Footer from "../components/Footer.jsx";
import { buscaMorada } from '../api/morada';
import { registarUtente } from '../api/utente';
import Alert from "../components/Alert.jsx";

function CreateAccount() {
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
    // Medical information with descriptions
    condicaoMedica: false,
    condicaoMedicaDesc: "",
    diagnosticoMedico: false,
    diagnosticoMedicoDesc: "",
    lesoesCirurgias: false,
    lesoesCirurgiasDesc: "",
    alergias: false,
    alergiasDesc: "",
    edificio: false,
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
    const data= await buscaMorada(formData.codpostal);

     
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

  const handleRadioChange = (name, value) => {
    const fieldMapping = {
      "radio-condicao": "condicaoMedica",
      "radio-diagonostico": "diagnosticoMedico",
      "radio-cirugias": "lesoesCirurgias",
      "radio-alergias": "alergias",
      "radio=domicilio": "edificio",
    };

    const field = fieldMapping[name];
    if (field) {
      setFormData((prev) => ({
        ...prev,
        [field]: value === "sim",
      }));
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

  const validateForm = () => {
    // Validate email format
    if (!formData.email || !formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }

    // Validate name length
    if (!formData.nome || formData.nome.length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return false;
    }

    // Validate phone number format (exactly 9 digits)
    if (!formData.telefone || !/^\d{9}$/.test(formData.telefone)) {
      setError("Telefone deve ter 9 dígitos");
      return false;
    }

    // Validate password length with logging
    console.log("Validating password:", {
      password: formData.senha,
      length: formData.senha?.length,
    });

    if (!formData.senha || formData.senha.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    // Validate password confirmation
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

    // Create the request payload with only the required fields
    // Log the form data before creating payload

    const payload = {
      profileImage: formData.foto,
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone.replace(/\D/g, ""),
      senha: formData.senha,
      dataNascimento: formData.dataNascimento,
      queixaPrincipal: formData.queixaPrincipal,
      inicioSintomas: formData.inicioSintomas,
      condicaoMedica: {
        tem: formData.condicaoMedica ? "Sim" : "Não",
        descricao: formData.condicaoMedicaDesc || "",
      },
      lesoesOuCirurgias: {
        tem: formData.lesoesCirurgias ? "Sim" : "Não",
        descricao: formData.lesoesCirurgiasDesc || "",
      },
      diagnosticoMedico: {
        tem: formData.diagnosticoMedico ? "Sim" : "Não",
        descricao: formData.diagnosticoMedicoDesc || "",
      },
      alergias: {
        tem: formData.alergias ? "Sim" : "Não",
        descricao: formData.alergiasDesc || "",
      },
      morada: {
        distrito: formData.distrito,
        concelho: formData.concelho,
        rua: formData.rua,
        codigoPostal: formData.codpostal,
        apartamento: {
          vive: formData.edificio ? "Sim" : "Não",
          detalhes: formData.edificioDesc || formData.numPorta || "",
        },
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
    <>
      <NavBar />
      <Alert isOpen={success} onClose={() => setSuccess(false)} />
      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-8 py-10 bg-white rounded-lg mt-3">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
              Bem-vindo! <span>👋</span>
            </h1>
            <p className="text-indigo-600">
              Precisamos de recolher algumas informações
            </p>

            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center">
                    <Camera size={40} className="text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Camera size={20} className="text-white" />
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">
                Clique para adicionar uma foto de perfil
              </p>
            </div>
          </div>

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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Inputs
                  id="queixaPrincipal"
                  label="Queixa principal"
                  type="text"
                  value={formData.queixaPrincipal}
                  onChange={handleInputChange}
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  required
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <RadioButton
                    name="radio-condicao"
                    assunto="Possui alguma condição médica?"
                    id="sim-condicao"
                    id2="nao-condicao"
                    onChange={(e) =>
                      handleRadioChange("radio-condicao", e.target.value)
                    }
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <RadioButton
                    name="radio-diagonostico"
                    assunto="Tem algum diagnóstico médico relevante?"
                    id="sim-diago"
                    id2="nao-diago"
                    onChange={(e) =>
                      handleRadioChange("radio-diagonostico", e.target.value)
                    }
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Inputs
                  id="inicioSintomas"
                  label="Início dos sintomas"
                  type="date"
                  value={formData.inicioSintomas}
                  onChange={handleInputChange}
                  required
                  style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <RadioButton
                    name="radio-cirugias"
                    assunto="Tem lesões ou cirurgias anteriores?"
                    id="sim-cirugia"
                    id2="nao-cirugia"
                    onChange={(e) =>
                      handleRadioChange("radio-cirugias", e.target.value)
                    }
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <RadioButton
                    name="radio-alergias"
                    assunto="Tem alergias a medicamentos ou outros tratamentos?"
                    id="sim-alergia"
                    id2="nao-alergia"
                    onChange={(e) =>
                      handleRadioChange("radio-alergias", e.target.value)
                    }
                    style="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Morada">
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
                    e.preventDefault(); // Previne o submit do formulário
                    handlePostalSearch();
                  }}
                  type="button"
                  disabled={loadingpostal}
                  style="py-2 px-4 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e]"
                  legenda={loadingpostal ? "A procurar..." : "Procurar"}
                />
              </div>
              {error && (
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
            <RadioButton
              name="radio=domicilio"
              assunto="Vive num apartamento?"
              onChange={(e) =>
                handleRadioChange("radio=domicilio", e.target.value)
              }
            />
          </Section>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <Buttons
            type="submit"
            disabled={loading}
            style="py-4 px-8 mt-0 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e] disabled:bg-gray-400"
            legenda={loading ? "Aguarde..." : "Criar Conta"}
          />
        </div>
      </form>
      <Footer />
    </>
  );
}

export default CreateAccount;
