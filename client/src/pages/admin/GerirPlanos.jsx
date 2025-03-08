import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanos } from "../../contexts/PlanoContext";
import { useUser } from "../../contexts/UserContext.jsX";
import SideBar from "../../components/SideBar";
import {
  Calendar,
  BookOpen,
  CheckCircle,
  Plus,
  Info,
  XCircle,
  CalendarPlus,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import { getAllUtentes } from "../../api/utente";
export default function CriarPlanoTratamento() {
  const navigate = useNavigate();
  const { userId } = useUser();
const { criarPlano } = usePlanos();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [utentes, setUtentes] = useState([]);
  const [utenteSelected, setUtenteSelected] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    utenteId: "",
    detalhes: "",
    objetivos: [""],
    tipotratamento: "",
    dataInicio: "",
    dataFim: "",
    duracao: { valor: 8, unidade: "semanas" },
    status: "Em Andamento",
    sessoes: [],
  });
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
  }, []);

  const [sessoesConfig, setSessoesConfig] = useState({
    quantidade: 1,
    frequencia: "semanal",
    duracao: 45,
    diasDaSemana: [],
  });

  // Carregar utentes para selecionar

  // Função para calcular datas de sessão com base na frequência
 // Função segura para calcular datas de sessão com base na frequência
const calcularDatasSessoes = () => {
    if (!formData.dataInicio) return [];
  
    try {
      const dataInicio = new Date(formData.dataInicio);
      
      // Verificação de data válida
      if (isNaN(dataInicio.getTime())) {
        console.error("Data de início inválida");
        return [];
      }
      
      const dataFim = formData.dataFim ? new Date(formData.dataFim) : null;
      
      // Verificação de data fim válida
      if (dataFim && isNaN(dataFim.getTime())) {
        console.error("Data de fim inválida");
        return [];
      }
      
      const sessoes = [];
      const diasSelecionados = sessoesConfig.diasDaSemana.map(Number);
  
      // Se nenhum dia da semana estiver selecionado, usamos o dia inicial
      if (diasSelecionados.length === 0) {
        diasSelecionados.push(dataInicio.getDay());
      }
  
      // Definir um limite de segurança para evitar loops infinitos
      // (máximo de 100 sessões ou 365 dias para evitar loops infinitos)
      let maxIterations = 365;
      let currentDate = new Date(dataInicio);
      const maxSessoes = parseInt(sessoesConfig.quantidade, 10) || 10;
      
      while (maxIterations > 0 && sessoes.length < maxSessoes) {
        // Verificar se ultrapassamos a data fim
        if (dataFim && currentDate > dataFim) {
          break;
        }
        
        // Verificamos se o dia atual é um dos dias selecionados da semana
        if (diasSelecionados.includes(currentDate.getDay())) {
          const dataHoraInicio = new Date(currentDate);
          dataHoraInicio.setHours(9, 0, 0); // Padrão às 9h
  
          const dataHoraFim = new Date(dataHoraInicio);
          dataHoraFim.setMinutes(
            dataHoraFim.getMinutes() + parseInt(sessoesConfig.duracao, 10)
          );
  
          sessoes.push({
            dataHoraInicio: dataHoraInicio.toISOString().split(".")[0],
            dataHoraFim: dataHoraFim.toISOString().split(".")[0],
            duracao: parseInt(sessoesConfig.duracao, 10),
            descricao: `Sessão ${sessoes.length + 1} - ${formData.titulo || 'Tratamento'}`,
            status: "reservada",
          });
        }
  
        // Avançamos para o próximo dia
        currentDate.setDate(currentDate.getDate() + 1);
        maxIterations--;
      }
  
      return sessoes;
    } catch (error) {
      console.error("Erro ao calcular sessões:", error);
      return []; // Retorna array vazio em caso de erro
    }
  }

  // Atualizar sessões quando a configuração mudar
  useEffect(() => {
    if (formData.dataInicio) {
      const novasSessoes = calcularDatasSessoes();
      setFormData((prev) => ({
        ...prev,
        sessoes: novasSessoes,
      }));
    }
  }, [sessoesConfig, formData.dataInicio, formData.dataFim]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "utenteId") {
      setUtenteSelected(value);
      console.log(value);   
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleObjetivoChange = (index, value) => {
    const novosObjetivos = [...formData.objetivos];
    novosObjetivos[index] = value;
    setFormData((prev) => ({
      ...prev,
      objetivos: novosObjetivos,
    }));
  };
  const adicionarObjetivo = () => {
    setFormData((prev) => ({
      ...prev,
      objetivos: [...prev.objetivos, ""],
    }));
  };
  const removerObjetivo = (index) => {
    const novosObjetivos = [...formData.objetivos];
    novosObjetivos.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      objetivos: novosObjetivos.length === 0 ? [""] : novosObjetivos,
    }));
  };

  // Handler para dias da semana
  const handleDiaSemanaToggle = (dia) => {
    const novoDiasSemana = [...sessoesConfig.diasDaSemana];

    if (novoDiasSemana.includes(dia)) {
      // Remover dia se já estiver selecionado
      const index = novoDiasSemana.indexOf(dia);
      novoDiasSemana.splice(index, 1);
    } else {
      // Adicionar dia
      novoDiasSemana.push(dia);
    }

    setSessoesConfig((prev) => ({
      ...prev,
      diasDaSemana: novoDiasSemana,
    }));
  };

  // Handler para configuração de sessões
  const handleSessoesConfigChange = (e) => {
    const { name, value } = e.target;

    setSessoesConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calcular data fim com base na duração
  useEffect(() => {
    if (formData.dataInicio && formData.duracao.valor) {
      const dataInicio = new Date(formData.dataInicio);
      let dataFim;

      switch (formData.duracao.unidade) {
        case "dias":
          dataFim = new Date(dataInicio);
          dataFim.setDate(
            dataInicio.getDate() + parseInt(formData.duracao.valor)
          );
          break;
        case "semanas":
          dataFim = new Date(dataInicio);
          dataFim.setDate(
            dataInicio.getDate() + parseInt(formData.duracao.valor) * 7
          );
          break;
        case "meses":
          dataFim = new Date(dataInicio);
          dataFim.setMonth(
            dataInicio.getMonth() + parseInt(formData.duracao.valor)
          );
          break;
        default:
          dataFim = new Date(dataInicio);
          dataFim.setDate(
            dataInicio.getDate() + parseInt(formData.duracao.valor) * 7
          );
      }

      setFormData((prev) => ({
        ...prev,
        dataFim: dataFim.toISOString().split("T")[0],
      }));
    }
  }, [formData.dataInicio, formData.duracao.valor, formData.duracao.unidade]);

  // Atualizar o ID do utente quando selecionar
  useEffect(() => {
    if (utenteSelected) {
      setFormData((prev) => ({
        ...prev,
        utenteId: utenteSelected,
      }));
    }
  }, [utenteSelected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      // Verificar campos obrigatórios
      if (
        !formData.titulo ||
        !formData.utenteId ||
        !formData.dataInicio ||
        !formData.dataFim
      ) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      // Filtrar objetivos vazios
      // Dados a enviar
      const dadosPlano = {
          ...formData,
          objetivos: formData.objetivos,
          sessoes: formData.sessoes.map((sessao) => ({
              dataHoraInicio: sessao.dataHoraInicio,
              dataHoraFim: sessao.dataHoraFim,
              duracao: sessao.duracao,
              descricao: sessao.descricao,
              status: sessao.status,
            })),
        };
        console.log(formData);

      const data = await criarPlano(dadosPlano);

     console.log(data);

      // Adicionar ao state do context

      // Mostrar sucesso
      setSuccess(true);

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        setFormData({
          titulo: "",
          utenteId: "",
          detalhes: "",
          objetivos: [""],
          tipotratamento: "",
          dataInicio: "",
          dataFim: "",
          duracao: { valor: 8, unidade: "semanas" },
          status: "Em Andamento",
          sessoes: [],
        });
        setUtenteSelected("");
        setSessoesConfig({
          quantidade: 1,
          frequencia: "semanal",
          duracao: 45,
          diasDaSemana: [],
        });
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const voltarParaLista = () => {
    navigate("/planos");
  };

  // Formatar data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Formatar hora para exibição
  const formatarHora = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Nomes dos dias da semana
  const diasDaSemana = [
    { valor: 0, nome: "Dom" },
    { valor: 1, nome: "Seg" },
    { valor: 2, nome: "Ter" },
    { valor: 3, nome: "Qua" },
    { valor: 4, nome: "Qui" },
    { valor: 5, nome: "Sex" },
    { valor: 6, nome: "Sáb" },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="bg-white px-8 pt-16 pb-20 mb-8">
            <div className="w-100% mx-auto">
              <div className="flex items-center gap-3 text-indigo-600 mb-3">
                <BookOpen size={20} />
                <span className="text-sm font-medium">
                  Gestão de Tratamentos
                </span>
              </div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-3">
                Criar Plano de Tratamento
              </h1>
              <p className="text-gray-600 max-w-xl">
                Configure um novo plano personalizado para seu paciente,
                definindo objetivos e agendando as sessões de tratamento.
              </p>
            </div>
          </div>

          <div className="-mt-24 mx-8 mb-16">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <button
                  onClick={voltarParaLista}
                  className="flex items-center text-indigo-600 font-medium mb-6 hover:underline"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Voltar para lista de planos
                </button>

                {/* Formulário de Criação */}
                <form onSubmit={handleSubmit}>
                  {/* Mensagens de erro ou sucesso */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-800 font-medium">
                          Erro ao criar plano
                        </h4>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-green-800 font-medium">
                          Plano criado com sucesso!
                        </h4>
                        <p className="text-green-600 text-sm">
                          O novo plano de tratamento foi criado e as sessões
                          foram agendadas.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Coluna 1 - Informações Básicas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Informações Básicas
                      </h3>

                      {/* Paciente */}
                      <div className="mb-4">
                        <label
                          htmlFor="utenteId"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Paciente*
                        </label>
                        <select
                          id="utenteId"
                          name="utenteId"
                          value={utenteSelected}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Selecione um paciente</option>
                          {utentes.map((utente) => (
                            <option key={utente._id} value={utente._id}>
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                  src={
                                    utente.profileImage ||
                                    "/placeholder-user.png"
                                  }
                                  alt="Foto de perfil"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {utente.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Título */}
                      <div className="mb-4">
                        <label
                          htmlFor="titulo"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Título do Plano*
                        </label>
                        <input
                          type="text"
                          id="titulo"
                          name="titulo"
                          value={formData.titulo}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Ex: Reabilitação do Joelho"
                          required
                        />
                      </div>

                      {/* Tipo de Tratamento */}
                      <div className="mb-4">
                        <label
                          htmlFor="tipotratamento"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tipo de Tratamento
                        </label>
                        <select
                          id="tipotratamento"
                          name="tipotratamento"
                          value={formData.tipotratamento}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Selecione um tipo</option>
                          <option value="Ortopédico">Ortopédico</option>
                          <option value="Neurológico">Neurológico</option>
                          <option value="Respiratório">Respiratório</option>
                          <option value="Pediátrico">Pediátrico</option>
                          <option value="Geriátrico">Geriátrico</option>
                          <option value="Desportivo">Desportivo</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      {/* Detalhes */}
                      <div className="mb-4">
                        <label
                          htmlFor="detalhes"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Detalhes do Tratamento
                        </label>
                        <textarea
                          id="detalhes"
                          name="detalhes"
                          value={formData.detalhes}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Descrição detalhada do tratamento e observações importantes"
                        />
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Status Inicial
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Agendado">Agendado</option>
                        </select>
                      </div>
                    </div>

                    {/* Coluna 2 - Objetivos e Duração */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Objetivos e Duração
                      </h3>

                      {/* Duração */}
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="duracao-valor"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Duração
                          </label>
                          <input
                            type="number"
                            id="duracao-valor"
                            name="duracao-valor"
                            value={formData.duracao.valor}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                duracao: {
                                  ...prev.duracao,
                                  valor: e.target.value,
                                },
                              }))
                            }
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="duracao-unidade"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Unidade
                          </label>
                          <select
                            id="duracao-unidade"
                            name="duracao-unidade"
                            value={formData.duracao.unidade}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                duracao: {
                                  ...prev.duracao,
                                  unidade: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="dias">Dias</option>
                            <option value="semanas">Semanas</option>
                            <option value="meses">Meses</option>
                          </select>
                        </div>
                      </div>

                      {/* Data Início e Fim */}
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="dataInicio"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Data de Início*
                          </label>
                          <input
                            type="date"
                            id="dataInicio"
                            name="dataInicio"
                            value={formData.dataInicio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="dataFim"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Data de Término
                          </label>
                          <input
                            type="date"
                            id="dataFim"
                            name="dataFim"
                            value={formData.dataFim}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Objetivos */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Objetivos do Tratamento
                        </label>
                        <div className="space-y-2">
                          {formData.objetivos.map((objetivo, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={objetivo}
                                onChange={(e) =>
                                  handleObjetivoChange(index, e.target.value)
                                }
                                placeholder={`Objetivo ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => removerObjetivo(index)}
                                className="p-2 text-red-500 hover:text-red-700 rounded"
                                disabled={
                                  formData.objetivos.length === 1 &&
                                  objetivo === ""
                                }
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={adicionarObjetivo}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        >
                          <Plus size={16} className="mr-1" />
                          Adicionar objetivo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Configuração de Sessões */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Configuração das Sessões
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {/* Quantidade de Sessões */}
                      <div>
                        <label
                          htmlFor="quantidade"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quantidade de Sessões
                        </label>
                        <input
                          type="number"
                          id="quantidade"
                          name="quantidade"
                          value={sessoesConfig.quantidade}
                          onChange={handleSessoesConfigChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Frequência */}
                      <div>
                        <label
                          htmlFor="frequencia"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Frequência
                        </label>
                        <select
                          id="frequencia"
                          name="frequencia"
                          value={sessoesConfig.frequencia}
                          onChange={handleSessoesConfigChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="diaria">Diária</option>
                          <option value="semanal">Semanal</option>
                          <option value="quinzenal">Quinzenal</option>
                          <option value="mensal">Mensal</option>
                        </select>
                      </div>

                      {/* Duração de Cada Sessão */}
                      <div>
                        <label
                          htmlFor="duracao"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Duração (minutos)
                        </label>
                        <input
                          type="number"
                          id="duracao"
                          name="duracao"
                          value={sessoesConfig.duracao}
                          onChange={handleSessoesConfigChange}
                          min="15"
                          step="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Dias da Semana */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dias da Semana
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {diasDaSemana.map((dia) => (
                            <button
                              key={dia.valor}
                              type="button"
                              onClick={() => handleDiaSemanaToggle(dia.valor)}
                              className={`w-8 h-8 rounded-full text-xs font-medium ${
                                sessoesConfig.diasDaSemana.includes(dia.valor)
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {dia.nome}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pré-visualização das Sessões */}
                    
                  </div>

                  {/* Botões de Ação */}
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={voltarParaLista}
                      className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className={`px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                        isCreating ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Criando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Criar Plano
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
