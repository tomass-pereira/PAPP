import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import ExercicioCard from "../../components/ExercicioCard";
import { Search, Filter, ChevronDown, DumbbellIcon } from "lucide-react";
export default function Exercicios() {
  const [exercicios] = useState([
    {
      id: 1,
      nome: "Alongamento da Coluna",
      descricao: "Alongamento suave para melhorar a flexibilidade da coluna.",
      series: 3,
      repeticoes: 10,
      duracao: "30 segundos",
      status: "pendente",
      categoria: "Alongamento",
      ultimaAtualizacao: "2024-02-04"
    },
    {
      id: 2,
      nome: "Fortalecimento do Joelho",
      descricao: "Exercício de fortalecimento para estabilidade do joelho.",
      series: 4,
      repeticoes: 15,
      duracao: "45 segundos",
      status: "completo",
      categoria: "Fortalecimento",
      ultimaAtualizacao: "2024-02-04"
    },
    {
      id: 3,
      nome: "Mobilidade do Ombro",
      descricao: "Movimentos para melhorar a amplitude do ombro.",
      series: 3,
      repeticoes: 12,
      duracao: "40 segundos",
      status: "pendente",
      categoria: "Mobilidade",
      ultimaAtualizacao: "2024-02-04"
    }
  ]);

  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");

  const exerciciosFiltrados = exercicios.filter(exercicio => {
    const matchCategoria = filtroCategoria === "todos" || exercicio.categoria === filtroCategoria;
    const matchStatus = filtroStatus === "todos" || exercicio.status === filtroStatus;
    const matchPesquisa = exercicio.nome.toLowerCase().includes(pesquisa.toLowerCase());
    
    return matchCategoria && matchStatus && matchPesquisa;
  });

  return (
    
    <div className="flex h-screen bg-[#f8fafc]">
    <SideBar />
    
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto">
        {/* Header com design mais moderno */}
        <div className="bg-white px-8 pt-16 pb-20 mb-8">
          <div className="w-100% mx-auto">
            <div className="flex items-center gap-3 text-indigo-600 mb-3">
              <DumbbellIcon size={20}  />
              <span className="text-sm text-indigo-600 font-medium">Exercícios Prescritos</span>
            </div>
            <h1 className="text-4xl font-bold text-indigo-600 mb-3">Meus Exercícios</h1>
            <p className="text-gray-600 max-w-xl">Acompanhe seus exercícios prescritos, marque os realizados e mantenha-se no caminho da sua recuperação.</p>
          </div>
        </div>
        
        <div className="-mt-24 mx-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Exercícios</h3>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Exercícios Completos</h3>
              <p className="text-3xl font-bold text-green-600">8</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Em Andamento</h3>
              <p className="text-3xl font-bold text-amber-600">4</p>
            </div>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Filter size={20} className="text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                <div className="relative flex-1">
                  <select 
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                  >
                    <option value="todos">Todas as categorias</option>
                    <option value="Alongamento">Alongamento</option>
                    <option value="Fortalecimento">Fortalecimento</option>
                    <option value="Mobilidade">Mobilidade</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <select 
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="completo">Completo</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="search" 
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar exercícios..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Lista de Exercícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {exerciciosFiltrados.map((exercicio) => (
              <ExercicioCard 
                key={exercicio.id} 
                exercicio={exercicio}
              />
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center pb-8">
            <nav className="flex gap-1 bg-white px-1 py-1 rounded-xl shadow-sm border border-gray-100">
              <button className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                Anterior
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
                1
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                2
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                3
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
    );

}