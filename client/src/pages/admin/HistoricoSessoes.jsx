import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { getAllUtentes } from "../../api/utente";
import { useSessoes } from "../../contexts/SessoesContext";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Filter,
  Star,
  XCircle,
  Users
} from "lucide-react";

export default function HistoricoConsultas() {
  const { sessoesReservadas, sessoesConcluidas, sessoesCanceladas, loading, allSessoes } =
    useSessoes();

  const [tipoHistorico, setTipoHistorico] = useState("reservadas"); // "reservadas" ou "canceladas"
  // Estado para filtro de mês
  const [mesSelecionado, setMesSelecionado] = useState("");
  
  // Estado para filtro de utente
  const [utenteSelecionado, setUtenteSelecionado] = useState("");
  
  // Estado para utentes
  const [utentes, setUtentes] = useState([]);
  const [loadingUtentes, setLoadingUtentes] = useState(false);

  // Estados para filtros e paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Buscar todos os utentes
  useEffect(() => {
    const fetchUtentes = async () => {
      try {
        setLoadingUtentes(true);
        const response = await getAllUtentes();
        setUtentes(response);
        console.log("Utentes:", response);
      } catch (error) {
        console.error("Erro ao buscar utentes:", error);
      } finally {
        setLoadingUtentes(false);
      }
    };

    fetchUtentes();
  }, []);

  // Definir qual array usar baseado no tipo selecionado
  const sessoesPorTipo =
    tipoHistorico === "reservadas"
      ? sessoesReservadas
      : tipoHistorico === "concluidas"
      ? sessoesConcluidas
      : sessoesCanceladas;

  // Filtrar por mês e utente
  const sessoesFiltradas = sessoesPorTipo.filter((sessao) => {
    let passaFiltroMes = true;
    let passaFiltroUtente = true;

    // Filtro por mês
    if (mesSelecionado) {
      const dataSessao = new Date(
        tipoHistorico === "canceladas"
          ? sessao.dataConsultaOriginal
          : sessao.dataHoraInicio
      );
      passaFiltroMes = dataSessao.getMonth() === parseInt(mesSelecionado);
    }

    // Filtro por utente
    if (utenteSelecionado) {
      passaFiltroUtente = sessao.utenteId === utenteSelecionado;
    }

    return passaFiltroMes && passaFiltroUtente;
  });

  // Lógica de paginação
  const totalPages = Math.ceil(sessoesFiltradas.length / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sessoesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Reset para página 1 quando mudar o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [mesSelecionado, utenteSelecionado]);

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

  // Função para obter o utente pelo ID
  const getUtente = (utenteId) => {
    return utentes.find(u => u._id === utenteId) || null;
  };

  // Lista de meses para o dropdown
  const meses = [
    { valor: "0", nome: "Janeiro" },
    { valor: "1", nome: "Fevereiro" },
    { valor: "2", nome: "Março" },
    { valor: "3", nome: "Abril" },
    { valor: "4", nome: "Maio" },
    { valor: "5", nome: "Junho" },
    { valor: "6", nome: "Julho" },
    { valor: "7", nome: "Agosto" },
    { valor: "8", nome: "Setembro" },
    { valor: "9", nome: "Outubro" },
    { valor: "10", nome: "Novembro" },
    { valor: "11", nome: "Dezembro" },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SideBar />

      <div className="flex-1 overflow-auto">
        {loading || loadingUtentes ? (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="bg-white px-8 pt-16 pb-20 mb-8">
              <div className="w-100% mx-auto">
                <div className="flex items-center gap-3 text-indigo-600 mb-3">
                  <FileText size={20} />
                  <span className="text-sm font-medium">Histórico</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Histórico de Sessões
                </h1>
                <p className="text-gray-500 max-w-xl">
                  Acompanhe todas as suas sessões
                </p>
              </div>
            </div>

            <div className="-mt-24 mx-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Total de Sessões
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {sessoesReservadas.length +
                      sessoesCanceladas.length +
                      sessoesConcluidas.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Realizadas/Concluídas
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {
                      sessoesConcluidas.filter(
                        (s) =>
                          s.status === "realizada" || s.status === "concluida"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Canceladas
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    {sessoesCanceladas.length}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sessão
                    </label>
                    <div className="relative">
                      <select
                        value={tipoHistorico}
                        onChange={(e) => {
                          setTipoHistorico(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                      >
                        <option value="reservadas">Sessões Reservadas</option>
                        <option value="concluidas">Sessões Concluídas</option>
                        <option value="canceladas">Sessões Canceladas</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Mês
                    </label>
                    <div className="relative">
                      <select
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                      >
                        <option value="">Todos os meses</option>
                        {meses.map((mes) => (
                          <option key={mes.valor} value={mes.valor}>
                            {mes.nome}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Utente
                    </label>
                    <div className="relative">
                      <select
                        value={utenteSelecionado}
                        onChange={(e) => setUtenteSelecionado(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                      >
                        <option value="">Todos os utentes</option>
                        {utentes.map((utente) => (
                          <option key={utente._id} value={utente._id}>
                            {utente.nome}
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
                  {mesSelecionado && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Mês: {meses.find((m) => m.valor === mesSelecionado)?.nome}
                      <button
                        onClick={() => setMesSelecionado("")}
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  
                  {utenteSelecionado && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Utente: {utentes.find(u => u._id === utenteSelecionado)?.nome}
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

              {/* Resultados */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Resultados
                  </h2>
                  <span className="text-sm text-gray-500">
                    {sessoesFiltradas.length} sessões encontradas
                  </span>
                </div>

                {/* Lista de Sessões */}
                <div className="space-y-6 mb-8">
                  {allSessoes.length > 0 ? (
                    allSessoes.map((sessao) => {
                     const utente=sessao.utenteId;
                      return (
                        <div
                          key={sessao._id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    tipoHistorico === "canceladas"
                                      ? "bg-red-100"
                                      : "bg-indigo-100"
                                  }`}
                                >
                                  {tipoHistorico === "canceladas" ? (
                                    <XCircle size={24} className="text-red-600" />
                                  ) : (
                                    <Calendar
                                      size={24}
                                      className="text-indigo-600"
                                    />
                                  )}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  Sessão de Fisioterapia
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {new Date(
                                      tipoHistorico === "canceladas"
                                        ? sessao.dataConsultaOriginal
                                        : sessao.dataHoraInicio
                                    ).toLocaleDateString()}{" "}
                                    às{" "}
                                    {new Date(
                                      tipoHistorico === "canceladas"
                                        ? sessao.dataConsultaOriginal
                                        : sessao.dataHoraInicio
                                    ).toLocaleTimeString("pt-PT", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  tipoHistorico === "canceladas"
                                    ? "bg-red-100 text-red-700"
                                    : sessao.status === "realizada" ||
                                      sessao.status === "concluida"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-indigo-100 text-indigo-700"
                                }`}
                              >
                                {tipoHistorico === "canceladas"
                                  ? "Cancelada"
                                  : sessao.status.charAt(0).toUpperCase() +
                                    sessao.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Informações do Utente */}
                          {utente && (
                            <div className="border-t border-gray-100 pt-4 mt-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                  {utente.profileImage ? (
                                    <img 
                                      src={utente.profileImage} 
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium">
                                      {utente.nome.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Utente
                                  </h4>
                                  <p className="text-sm text-gray-900">
                                    {utente.nome}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Motivo */}
                          {(sessao.motivo || sessao.motivoCancelamento) && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  {tipoHistorico === "canceladas"
                                    ? "Motivo do Cancelamento"
                                    : "Motivo"}
                                </h4>
                                <p className="text-gray-900">
                                  {tipoHistorico === "canceladas"
                                    ? sessao.motivoCancelamento
                                    : sessao.motivo}
                                </p>
                              </div>
                              {tipoHistorico === "canceladas" &&
                                sessao.dataCancelamento && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                                      Data do Cancelamento
                                    </h4>
                                    <p className="text-gray-900">
                                      {new Date(
                                        sessao.dataCancelamento
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                            </div>
                          )}
                          {tipoHistorico !== "canceladas" && sessao.feedbackId && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                              <h4 className="text-sm font-medium text-gray-700 mb-4">
                                O seu Feedback 
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500 mb-2">
                                    Nível de Dor
                                  </h5>
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-red-600 h-2.5 rounded-full"
                                        style={{
                                          width: `${sessao.feedbackId.dor * 10}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {sessao.feedbackId.dor}/10
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-500 mb-2">
                                    Satisfação
                                  </h5>
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                          width: `${
                                            sessao.feedbackId.satisfacao * 10
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {sessao.feedbackId.satisfacao}
                                    </span>
                                  </div>
                                </div>

                                <div className="md:col-span-2">
                                  <h5 className="text-sm font-medium text-gray-500 mb-2">
                                    Avaliação Geral
                                  </h5>
                                  <div className="flex items-center text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={20}
                                        className={
                                          star <= sessao.feedbackId.avaliacao
                                            ? "fill-current"
                                            : ""
                                        }
                                      />
                                    ))}
                                    <span className="ml-2 text-gray-900">
                                      {sessao.feedbackId.avaliacao}/5
                                    </span>
                                  </div>
                                </div>

                                {sessao.feedbackId.comentario && (
                                  <div className="md:col-span-2">
                                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                                      Comentário
                                    </h5>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">
                                      "{sessao.feedbackId.comentario}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
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
                        Nenhuma sessão encontrada
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