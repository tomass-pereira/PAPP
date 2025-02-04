import React from "react";
import { Play, Info, Clock, Repeat, BarChart3 } from "lucide-react";


export default function ExercicioCard({ exercicio }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {exercicio.nome}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            exercicio.status === 'completo' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {exercicio.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {exercicio.descricao}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <BarChart3 size={16} />
              <span>Séries</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{exercicio.series}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Repeat size={16} />
              <span>Repetições</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{exercicio.repeticoes}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
          <Clock size={16} />
          <span>Duração: <span className="font-medium text-gray-900">{exercicio.duracao}</span></span>
        </div>
      </div>

      <div className="flex border-t border-gray-100">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-bl-2xl">
          <Info size={18} />
          <span>Detalhes</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium rounded-br-2xl">
          <Play size={18} />
          <span>Iniciar</span>
        </button>
      </div>
    </div>
  );
}