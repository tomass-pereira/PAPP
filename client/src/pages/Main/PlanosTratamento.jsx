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
  X
} from "lucide-react";
import { useUser } from "../../contexts/UserContext.jsX";

export default function PlanosTratamento() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { 
    planos, 
    fetchPlanos, 
    loading, 
    error, 
    selectPlano, 
    currentPlano,
    calcularProgressoPlano 
  } = usePlanos();
  
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");

  // Verificar token e carregar planos
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/LoginPage");
      return;
    }
    
    const carregarPlanos = async () => {
      try {
        console.log('Buscando planos para utente ID:', userId);
        const resultado = await fetchPlanos(userId);
        console.log('Planos carregados:', resultado);
        console.log('Estado planos no context:', planos);
        console.log('Estado loading:', loading);
        console.log('Estado error:', error);
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
      }
    };
    
    if (userId) {
      carregarPlanos();
    }
  }, []); // Dependências mínimas para evitar loops

  // Filtrar planos de tratamento
  const planosFiltrados = planos.filter(plano => {
    const matchStatus = filtroStatus === "todos" || plano.status === filtroStatus;
    const matchPesquisa = 
      plano.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) || 
      (plano.fisioterapeuta?.nome || "").toLowerCase().includes(pesquisa.toLowerCase()) ||
      (plano.tipotratamento || "").toLowerCase().includes(pesquisa.toLowerCase());
    
    return matchStatus && matchPesquisa;
  });

  const getTratamentoPorId = (id) => {
    return planos.find(plano => plano._id === id);
  };

  const abrirDetalhesTratamento = (id) => {
    const plano = getTratamentoPorId(id);
    setPlanoSelecionado(plano);
    selectPlano(id); // Atualiza o currentPlano no contexto
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fecharDetalhesTratamento = () => {
    setPlanoSelecionado(null);
    selectPlano(null);
  };

  // Formatar data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatar hora para exibição
  const formatarHora = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar se a data é hoje
  const isHoje = (dataString) => {
    if (!dataString) return false;
    const data = new Date(dataString);
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
  };

  // Calcular dias restantes
  const calcularDiasRestantes = (dataFinal) => {
    if (!dataFinal) return 0;
    const hoje = new Date();
    const dataFim = new Date(dataFinal);
    const diffTempo = dataFim - hoje;
    return Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
  };
  
  // Encontrar próxima sessão
  const encontrarProximaSessao = (sessoes) => {
    if (!sessoes || sessoes.length === 0) return null;
    
    const hoje = new Date();
    return sessoes
      .filter(s => s.status !== 'Realizada' && new Date(s.dataHoraInicio) >= hoje)
      .sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio))[0];
  };

  // Verificar estado da página
  if (loading) {
    return (
      <div className="flex h-screen bg-[#f8fafc]">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando planos de tratamento...</p>
          </div>
        </div>
      </div>
    );
  }

 

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
                <span className="text-sm font-medium">Reabilitação Personalizada</span>
              </div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-3">
                Planos de Tratamento
              </h1>
              <p className="text-gray-600 max-w-xl">
                Acompanhe seus planos de tratamento personalizados, progresso e próximas sessões agendadas.
              </p>
            </div>
          </div>

          <div className="-mt-24 mx-8">
            {planoSelecionado ? (
              /* Detalhes do Plano de Tratamento Selecionado */
              <div className="mb-8">
                <button 
                  onClick={fecharDetalhesTratamento}
                  className="flex items-center text-indigo-600 font-medium mb-4 hover:underline"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
                  Voltar para todos os planos
                </button>

                {/* Cabeçalho do Plano */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{planoSelecionado.titulo}</h2>
                        <p className="opacity-90 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatarData(planoSelecionado.dataInicio)} - {formatarData(planoSelecionado.dataFim)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                        <span className="font-medium">{planoSelecionado.status}</span>
                        {planoSelecionado.status === "Em Andamento" && (
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sobre este Plano</h3>
                        <p className="text-gray-600 mb-4">{planoSelecionado.detalhes}</p>
                        
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <Award className="w-4 h-4 text-indigo-500 mr-2" />
                          Objetivos do Tratamento
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                          {planoSelecionado.objetivos?.map((objetivo, idx) => (
                            <li key={idx}>{objetivo}</li>
                          )) || <li>Não existem objetivos definidos</li>}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-indigo-50 p-4 rounded-xl">
                          <h4 className="font-medium text-indigo-800 mb-2">Informações do Tratamento</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-indigo-600 mb-1">Fisioterapeuta</p>
                              <p className="font-medium text-gray-800">
                                Mariana Tavares
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-indigo-600 mb-1">Tipo de Tratamento</p>
                              <p className="font-medium text-gray-800">{planoSelecionado.tipotratamento || 'Não definido'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-indigo-600 mb-1">Duração</p>
                              <p className="font-medium text-gray-800">
                                {planoSelecionado.duracao?.valor || '?'} {planoSelecionado.duracao?.unidade || 'semanas'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-indigo-600 mb-1">Dias Restantes</p>
                              <p className="font-medium text-gray-800">
                                {calcularDiasRestantes(planoSelecionado.dataFim)} dias
                              </p>
                            </div>
                          </div>
                        </div>

                        {planoSelecionado.proximaSessao && (
                          <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Próxima Sessão
                            </h4>
                            <p className="text-blue-800 font-medium">
                              {formatarData(planoSelecionado.proximaSessao)} às {formatarHora(planoSelecionado.proximaSessao)}
                            </p>
                            {isHoje(planoSelecionado.proximaSessao) && (
                              <p className="mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                                Hoje!
                              </p>
                            )}
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                            <Activity className="w-4 h-4 text-indigo-500 mr-2" />
                            Progresso
                          </h4>
                          {planoSelecionado.sessoes?.length > 0 ? (
                            <>
                              <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Sessões realizadas</span>
                                  <span className="font-medium">
                                    {planoSelecionado.sessoes.filter(s => s.status === 'concluida').length} de {planoSelecionado.sessoes.length}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ 
                                      width: `${(planoSelecionado.sessoes.filter(s => s.status === 'concluida').length / planoSelecionado.sessoes.length) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progresso geral</span>
                                  <span className="font-medium">
                                    {calcularProgressoPlano(planoSelecionado).percentualConcluido}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ 
                                      width: `${calcularProgressoPlano(planoSelecionado).percentualConcluido}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500 text-sm">Não há sessões registradas para este plano.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sessões do Plano */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cronograma de Sessões</h3>
                      {planoSelecionado.sessoes?.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl p-4 overflow-hidden">
                          <div className="space-y-3">
                            {planoSelecionado.sessoes.map((sessao, idx) => (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-lg ${
                                  sessao.status === 'Realizada' 
                                    ? 'bg-green-50 border border-green-100' 
                                    : isHoje(sessao.dataHoraInicio)
                                      ? 'bg-amber-50 border border-amber-100'
                                      : 'bg-white border border-gray-100'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-full flex-shrink-0 ${
                                      sessao.status === 'Realizada' 
                                        ? 'bg-green-100' 
                                        : isHoje(sessao.dataHoraInicio)
                                          ? 'bg-amber-100'
                                          : 'bg-indigo-100'
                                    }`}>
                                      {sessao.status === 'Realizada' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <Clock className={`w-5 h-5 ${
                                          isHoje(sessao.dataHoraInicio) ? 'text-amber-600' : 'text-indigo-600'
                                        }`} />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-gray-800">
                                          {formatarData(sessao.dataHoraInicio)}
                                        </p>
                                        <span className="text-sm text-gray-500">
                                          {formatarHora(sessao.dataHoraInicio)}
                                        </span>
                                        {isHoje(sessao.dataHoraInicio) && sessao.status !== 'Realizada' && (
                                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                            Hoje
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {sessao.descricao || 'Sem descrição'}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      sessao.status === 'Realizada' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {sessao.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-xl text-center">
                          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Não há sessões agendadas para este plano.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              /* Lista de Planos */
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Planos</h3>
                    <p className="text-3xl font-bold text-gray-900">{planos.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Em Andamento</h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {planos.filter(p => p.status === "Em Andamento").length}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Próximas Sessões</h3>
                    <p className="text-3xl font-bold text-amber-600">
                      {planos.filter(p => p.proximaSessao).length}
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
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                      >
                        <option value="todos">Todos os status</option>
                        <option value="Em Andamento">Em andamento</option>
                        <option value="Agendado">Agendados</option>
                        <option value="Concluído">Concluídos</option>
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
                        placeholder="Pesquisar por título, fisioterapeuta ou tipo..." 
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
                </div>

                {/* Lista de Planos */}
                <div className="space-y-6 mb-8">
                  {planosFiltrados.length > 0 ? (
                    planosFiltrados.map((plano) => {
                      const progresso = calcularProgressoPlano(plano);
                      console.log("olha aqui o plano", plano);
                      console.log("Progresso do plano", progresso);
                      
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
                                        Fisioterapeuta: {plano.fisioterapeuta?.nome || 'Não definido'}
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

                            {/* Footer do Card */}
                            <div className="mt-5 flex flex-col float-right mb-3 sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
                              
                              
                              <button
                                onClick={() => abrirDetalhesTratamento(plano._id)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex  transition-colors"
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
                    
                      {(filtroStatus !== "todos" || pesquisa !== "") && (
                        <button
                          onClick={() => {
                            setFiltroStatus("todos");
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}