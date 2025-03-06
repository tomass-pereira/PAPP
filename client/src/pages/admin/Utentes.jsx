import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import { Search, UserPlus, Filter, Eye, Lock } from 'lucide-react';
import { getAllUtentes, BloquearUtente } from "../../api/utente";

export default function Utentes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [utentes, setUtentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUtente, setSelectedUtente] = useState(null);

  const handleBloquearUtente = async (utenteId) => {
    try {
     
      if (!confirm('Tem certeza que deseja bloquear este utente?')) {
        return;
      }
      
      setLoading(true);
      console.log(utenteId);
      await BloquearUtente(utenteId);
      
      // Recarregar a lista após o bloqueio
      const response = await getAllUtentes();
      setUtentes(response);
      
      // Mostrar notificação de sucesso
      alert('Utente bloqueado com sucesso!');
    } catch (error) {
      console.error('Falha ao bloquear utente:', error);
      alert('Erro ao bloquear utente. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
    

  useEffect(() => {
    // Function to fetch utentes
    const fetchUtentes = async () => {
      try {
        setLoading(true);
        

        const response = await getAllUtentes();

        // Map the API data to the structure expected by our component
        const mappedUtentes = response.map((utente) => ({
          id: utente._id,
          nome: utente.nome,
          email: utente.email,
          telefone: utente.telefone,
          status: mapStatusToUI(utente.StatusConta),
          ultimaAtualizacao: utente.ultimaAtualizacao,
          dataNascimento: utente.dataNascimento,
          profileImage: utente.profileImage,
          // Preserve all original data for the modal
          morada: utente.morada,
          StatusConta: utente.StatusConta,
          lesoesOuCirurgias: utente.lesoesOuCirurgias,
          diagnosticoMedico: utente.diagnosticoMedico,
          alergias: utente.alergias,
          dataCriacao: utente.dataCriacao,
        }));

        setUtentes(mappedUtentes);

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

  // Open the modal with selected utente details
  const openModal = (utente) => {
    setSelectedUtente(utente);
    document.getElementById("utente_details_modal").showModal();
  };

  // Maps the API status to our UI statuses
  const mapStatusToUI = (status) => {
    switch (status) {
      case "aprovado":
        return "active";
      case "pendente":
        return "pending";
      case "rejeitado":
        return "inactive";
      default:
        return "pending";
    }
  };

  // Filter utentes based on search term and status filter
  const filteredUtentes = utentes.filter((utente) => {
    const matchesSearch =
      utente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utente.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || utente.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to translate status to Portuguese
  const translateStatus = (status) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  // Function to format date to local format
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-PT");
    } catch (error) {
      return "Data inválida";
    }
  };

  // Function to calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container px-6 py-8 mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Gestão de Utentes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie os utentes registados no sistema
              </p>
            </div>

           
          </div>

          {/* Filters and Search Section */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Pesquisar por nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto flex space-x-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os estados</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="pending">Pendentes</option>
              </select>

              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Filter className="w-4 h-4 mr-2" />
                Mais filtros
              </button>
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div
              className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Table Section */}
          {!loading && !error && (
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Utente
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contactos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Idade
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Última Atualização
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUtentes.length > 0 ? (
                      filteredUtentes.map((utente) => (
                        <tr key={utente.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {utente.profileImage ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={utente.profileImage}
                                    alt={`Foto de ${utente.nome}`}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-lg">
                                    {utente.nome?.charAt(0) || "?"}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {utente.nome}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {utente.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {utente.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {utente.telefone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                utente.status
                              )}`}
                            >
                              {translateStatus(utente.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {calculateAge(utente.dataNascimento)} anos
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(utente.ultimaAtualizacao)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Ver detalhes"
                                onClick={() => openModal(utente)}
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Bloquear"
                                onClick={() => handleBloquearUtente(utente.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-5 h-5"
                                >
                                  <rect
                                    width="18"
                                    height="11"
                                    x="3"
                                    y="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          Nenhum utente encontrado com os critérios de pesquisa
                          atuais.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUtentes.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Anterior
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Próximo
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">1</span> a{" "}
                        <span className="font-medium">
                          {filteredUtentes.length}
                        </span>{" "}
                        de <span className="font-medium">{utentes.length}</span>{" "}
                        resultados
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          &laquo;
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal for Utente Details */}
          <dialog id="utente_details_modal" className="modal">
            <div className="modal-box max-w-3xl">
              {selectedUtente && (
                <>
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 h-16 w-16 mr-4">
                      {selectedUtente.profileImage ? (
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={selectedUtente.profileImage}
                          alt={`Foto de ${selectedUtente.nome}`}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-2xl">
                          {selectedUtente.nome?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedUtente.nome}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            selectedUtente.status
                          )}`}
                        >
                          {translateStatus(selectedUtente.status)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {calculateAge(selectedUtente.dataNascimento)} anos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações Pessoais */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-700 mb-3">
                        Informações Pessoais
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">ID</p>
                          <p className="text-sm">{selectedUtente.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-sm">{selectedUtente.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Telefone</p>
                          <p className="text-sm">{selectedUtente.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Data de Nascimento
                          </p>
                          <p className="text-sm">
                            {formatDate(selectedUtente.dataNascimento)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Morada */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-700 mb-3">
                        Morada
                      </h4>
                      {selectedUtente.morada ? (
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-500">Rua</p>
                            <p className="text-sm">
                              {selectedUtente.morada.rua}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Número/Porta
                            </p>
                            <p className="text-sm">
                              {selectedUtente.morada.numPorta || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Apartamento</p>
                            <p className="text-sm">
                              {selectedUtente.morada.apartamento ||
                                "Não se aplica"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Código Postal
                            </p>
                            <p className="text-sm">
                              {selectedUtente.morada.codigoPostal}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Localidade</p>
                            <p className="text-sm">
                              {selectedUtente.morada.concelho},{" "}
                              {selectedUtente.morada.distrito}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Sem informações de morada
                        </p>
                      )}
                    </div>

                    {/* Informações Médicas */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-700 mb-3">
                        Informações Médicas
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            Lesões ou Cirurgias
                          </p>
                          <p className="text-sm">
                            {selectedUtente.lesoesOuCirurgias || "Nenhuma"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Diagnóstico Médico
                          </p>
                          <p className="text-sm">
                            {selectedUtente.diagnosticoMedico || "Nenhum"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Alergias</p>
                          <p className="text-sm">
                            {selectedUtente.alergias || "Nenhuma"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Datas */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-700 mb-3">
                        Datas
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            Data de Criação
                          </p>
                          <p className="text-sm">
                            {formatDate(selectedUtente.dataCriacao)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Última Atualização
                          </p>
                          <p className="text-sm">
                            {formatDate(selectedUtente.ultimaAtualizacao)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Fechar</button>
                    </form>
                  </div>
                </>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>Fechar</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
}
