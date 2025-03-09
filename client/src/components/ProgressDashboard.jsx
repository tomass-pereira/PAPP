import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const ProgressDashboard = ({ isFisio = false }) => {

  const sessoesPorMes = [
    { nome: 'Jan', quantidade: 4 },
    { nome: 'Fev', quantidade: 6 },
    { nome: 'Mar', quantidade: 8 },
    { nome: 'Abr', quantidade: 7 },
    { nome: 'Mai', quantidade: 9 },
    { nome: 'Jun', quantidade: 5 },
    { nome: 'Ago', quantidade: 25 }

  ];
  
  const dadosProgresso = [
    { semana: 'Semana 1', nivelDor: 8, mobilidade: 3 },
    { semana: 'Semana 2', nivelDor: 7, mobilidade: 4 },
    { semana: 'Semana 3', nivelDor: 6, mobilidade: 5 },
    { semana: 'Semana 4', nivelDor: 5, mobilidade: 6 },
    { semana: 'Semana 5', nivelDor: 4, mobilidade: 7 },
    { semana: 'Semana 6', nivelDor: 3, mobilidade: 8 },
  ];
  
  const statusSessoes = [
    { nome: 'Realizadas', valor: 18 },
    { nome: 'Canceladas', valor: 3 },
    { nome: 'Agendadas', valor: 4 },
  ];

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const dadosHorarios = [
    { horario: '8-10h', quantidade: 8 },
    { horario: '10-12h', quantidade: 12 },
    { horario: '12-14h', quantidade: 6 },
    { horario: '14-16h', quantidade: 10 },
    { horario: '16-18h', quantidade: 15 },
    { horario: '18-20h', quantidade: 9 },
  ];

  // Estado para alternar entre visualizações de gráficos
  const [activeTab, setActiveTab] = useState('progresso');

  // Renderização condicional baseada na tab ativa
  const renderGrafico = () => {
    switch(activeTab) {
      case 'progresso':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              {isFisio ? 'Progresso dos Pacientes' : 'Meu Progresso'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isFisio 
                ? 'Evolução média do nível de dor e mobilidade dos pacientes' 
                : 'Evolução do seu nível de dor e mobilidade ao longo do tratamento'
              }
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosProgresso} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis  />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="nivelDor" 
                  name="Nível de Dor" 
                  stroke="#ff6b6b" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="mobilidade" 
                  name="Mobilidade" 
                  stroke="#4dabf7" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'sessoes':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              {isFisio ? 'Sessões Realizadas' : 'Minhas Sessões'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Distribuição mensal de sessões
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessoesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} sessões`, 'Quantidade']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill={isFisio ? "#38b2ac" : "#4c6ef5"} 
                  name="Sessões" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total de Sessões</p>
                  <p className="text-2xl font-bold text-gray-800">39</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Média Mensal</p>
                  <p className="text-2xl font-bold text-gray-800">6.5</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'status':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Status das Sessões</h3>
            <p className="text-sm text-gray-500 mb-4">
              Distribuição por status
            </p>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusSessoes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="valor"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusSessoes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sessões`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-3">
                  {statusSessoes.map((status, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 mr-2" style={{ backgroundColor: CORES[index % CORES.length] }}></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-gray-700">{status.nome}</span>
                        <span className="text-sm font-medium">{status.valor}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Total</span>
                    <span className="text-sm font-medium">
                      {statusSessoes.reduce((acc, curr) => acc + curr.valor, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'horarios':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Horário</h3>
            <p className="text-sm text-gray-500 mb-4">
              Preferências de horários para sessões
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosHorarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="horario" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="quantidade" 
                  fill={isFisio ? "rgba(56, 178, 172, 0.2)" : "rgba(76, 110, 245, 0.2)"} 
                  stroke={isFisio ? "#38b2ac" : "#4c6ef5"} 
                  name="Sessões"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Horário mais popular</p>
                <p className="text-xl font-bold text-gray-800">16-18h</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Horário menos popular</p>
                <p className="text-xl font-bold text-gray-800">12-14h</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Selecione um tipo de gráfico</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow mb-8">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {isFisio ? 'Monitorização' : 'O meu Progresso'}
        </h2>
        <p className="text-sm text-gray-500">
          {isFisio 
            ? 'Acompanhamento de métricas e desempenho dos atendimentos' 
            : 'Acompanhamento do seu progresso e histórico de sessões'
          }
        </p>
      </div>
      
      {/* Tabs para navegação entre gráficos */}
      <div className="flex overflow-x-auto space-x-1 p-2 border-b">
        <button 
          onClick={() => setActiveTab('progresso')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'progresso' 
              ? `${isFisio ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Progresso
        </button>
        <button 
          onClick={() => setActiveTab('sessoes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'sessoes' 
              ? `${isFisio ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sessões por Mês
        </button>
        <button 
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'status' 
              ? `${isFisio ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Status
        </button>
        <button 
          onClick={() => setActiveTab('horarios')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'horarios' 
              ? `${isFisio ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Horários
        </button>
      </div>
      
      {/* Conteúdo do gráfico selecionado */}
      <div className="p-4">
        {renderGrafico()}
      </div>
    </div>
  );
};

export default ProgressDashboard;