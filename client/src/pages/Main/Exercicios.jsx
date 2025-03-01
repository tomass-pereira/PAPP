import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import NewsletterCard from "../../components/NewsletterCard";
import { Search, Filter, ChevronDown, Newspaper, BookOpen } from "lucide-react";

export default function Newsletter() {
  const [artigos] = useState([
    {
      id: 1,
      titulo: "Benefícios da Terapia Manual para Dores Crônicas",
      resumo: "Descubra como técnicas de terapia manual podem reduzir significativamente dores crônicas em diversas partes do corpo.",
      categoria: "Terapia Manual",
      autor: "Dra. Amanda Silva",
      tempoLeitura: "5 minutos",
      dataPublicacao: "2024-02-28",
      destaque: true,
      imagem: "/images/terapia-manual.jpg"
    },
    {
      id: 2,
      titulo: "Exercícios de Respiração para Melhorar a Recuperação Pós-Covid",
      resumo: "Um guia completo com técnicas respiratórias recomendadas para pacientes em recuperação da Covid-19.",
      categoria: "Respiratória",
      autor: "Dr. Ricardo Mendes",
      tempoLeitura: "8 minutos",
      dataPublicacao: "2024-02-24",
      destaque: false,
      imagem: "/images/respiracao.jpg"
    },
    {
      id: 3,
      titulo: "Novidades em Tecnologia para Reabilitação Neurológica",
      resumo: "Conheça os dispositivos e softwares mais recentes que estão revolucionando a reabilitação de pacientes com condições neurológicas.",
      categoria: "Tecnologia",
      autor: "Dra. Carolina Ferreira",
      tempoLeitura: "7 minutos",
      dataPublicacao: "2024-02-20",
      destaque: true,
      imagem: "/images/neuro-tech.jpg"
    },
    {
      id: 4,
      titulo: "A Importância da Postura no Home Office",
      resumo: "Dicas práticas para manter uma boa postura durante o trabalho remoto e prevenir lesões musculoesqueléticas.",
      categoria: "Ergonomia",
      autor: "Dr. Paulo Santos",
      tempoLeitura: "4 minutos",
      dataPublicacao: "2024-02-16",
      destaque: false,
      imagem: "/images/postura.jpg"
    },
    {
      id: 5,
      titulo: "Pilates na Reabilitação Esportiva: Estudos de Caso",
      resumo: "Análise de casos reais onde o Pilates foi determinante na recuperação de atletas com diferentes tipos de lesões.",
      categoria: "Esportiva",
      autor: "Dra. Juliana Costa",
      tempoLeitura: "10 minutos",
      dataPublicacao: "2024-02-12",
      destaque: true,
      imagem: "/images/pilates.jpg"
    },
    {
      id: 6,
      titulo: "Mitos e Verdades sobre Dor Lombar",
      resumo: "Esclarecemos as principais dúvidas e concepções errôneas sobre causas e tratamentos para dor na região lombar.",
      categoria: "Educativa",
      autor: "Dr. Marcelo Alves",
      tempoLeitura: "6 minutos",
      dataPublicacao: "2024-02-08",
      destaque: false,
      imagem: "/images/lombar.jpg"
    }
  ]);

  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroDestaque, setFiltroDestaque] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");

  const artigosFiltrados = artigos.filter(artigo => {
    const matchCategoria = filtroCategoria === "todas" || artigo.categoria === filtroCategoria;
    const matchDestaque = filtroDestaque === "todos" || 
                        (filtroDestaque === "destaque" && artigo.destaque) || 
                        (filtroDestaque === "regular" && !artigo.destaque);
    const matchPesquisa = artigo.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || 
                        artigo.resumo.toLowerCase().includes(pesquisa.toLowerCase());
    
    return matchCategoria && matchDestaque && matchPesquisa;
  });

  // Cálculo de estatísticas
  const totalArtigos = artigos.length;
  const artigosDestaque = artigos.filter(artigo => artigo.destaque).length;
  const novosMes = artigos.filter(artigo => {
    const dataArtigo = new Date(artigo.dataPublicacao);
    const hoje = new Date();
    return dataArtigo.getMonth() === hoje.getMonth() && dataArtigo.getFullYear() === hoje.getFullYear();
  }).length;

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SideBar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Header com design moderno */}
          <div className="bg-white px-8 pt-16 pb-20 mb-8">
            <div className="w-100% mx-auto">
              <div className="flex items-center gap-3 text-indigo-600 mb-3">
                <Newspaper size={20} />
                <span className="text-sm text-indigo-600 font-medium">Boletim Informativo</span>
              </div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-3">Newsletter de Fisioterapia</h1>
              <p className="text-gray-600 max-w-xl">Mantenha-se atualizado com as últimas novidades, pesquisas e curiosidades do mundo da fisioterapia.</p>
            </div>
          </div>
          
          <div className="-mt-24 mx-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Artigos</h3>
                <p className="text-3xl font-bold text-gray-900">{totalArtigos}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Artigos em Destaque</h3>
                <p className="text-3xl font-bold text-purple-600">{artigosDestaque}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Novos Neste Mês</h3>
                <p className="text-3xl font-bold text-blue-600">{novosMes}</p>
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
                      <option value="todas">Todas as categorias</option>
                      <option value="Terapia Manual">Terapia Manual</option>
                      <option value="Respiratória">Respiratória</option>
                      <option value="Tecnologia">Tecnologia</option>
                      <option value="Ergonomia">Ergonomia</option>
                      <option value="Esportiva">Esportiva</option>
                      <option value="Educativa">Educativa</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select 
                      value={filtroDestaque}
                      onChange={(e) => setFiltroDestaque(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                    >
                      <option value="todos">Todos os artigos</option>
                      <option value="destaque">Artigos em destaque</option>
                      <option value="regular">Artigos regulares</option>
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
                    placeholder="Pesquisar artigos..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Lista de Artigos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {artigosFiltrados.length > 0 ? (
                artigosFiltrados.map((artigo) => (
                  <NewsletterCard 
                    key={artigo.id} 
                    artigo={artigo}
                  />
                ))
              ) : (
                <div className="col-span-3 py-16 flex flex-col items-center justify-center text-center">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-gray-500">Tente ajustar seus filtros ou termos de pesquisa.</p>
                </div>
              )}
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