import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import { useSessoes } from "../../contexts/SessoesContext";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Filter,
  XCircle,
} from "lucide-react";

export default function HistoricoConsultas() {
  const { sessoesReservadas, sessoesCanceladas, loading } = useSessoes();
  
  // Definir qual tipo de sessões mostrar
  const [tipoHistorico, setTipoHistorico] = useState("reservadas"); // "reservadas" ou "canceladas"

  // Estados para filtros e paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Definir qual array usar baseado no tipo selecionado
  const sessoesPorTipo = tipoHistorico === "reservadas" ? sessoesReservadas : sessoesCanceladas;

  // Lógica de paginação
  const totalPages = Math.ceil(sessoesPorTipo.length / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sessoesPorTipo.slice(indexOfFirstItem, indexOfLastItem);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
                  {sessoesReservadas.length + sessoesCanceladas.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">
                  Realizadas
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {sessoesReservadas.filter((s) => s.status === "realizada").length}
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
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              </div>
              <div className="w-64">
                <div className="relative">
                  <select
                    value={tipoHistorico}
                    onChange={(e) => {
                      setTipoHistorico(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                  >
                    <option value="reservadas">Sessões Reservadas/Realizadas</option>
                    <option value="canceladas">Sessões Canceladas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Sessões */}
            <div className="space-y-6 mb-8">
              {getCurrentItems().map((sessao) => (
                <div
                  key={sessao._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tipoHistorico === "canceladas" ? "bg-red-100" : "bg-indigo-100"
                        }`}>
                          {tipoHistorico === "canceladas" ? (
                            <XCircle size={24} className="text-red-600" />
                          ) : (
                            <Calendar size={24} className="text-indigo-600" />
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
                              tipoHistorico === "canceladas" ? sessao.dataConsultaOriginal : sessao.dataHoraInicio
                            ).toLocaleDateString()} às{" "}
                            {new Date(
                              tipoHistorico === "canceladas" ? sessao.dataConsultaOriginal : sessao.dataHoraInicio
                            ).toLocaleTimeString('pt-PT', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        tipoHistorico === "canceladas" 
                          ? "bg-red-100 text-red-700"
                          : sessao.status === "realizada"
                          ? "bg-green-100 text-green-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {tipoHistorico === "canceladas" ? "Cancelada" : 
                          sessao.status.charAt(0).toUpperCase() + sessao.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Motivo */}
                  {(sessao.motivo || sessao.motivoCancelamento) && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          {tipoHistorico === "canceladas" ? "Motivo do Cancelamento" : "Motivo"}
                        </h4>
                        <p className="text-gray-900">
                          {tipoHistorico === "canceladas" ? sessao.motivoCancelamento : sessao.motivo}
                        </p>
                      </div>
                      {tipoHistorico === "canceladas" && sessao.dataCancelamento && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Data do Cancelamento
                          </h4>
                          <p className="text-gray-900">
                            {new Date(sessao.dataCancelamento).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center pb-8">
                <nav className="flex gap-1 bg-white px-1 py-1 rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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