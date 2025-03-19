import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanos } from "../../contexts/PlanoContext";
import SideBar from "../../components/SideBar";
import {
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  CheckCircle,
  BarChart,
  ArrowRight,
  Timer,
  Info,
  Award,
  Activity,
  Search,
  Filter,
  ChevronDown,
  X,
  FileText,
  XCircle,
  Users,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import { getAllUtentes } from "../../api/utente";
import { getAllPlanos } from '../../api/planos';

export default function GerirPlanos() {
  const navigate = useNavigate();
  const [allPlanos, setAllPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlanos, setFilteredPlanos] = useState([]);
  const [utentes, setUtentes] = useState([]);
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState("todos");
  const [utenteSelecionado, setUtenteSelecionado] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Carregar planos e utentes quando o componente montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const planos = await getAllPlanos();
        setAllPlanos(planos);
        setFilteredPlanos(planos);
        const utentesData = await getAllUtentes();
        setUtentes(utentesData);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Ocorreu um erro ao carregar os planos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar planos com base nos filtros aplicados
  useEffect(() => {
    if (!allPlanos) return;

    let filtered = [...allPlanos];

    // Aplicar filtro de status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(plano => plano.status === statusFilter);
    }

    // Aplicar filtro de utente
    if (utenteSelecionado) {
      filtered = filtered.filter(plano => plano.utenteId === utenteSelecionado);
    }

    // Aplicar filtro de pesquisa
    if (pesquisa) {
      filtered = filtered.filter(plano => 
        plano.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) || 
        encontrarNomeUtente(plano.utenteId).toLowerCase().includes(pesquisa.toLowerCase()) ||
        (plano.tipotratamento || "").toLowerCase().includes(pesquisa.toLowerCase())
      );
    }

    setFilteredPlanos(filtered);
  }, [allPlanos, statusFilter, utenteSelecionado, pesquisa]);

  // Reset para página 1 quando mudar o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, utenteSelecionado, pesquisa]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredPlanos.length / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPlanos.slice(indexOfFirstItem, indexOfLastItem);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Navegação para criar novo plano
  const navegarParaCriarPlano = () => {
    navigate("/Fisio/AdicionarPlano");
  };

  const verDetalhesPlano = (planoId) => {
    navigate(`/planos/${planoId}`);
  };

  // Formatação de data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calcular progresso do plano
  const calcularProgresso = (plano) => {
    if (!plano.dataInicio || !plano.dataFim) return 0;
    
    const hoje = new Date();
    const inicio = new Date(plano.dataInicio);
    const fim = new Date(plano.dataFim);
    
    // Se o plano ainda não começou
    if (hoje < inicio) return 0;
    
    // Se o plano já terminou
    if (hoje > fim) return 100;
    
    // Calculando progresso
    const totalDias = (fim - inicio) / (1000 * 60 * 60 * 24);
    const diasDecorridos = (hoje - inicio) / (1000 * 60 * 60 * 24);
    
    return Math.round((diasDecorridos / totalDias) * 100);
  };

  // Calcular dias restantes
  const calcularDiasRestantes = (dataFim) => {
    if (!dataFim) return "N/A";
    
    const hoje = new Date();
    const fim = new Date(dataFim);
    
    // Se já passou a data de fim
    if (hoje > fim) return "Finalizado";
    
    const diasRestantes = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
    return diasRestantes > 1 ? `${diasRestantes} dias` : `${diasRestantes} dia`;
  };

  // Encontrar nome do utente pelo ID
  const encontrarNomeUtente = (utenteId) => {
    const utente = utentes.find(u => u._id === utenteId);
    return utente ? `${utente.nome} ${utente.apelido || ''}` : "Utente não encontrado";
  };

  // Contar sessões por status
  const contarSessoesPorStatus = (sessoes, status) => {
    if (!sessoes || !Array.isArray(sessoes)) return 0;
    return sessoes.filter(sessao => sessao.status === status).length;
  };

  // Calcular progresso detalhado para um plano (similar ao calcularProgressoPlano do primeiro arquivo)
  const calcularProgressoPlano = (plano) => {
    if (!plano || !plano.sessoes) {
      return {
        percentualConcluido: 0,
        sessoesRealizadas: 0,
        sessoesTotais: 0
      };
    }
    
    const sessoesRealizadas = plano.sessoes.filter(s => s.status === "concluida" || s.status === "Realizada").length;
    const sessoesTotais = plano.sessoes.length;
    
    // Se não tem sessões, considera 0% de progresso
    if (sessoesTotais === 0) {
      return {
        percentualConcluido: 0,
        sessoesRealizadas: 0,
        sessoesTotais: 0
      };
    }
    
    // Calcula percentual com base nas sessões realizadas
    const percentualConcluido = Math.round((sessoesRealizadas / sessoesTotais) * 100);
    
    return {
      percentualConcluido,
      sessoesRealizadas,
      sessoesTotais
    };
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SideBar />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando planos de tratamento...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="bg-white px-8 pt-16 pb-20 mb-8">
              <div className="w-100% mx-auto">
                <div className="flex items-center gap-3 text-indigo-600 mb-3">
                  <BookOpen size={20} />
                  <span className="text-sm font-medium">Gestão de Tratamentos</span>
                </div>
                <h1 className="text-4xl font-bold text-indigo-600 mb-3">
                  Planos de Tratamento
                </h1>
                <p className="text-gray-600 max-w-xl">
                  Visualize e gerencie todos os planos de tratamento em andamento, agendados e concluídos.
                </p>
              </div>
            </div>

            <div className="-mt-24 mx-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Planos</h3>
                  <p className="text-3xl font-bold text-gray-900">{allPlanos?.length || 0}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Em Andamento</h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {allPlanos?.filter(p => p.status === "Em Andamento").length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Pacientes em Tratamento</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {new Set(allPlanos?.filter(p => p.status === "Em Andamento").map(p => p.utenteId)).size || 0}
                  </p>
                </div>
              </div>

              {/* Filtros e Pesquisa */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Filter size={20} className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Filtrar Planos</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-64">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                    >
                      <option value="todos">Todos os status</option>
                      <option value="Em Andamento">Em andamento</option>
                      <option value="Agendado">Agendados</option>
                      <option value="Concluído">Concluídos</option>
                      <option value="Cancelado">Cancelados</option>
                      <option value="Pausado">Pausados</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative md:w-64">
                    <select 
                      value={utenteSelecionado}
                      onChange={(e) => setUtenteSelecionado(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                    >
                      <option value="">Todos os pacientes</option>
                      {utentes.map((utente) => (
                        <option key={utente._id} value={utente._id}>
                          {utente.nome} {utente.apelido || ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type="search" 
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                      placeholder="Pesquisar por título, paciente ou tipo..." 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {pesquisa && (
                      <button
                        onClick={() => setPesquisa("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Mostrar filtros ativos */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {statusFilter !== "todos" && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("todos")}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {utenteSelecionado && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Paciente: {encontrarNomeUtente(utenteSelecionado)}
                      <button
                        onClick={() => setUtenteSelecionado("")}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {pesquisa && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Pesquisa: {pesquisa}
                      <button
                        onClick={() => setPesquisa("")}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Botão Novo Plano */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={navegarParaCriarPlano}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Plano
                </button>
              </div>

              {/* Lista de Planos */}
              <div className="space-y-6 mb-8">
                {getCurrentItems().length > 0 ? (
                  getCurrentItems().map((plano) => {
                    const progresso = calcularProgressoPlano(plano);
                    
                    return (
                      <div 
                        key={plano._id}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        {/* Header do Plano */}
                        <div className={`p-0.5 ${
                          plano.status === "Em Andamento" 
                            ? "bg-gradient-to-r from-indigo-600 to-blue-500" 
                            : plano.status === "Agendado"
                              ? "bg-gradient-to-r from-amber-500 to-orange-400"
                              : "bg-gradient-to-r from-green-500 to-emerald-400"
                        }`}></div>
                        
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="flex items-start gap-4">
                                  <div className={`p-2 rounded-lg ${
                                    plano.status === "Em Andamento"
                                      ? "bg-indigo-100"
                                      : plano.status === "Agendado"
                                        ? "bg-amber-100"
                                        : "bg-green-100"
                                  }`}>
                                    <BookOpen className={`w-6 h-6 ${
                                      plano.status === "Em Andamento"
                                        ? "text-indigo-600"
                                        : plano.status === "Agendado"
                                          ? "text-amber-600"
                                          : "text-green-600"
                                    }`} />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{plano.titulo}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                      Paciente: {encontrarNomeUtente(plano.utenteId)}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatarData(plano.dataInicio)} - {formatarData(plano.dataFim)}
                                      </span>
                                      <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                      <span>{plano.tipotratamento || 'Não definido'}</span>
                                    </div>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  plano.status === "Em Andamento"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : plano.status === "Agendado"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-green-100 text-green-800"
                                }`}>
                                  {plano.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progresso */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1 flex items-center">
                                <BarChart className="w-4 h-4 mr-1" />
                                Progresso Geral
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-indigo-600 h-2.5 rounded-full" 
                                    style={{width: `${progresso.percentualConcluido}%`}}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{progresso.percentualConcluido}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Sessões Realizadas
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-green-500 h-2.5 rounded-full" 
                                    style={{
                                      width: `${progresso.sessoesTotais > 0 
                                        ? (progresso.sessoesRealizadas / progresso.sessoesTotais) * 100 
                                        : 0}%`
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">
                                  {progresso.sessoesRealizadas}/{progresso.sessoesTotais}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Exibição de objetivos (opcional) */}
                          {plano.objetivos && plano.objetivos.length > 0 && (
                            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500 mb-2">Objetivos principais:</p>
                              <ul className="space-y-1">
                                {plano.objetivos.slice(0, 2).map((objetivo, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{objetivo}</span>
                                  </li>
                                ))}
                                {plano.objetivos.length > 2 && (
                                  <li className="text-xs text-indigo-600 ml-6">
                                    + {plano.objetivos.length - 2} outros objetivos
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Footer do Card */}
                          <div className="mt-5 flex flex-col float-right mb-3 sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => verDetalhesPlano(plano._id)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center transition-colors"
                            >
                              Ver detalhes
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Nenhum plano de tratamento encontrado
                    </h3>
                    <p className="text-gray-500">
                      Tente ajustar seus filtros para ver mais resultados
                    </p>
                    {(statusFilter !== "todos" || utenteSelecionado !== "" || pesquisa !== "") && (
                      <button
                        onClick={() => {
                          setStatusFilter("todos");
                          setUtenteSelecionado("");
                          setPesquisa("");
                        }}
                        className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex gap-1 bg-white px-1 py-1 rounded-xl shadow-sm border border-gray-100">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Anterior
                    </button>

                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                          currentPage === number
                            ? "bg-indigo-600 text-white"
                            : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Próximo
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}