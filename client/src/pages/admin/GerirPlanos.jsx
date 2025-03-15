import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanos } from "../../contexts/PlanoContext";
import SideBar from "../../components/SideBar";
import {
  Calendar,
  Clock,
  FileText,
  Filter,
  XCircle,
  Users,
  BookOpen,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import { getAllUtentes } from "../../api/utente";
import {getAllPlanos} from '../../api/planos'

export default function GerirPlanos() {
  const navigate = useNavigate();
const [allPlanos, setAllPlanos]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlanos, setFilteredPlanos] = useState([]);
  const [utentes, setUtentes] = useState([]);
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState("todos");
  const [utenteSelecionado, setUtenteSelecionado] = useState("");

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Carregar planos e utentes quando o componente montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
       const planos= await getAllPlanos();
        setAllPlanos(planos)
        console.log(allPlanos);
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

    setFilteredPlanos(filtered);
  }, [ statusFilter, utenteSelecionado]);

  // Reset para página 1 quando mudar o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, utenteSelecionado]);

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

  // Definir classe de badge com base no status
  const getStatusClass = (status) => {
    switch(status) {
      case "Em Andamento":
        return "bg-green-100 text-green-700";
      case "Agendado":
        return "bg-blue-100 text-blue-700";
      case "Concluído":
        return "bg-purple-100 text-purple-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      case "Pausado":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SideBar />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : (
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
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Planos de Tratamento
                </h1>
                <p className="text-gray-500 max-w-xl">
                  Visualize e gerencie todos os planos de tratamento em andamento, agendados e concluídos.
                </p>
              </div>
            </div>

            <div className="-mt-24 mx-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Total de Planos
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {allPlanos?.length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Em Andamento
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {allPlanos?.filter(p => p.status === "Em Andamento").length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Pacientes em Tratamento
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {new Set(allPlanos?.filter(p => p.status === "Em Andamento").map(p => p.utenteId)).size || 0}
                  </p>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Filter size={20} className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filtros
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status do Plano
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                      >
                        <option value="todos">Todos os status</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Agendado">Agendado</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Pausado">Pausado</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <BarChart2 size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Paciente
                    </label>
                    <div className="relative">
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Users size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mostrar filtros ativos */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {statusFilter !== "todos" && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("todos")}
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  
                  {utenteSelecionado && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Paciente: {encontrarNomeUtente(utenteSelecionado)}
                      <button
                        onClick={() => setUtenteSelecionado("")}
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        <XCircle size={16} />
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

              {/* Resultados */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Planos de Tratamento
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredPlanos.length} planos encontrados
                  </span>
                </div>

                {/* Mensagem de erro */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-800 font-medium">Erro</h4>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Lista de Planos */}
                <div className="space-y-6 mb-8">
                  {getCurrentItems().length > 0 ? (
                    getCurrentItems().map((plano) => {
                      const progresso = calcularProgresso(plano);
                      const diasRestantes = calcularDiasRestantes(plano.dataFim);
                      
                      return (
                        <div
                          key={plano._id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-100">
                                  <BookOpen size={24} className="text-indigo-600" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {plano.titulo}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Users size={16} />
                                    {encontrarNomeUtente(plano.utenteId)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {formatarData(plano.dataInicio)} - {formatarData(plano.dataFim)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(plano.status)}`}>
                                {plano.status}
                              </span>
                            </div>
                          </div>
                          
                          {/* Detalhes adicionais */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Progresso do Tratamento
                              </h4>
                              <div className="mb-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium text-gray-700">Progresso</span>
                                  <span className="text-indigo-600 font-medium">{progresso}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${progresso}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {diasRestantes !== "Finalizado" ? `Restam ${diasRestantes}` : "Tratamento finalizado"}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Sessões
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-green-50 p-2 rounded-lg">
                                  <div className="text-xs text-gray-500">Concluídas</div>
                                  <div className="text-lg font-semibold text-green-700">
                                    {contarSessoesPorStatus(plano.sessoes, "concluida")}/{plano.sessoes?.length || 0}
                                  </div>
                                </div>
                                <div className="bg-indigo-50 p-2 rounded-lg">
                                  <div className="text-xs text-gray-500">Próxima</div>
                                  <div className="text-sm font-medium text-indigo-700">
                                    {plano.sessoes?.find(s => s.status === "reservada" || s.status === "disponivel")
                                      ? formatarData(plano.sessoes.find(s => s.status === "reservada" || s.status === "disponivel").dataHoraInicio)
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Objetivos */}
                          {plano.objetivos && plano.objetivos.length > 0 && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Objetivos do Tratamento
                              </h4>
                              <ul className="space-y-2">
                                {plano.objetivos.slice(0, 2).map((objetivo, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                    <span className="text-gray-700">{objetivo}</span>
                                  </li>
                                ))}
                                {plano.objetivos.length > 2 && (
                                  <li className="text-sm text-indigo-600">
                                    + {plano.objetivos.length - 2} outros objetivos
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          {/* Botões de Ação */}
                          <div className="flex justify-end gap-2 mt-6">
                            <button
                              onClick={() => verDetalhesPlano(plano._id)}
                              className="px-3 py-1.5 text-sm border border-indigo-300 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalhes
                            </button>
                            
                            <button
                              onClick={() => navigate(`/planos/${plano._id}/editar`)}
                              className="px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Nenhum plano encontrado
                      </h3>
                      <p className="text-gray-500">
                        Tente ajustar seus filtros para ver mais resultados
                      </p>
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
          </div>
        )}
      </div>
    </div>
  );
}