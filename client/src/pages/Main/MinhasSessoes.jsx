import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { useSessoes } from "../../contexts/SessoesContext";
import { useUser } from "../../contexts/UserContext";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Filter,
  Star,
  XCircle,
  User
} from "lucide-react";

export default function HistoricoConsultas() {
  const { allSessoes, sessoesReservadas, sessoesConcluidas, sessoesCanceladas } = useSessoes();
  const { isFisio } = useUser(); // Get user to check if they're a fisio
  
  const [loading, setLoading] = useState(true);
  const [tipoHistorico, setTipoHistorico] = useState("reservadas"); // "reservadas", "concluidas" ou "canceladas"

  // Estado para filtro de mês
  const [mesSelecionado, setMesSelecionado] = useState("");
  
  // Estado para filtro de utente (apenas para fisioterapeutas)
  const [utenteSelecionado, setUtenteSelecionado] = useState("");

  // Estados para filtros e paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Processando os dados das sessões
  useEffect(() => {
    // For fisio, check allSessoes; for patients check the individual arrays
    if ((isFisio && allSessoes) || (!isFisio && sessoesReservadas !== undefined)) {
      setLoading(false);
    }
  }, [allSessoes, sessoesReservadas, isFisio]);

  // Sessões logic based on user type
  let sessoesReservadasData = [];
  let sessoesConcludasData = [];
  let sessoesCanceladasData = [];

  if (isFisio && allSessoes) {
    // Fisio view: filter from allSessoes
    sessoesReservadasData = allSessoes.filter(sessao => 
      sessao.status === "reservada" || sessao.status === "confirmada"
    );
    
    sessoesConcludasData = allSessoes.filter(sessao => 
      sessao.status === "realizada" || sessao.status === "concluida"
    );
    
    sessoesCanceladasData = allSessoes.filter(sessao => 
      sessao.status === "cancelada"
    );
  } else {
    // Patient view: use the provided arrays
    sessoesReservadasData = sessoesReservadas || [];
    sessoesConcludasData = sessoesConcluidas || [];
    sessoesCanceladasData = sessoesCanceladas || [];
  }

  // Obter lista de utentes únicos para o filtro (apenas para fisioterapeutas)
  const utentesList = [];
  if (isFisio && allSessoes) {
    const utentesUnicos = [...new Set(allSessoes
      .filter(sessao => sessao.utenteId?._id)
      .map(sessao => sessao.utenteId._id)
    )];

    utentesUnicos.forEach(utenteId => {
      const sessao = allSessoes.find(s => s.utenteId?._id === utenteId);
      if (sessao?.utenteId?.nome) {
        utentesList.push({
          id: utenteId,
          nome: sessao.utenteId.nome
        });
      }
    });
  }

  // Definir qual array usar baseado no tipo selecionado
  const sessoesPorTipo =
    tipoHistorico === "reservadas"
      ? sessoesReservadasData
      : tipoHistorico === "concluidas"
      ? sessoesConcludasData
      : sessoesCanceladasData;

  // Aplicar filtros
  const sessoesFiltradas = sessoesPorTipo
    .filter(sessao => {
      // Filtro por mês
      if (mesSelecionado) {
        const dataSessao = new Date(
          tipoHistorico === "canceladas"
            ? sessao.dataCancelamento || sessao.dataConsultaOriginal || sessao.dataHoraInicio
            : sessao.dataHoraInicio
        );
        if (dataSessao.getMonth() !== parseInt(mesSelecionado)) {
          return false;
        }
      }
      
      // Filtro por utente (apenas para fisioterapeutas)
      if (isFisio && utenteSelecionado && sessao.utenteId?._id !== utenteSelecionado) {
        return false;
      }
      
      return true;
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
  }, [mesSelecionado, utenteSelecionado, tipoHistorico]);

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
                  <FileText size={20} />
                  <span className="text-sm font-medium">Histórico</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Histórico de Sessões
                </h1>
                <p className="text-gray-500 max-w-xl">
                  {isFisio 
                    ? "Acompanhe todas as sessões com seus utentes" 
                    : "Acompanhe todas as suas sessões"}
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
                    {sessoesReservadasData.length +
                      sessoesCanceladasData.length +
                      sessoesConcludasData.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Realizadas/Concluídas
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {sessoesConcludasData.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Canceladas
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    {sessoesCanceladasData.length}
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
                <div className={`grid grid-cols-1 ${isFisio ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
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

                  {/* Filtro de utente (apenas para fisioterapeutas) */}
                  {isFisio && (
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
                          {utentesList.map((utente) => (
                            <option key={utente.id} value={utente.id}>
                              {utente.nome}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <User size={16} />
                        </div>
                      </div>
                    </div>
                  )}
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
                  
                  {isFisio && utenteSelecionado && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Utente: {utentesList.find((u) => u.id === utenteSelecionado)?.nome}
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
                  {getCurrentItems().length > 0 ? (
                    getCurrentItems().map((sessao) => (
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
                                    tipoHistorico === "canceladas" && sessao.dataCancelamento
                                      ? sessao.dataCancelamento
                                      : tipoHistorico === "canceladas" && sessao.dataConsultaOriginal
                                      ? sessao.dataConsultaOriginal 
                                      : sessao.dataHoraInicio
                                  ).toLocaleDateString()}{" "}
                                  às{" "}
                                  {new Date(
                                    tipoHistorico === "canceladas" && sessao.dataCancelamento
                                      ? sessao.dataCancelamento
                                      : tipoHistorico === "canceladas" && sessao.dataConsultaOriginal
                                      ? sessao.dataConsultaOriginal 
                                      : sessao.dataHoraInicio
                                  ).toLocaleTimeString("pt-PT", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {/* Só mostra o nome do utente para fisioterapeutas */}
                                
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

                        {/* Informação do Utente (apenas para fisioterapeutas) */}
                        {isFisio && (
                          <div className="border-t border-gray-100 pt-6 mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-4">
                              Informações do Utente
                            </h4>
                            <div className="flex items-center mb-6">
                              {sessao.utenteId?.profileImage ? (
                                <div className="relative">
                                  <img 
                                    src={sessao.utenteId.profileImage} 
                                    alt={`Foto de ${sessao.utenteId.nome}`} 
                                    className="w-11 h-11 rounded-full object-cover border-4 border-white"
                                  />
                                  
                                </div>
                              ) : null
                              }
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="text-sm font-medium text-gray-500 mb-2">
                                  Contacto
                                </h5>
                                <p className="text-gray-900">
                                  {sessao.utenteId?.telefone || "Não disponível"}
                                </p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500 mb-2">
                                  Email
                                </h5>
                                <p className="text-gray-900">
                                  {sessao.utenteId?.email || "Não disponível"}
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

                        {/* Feedback */}
                        {tipoHistorico !== "canceladas" && sessao.feedbackId && (
                          <div className="border-t border-gray-100 pt-6 mt-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-4">
                              {isFisio ? "Feedback do Utente" : "O seu Feedback"}
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
                    ))
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