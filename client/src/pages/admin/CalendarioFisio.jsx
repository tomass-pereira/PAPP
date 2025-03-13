import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import CalendarApp from "../../components/Calendar/CalendarX";
import { PlusIcon, XIcon, RefreshIcon, FilterIcon, CalendarIcon } from "@heroicons/react/solid";
import { createSessao, reservarSessao } from "../../api/sessoes";
import { getAllUtentes } from "../../api/utente";

export default function CalendarioFisio() {
  const navigate = useNavigate();
  const [utentes, setUtentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectUtente, setSelectUtente] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    utenteId: "",
    dataHoraInicio: "",
    duracao: 45,
    descricao: "",
    motivo: "",
    status: "disponivel"
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Efeito para carregar utentes e configurar seleção quando status for "reservada"
  useEffect(() => {
    // Function to fetch utentes
    const fetchUtentes = async () => {
      try {
        setLoading(true);
        const response = await getAllUtentes();
        setUtentes(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching utentes - full error:", err);
        setError(
          "Ocorreu um erro ao carregar os utentes. Por favor, tente novamente."
        );
        setUtentes([]);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchUtentes();
    
    // Set utenteId selection when status is "reservada"
    if (formData.status === "reservada") {
      setSelectUtente(true);
      
      // If there are utentes and no utenteId is selected, select the first one automatically
      if (utentes.length > 0 && !formData.utenteId) {
        setFormData(prev => ({
          ...prev,
          utenteId: utentes[0]._id
        }));
      }
    } else {
      setSelectUtente(false);
    }
  }, [formData.status, utentes.length]);

  const refreshCalendar = () => {
    window.location.reload();    
    setTimeout(() => {
      setIsRefreshing(false);
      // Exibir toast de sucesso
      showToast("Calendário atualizado");
    }, 1000);
  };

  const showToast = (message) => {
    // Implementação simples de um toast
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status: status
    }));
    
    // If status is "reservada" and there are utentes, automatically set the first utente
    if (status === "reservada" && utentes.length > 0) {
      setFormData(prev => ({
        ...prev,
        status: status,
        utenteId: utentes[0]._id
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
      if(formData.dataHoraInicio<new Date().toISOString().split('.')[0]){
        setError("Data e hora de início inválida");
        setLoading(false);
        return;
      }
    try {
      const dataInicio = new Date(formData.dataHoraInicio);
      const dataFim = new Date(dataInicio.getTime() + formData.duracao * 60000);
      const sessaoData = {
        dataHoraInicio: formData.dataHoraInicio,
        dataHoraFim: dataFim.toISOString().split('.')[0],
        duracao: formData.duracao,
        status: formData.status,
        utenteId: formData.utenteId,
        motivo: formData.motivo,
      };
      
      // Adicionar utenteId apenas se status for "reservada"
      if (formData.status === "reservada" && formData.utenteId) {
        sessaoData.utenteId = formData.utenteId;
      }

      const novasessaoId =await createSessao(sessaoData);
      if(sessaoData.utenteId){

        await reservarSessao(novasessaoId.data.id, sessaoData.utenteId, sessaoData.motivo);
      }
      
      setSuccess(true);
      setFormData({
        utenteId: "",
        dataHoraInicio: "",
        duracao: 45,
        descricao: "",
        motivo: "",
        status: "disponivel"
      });
      
      // Fechar o modal após 1.5 segundos
      setTimeout(() => {
        document.getElementById('modal_nova_sessao').close();
        setSuccess(false);
        showToast("Sessão criada com sucesso!");
        // Recarregar calendário
        refreshCalendar();
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao criar sessão:", error);
      setError(error.response?.data?.message || "Erro ao criar sessão");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SideBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 h-screen">
          {/* Cabeçalho */}
          <div className="mb-4 md:mb-8 top-0 bg-gray-50 z-10 pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 text-center sm:text-left">
              Agenda de Sessões
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Gerencie as sessões e disponibilidades
            </p>
          </div>

          {/* Barra de ferramentas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
              {/* Botão de atualizar */}
              <button 
                onClick={refreshCalendar}
                className={`flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors ${isRefreshing ? "opacity-70" : ""}`}
                disabled={isRefreshing}
              >
                <RefreshIcon className={`h-5 w-5 mr-2 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </button>
              
              {/* Botão de Nova Sessão */}
              <button
                onClick={() => document.getElementById('modal_nova_sessao').showModal()}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nova Sessão
              </button>
            </div>
          </div>
          
          {/* Legenda */}
          <div className="flex flex-wrap gap-3 md:gap-6 mb-4">
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-purple-200 mr-2 border border-purple-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Reservado
              </span>
            </div>
           
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-green-200 mr-2 border border-green-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Disponível
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-yellow-200 mr-2 border border-yellow-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Em andamento
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-gray-200 mr-2 border border-gray-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Cancelado
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-blue-200 mr-2 border border-blue-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Concluído
              </span>
            </div>
          </div>

          {/* Calendário */}
          <CalendarApp />
        </main>
      </div>

      {/* Modal para criar sessão usando DaisyUI */}
      <dialog id="modal_nova_sessao" className="modal">
        <div className="modal-box max-w-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Criar Nova Sessão</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sessão criada com sucesso!</span>
              </div>
            )}
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Data e Hora de Início</span>
              </label>
              <input
                type="datetime-local"
                name="dataHoraInicio"
                value={formData.dataHoraInicio}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Duração (minutos)</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleChange}
                  min="15"
                  max="120"
                  step="15"
                  className="range range-primary flex-1"
                />
                <span className="w-12 text-center font-medium">{formData.duracao}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15min</span>
                <span>120min</span>
              </div>
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all hover:bg-gray-50 ${formData.status === "disponivel" ? "border-primary bg-primary bg-opacity-10" : "border-gray-300"}`}>
                  <input
                    type="radio"
                    name="status"
                    value="disponivel"
                    checked={formData.status === "disponivel"}
                    onChange={() => handleStatusChange("disponivel")}
                    className="radio radio-primary"
                  />
                  <span className={`${formData.status === "disponivel" ? "text-primary font-medium" : ""}`}>Disponível</span>
                </label>
                <label className={`flex items-center justify-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all hover:bg-gray-50 ${formData.status === "reservada" ? "border-primary bg-primary bg-opacity-10" : "border-gray-300"}`}>
                  <input
                    type="radio"
                    name="status"
                    value="reservada"
                    checked={formData.status === "reservada"}
                    onChange={() => handleStatusChange("reservada")}
                    className="radio radio-primary"
                  />
                  <span className={`${formData.status === "reservada" ? "text-primary font-medium" : ""}`}>Reservada</span>
                </label>
              </div>
            </div>
            
            {/* Campos que aparecem apenas quando o status é "reservada" */}
            {selectUtente && (
              <>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Utente</span>
                  </label>
                  <select
                    name="utenteId"
                    value={formData.utenteId}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Selecione um utente</option>
                    {utentes.map(utente => (
                      <option key={utente._id} value={utente._id}>
                        {utente.nome} {utente.apelido}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Motivo</span>
                  </label>
                  <input
                    type="text"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Ex: Consulta inicial, Terapia, etc."
                    required
                  />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Descrição</span>
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    placeholder="Detalhes adicionais da sessão..."
                  ></textarea>
                </div>
              </>
            )}
            
            <div className="modal-action">
              <form method="dialog">
              </form>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Criando...</span>
                  </span>
                ) : (
                  "Criar Sessão"
                )}
              </button>
            </div>
          </form>
        </div>
       
      </dialog>

    
    </>
  );
}