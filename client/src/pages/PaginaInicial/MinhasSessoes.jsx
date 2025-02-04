import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import { Calendar, Clock, MapPin, FileText, Filter, ChevronDown, Search } from "lucide-react";

export default function HistoricoConsultas() {
 // Dados mockados para exemplo
 const [consultas] = useState([
  {
    id: 1,
    data: "2024-02-01",
    hora: "14:30",
    tipo: "Avaliação Inicial",
    fisioterapeuta: "Dr. João Silva",
    local: "Clínica Central",
    status: "realizada",
    observacoes: "Paciente apresentou dor lombar. Iniciado protocolo de tratamento.",
    evolucao: "Positiva",
    proximos_passos: "Continuar com exercícios prescritos",
    modalidade: "Presencial"
  },
  {
    id: 2,
    data: "2024-02-08",
    hora: "15:00",
    tipo: "Sessão de Tratamento",
    fisioterapeuta: "Dr. João Silva",
    local: "Domicílio",
    status: "realizada",
    observacoes: "Melhora na amplitude de movimento.",
    evolucao: "Positiva",
    proximos_passos: "Aumentar intensidade dos exercícios",
    modalidade: "Domiciliar"
  },
  {
    id: 3,
    data: "2024-02-15",
    hora: "14:30",
    tipo: "Reavaliação",
    fisioterapeuta: "Dr. João Silva",
    local: "Clínica Central",
    status: "agendada",
    modalidade: "Presencial"
  },
  {
    id: 4,
    data: "2024-02-22",
    hora: "16:00",
    tipo: "Sessão de Tratamento",
    fisioterapeuta: "Dr. João Silva",
    local: "Domicílio",
    status: "agendada",
    modalidade: "Domiciliar"
  },
  {
    id: 5,
    data: "2024-01-25",
    hora: "14:30",
    tipo: "Sessão de Tratamento",
    fisioterapeuta: "Dr. João Silva",
    local: "Clínica Central",
    status: "realizada",
    observacoes: "Paciente relatou melhora significativa.",
    evolucao: "Positiva",
    proximos_passos: "Manter exercícios",
    modalidade: "Presencial"
  },
  {
    id: 6,
    data: "2024-01-18",
    hora: "15:30",
    tipo: "Sessão de Tratamento",
    fisioterapeuta: "Dr. João Silva",
    local: "Clínica Central",
    status: "realizada",
    observacoes: "Exercícios ajustados conforme evolução.",
    evolucao: "Positiva",
    proximos_passos: "Aumentar carga",
    modalidade: "Presencial"
  },
  {
    id: 7,
    data: "2024-01-11",
    hora: "14:00",
    tipo: "Sessão de Tratamento",
    fisioterapeuta: "Dr. João Silva",
    local: "Domicílio",
    status: "realizada",
    observacoes: "Início dos exercícios domiciliares.",
    evolucao: "Regular",
    proximos_passos: "Ajustar exercícios",
    modalidade: "Domiciliar"
  }
]);

 // Estados para filtros e paginação
 const [filtroStatus, setFiltroStatus] = useState("todos");
 const [filtroModalidade, setFiltroModalidade] = useState("todos");
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 3;

 // Lógica de filtragem
 const consultasFiltradas = consultas.filter(consulta => {
   const matchStatus = filtroStatus === "todos" || consulta.status === filtroStatus;
   const matchModalidade = filtroModalidade === "todos" || consulta.modalidade === filtroModalidade;
   return matchStatus && matchModalidade;
 });

 // Lógica de paginação
 const totalPages = Math.ceil(consultasFiltradas.length / itemsPerPage);
 
 const getCurrentItems = () => {
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   return consultasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
 };

 const nextPage = () => {
   if (currentPage < totalPages) {
     setCurrentPage(currentPage + 1);
   }
 };

 const prevPage = () => {
   if (currentPage > 1) {
     setCurrentPage(currentPage - 1);
   }
 };

 const goToPage = (pageNumber) => {
   setCurrentPage(pageNumber);
 };

 const pageNumbers = [];
 for (let i = 1; i <= totalPages; i++) {
   pageNumbers.push(i);
 }

 return (
   <div className="flex h-screen bg-[#f8fafc]">
     <SideBar />
     
     <div className="flex-1 overflow-auto">
       <div className="max-w-[1200px] mx-auto">
         {/* Header */}
         <div className="bg-white px-8 pt-16 pb-20 mb-8">
           <div className="w-100% mx-auto">
             <div className="flex items-center gap-3 text-purple-600 mb-3">
               <FileText size={20} />
               <span className="text-sm font-medium">Histórico</span>
             </div>
             <h1 className="text-4xl font-bold text-gray-900 mb-3">Histórico de Consultas</h1>
             <p className="text-gray-500 max-w-xl">Acompanhe todas as suas consultas e evolução do tratamento</p>
           </div>
         </div>

         <div className="-mt-24 mx-8">
           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
               <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Consultas</h3>
               <p className="text-3xl font-bold text-gray-900">{consultas.length}</p>
             </div>
             <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
               <h3 className="text-gray-500 text-sm font-medium mb-2">Realizadas</h3>
               <p className="text-3xl font-bold text-purple-600">
                 {consultas.filter(c => c.status === 'realizada').length}
               </p>
             </div>
             <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
               <h3 className="text-gray-500 text-sm font-medium mb-2">Próxima Consulta</h3>
               <p className="text-lg font-bold text-gray-900">15 Fev, 14:30</p>
             </div>
           </div>

           {/* Filtros */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
             <div className="flex items-center gap-3 mb-6">
               <Filter size={20} className="text-gray-400" />
               <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
             </div>
             <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                 <div className="relative flex-1">
                   <select 
                     value={filtroStatus}
                     onChange={(e) => {
                       setFiltroStatus(e.target.value);
                       setCurrentPage(1); // Reset para primeira página ao filtrar
                     }}
                     className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none pr-10"
                   >
                     <option value="todos">Todos os status</option>
                     <option value="realizada">Realizadas</option>
                     <option value="agendada">Agendadas</option>
                     <option value="cancelada">Canceladas</option>
                   </select>
                   <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
                 <div className="relative flex-1">
                   <select 
                     value={filtroModalidade}
                     onChange={(e) => {
                       setFiltroModalidade(e.target.value);
                       setCurrentPage(1); // Reset para primeira página ao filtrar
                     }}
                     className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none pr-10"
                   >
                     <option value="todos">Todas as modalidades</option>
                     <option value="Presencial">Presencial</option>
                     <option value="Domiciliar">Domiciliar</option>
                   </select>
                   <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
               </div>
             </div>
           </div>

           {/* Lista de Consultas */}
           <div className="space-y-6 mb-8">
             {getCurrentItems().map((consulta) => (
               <div key={consulta.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                   <div className="flex items-start gap-4">
                     <div className="flex-shrink-0">
                       <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                         <Calendar size={24} className="text-purple-600" />
                       </div>
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-gray-900 mb-1">{consulta.tipo}</h3>
                       <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                         <span className="flex items-center gap-1">
                           <Clock size={16} />
                           {new Date(consulta.data).toLocaleDateString()} às {consulta.hora}
                         </span>
                         <span className="flex items-center gap-1">
                           <MapPin size={16} />
                           {consulta.local}
                         </span>
                       </div>
                     </div>
                   </div>
                   <div className="mt-4 md:mt-0">
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                       consulta.status === 'realizada' 
                         ? 'bg-green-100 text-green-700'
                         : consulta.status === 'agendada'
                         ? 'bg-purple-100 text-purple-700'
                         : 'bg-gray-100 text-gray-700'
                     }`}>
                       {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                     </span>
                   </div>
                 </div>

                 {consulta.status === 'realizada' && (
                   <div className="border-t border-gray-100 pt-6 mt-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div>
                         <h4 className="text-sm font-medium text-gray-500 mb-2">Observações</h4>
                         <p className="text-gray-900">{consulta.observacoes}</p>
                       </div>
                       <div>
                         <h4 className="text-sm font-medium text-gray-500 mb-2">Evolução</h4>
                         <p className="text-gray-900">{consulta.evolucao}</p>
                       </div>
                       <div>
                         <h4 className="text-sm font-medium text-gray-500 mb-2">Próximos Passos</h4>
                         <p className="text-gray-900">{consulta.proximos_passos}</p>
                       </div>
                     </div>
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
                   className={`px-4 py-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium ${
                     currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                         ? 'bg-purple-600 text-white'
                         : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                     }`}
                   >
                     {number}
                   </button>
                 ))}

                 <button 
                   onClick={nextPage}
                   disabled={currentPage === totalPages}
                   className={`px-4 py-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium ${
                     currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
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
   </div>
 );
}