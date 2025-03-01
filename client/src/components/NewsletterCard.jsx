import React from "react";
import { Clock, Star, User, ArrowRight } from "lucide-react";

const NewsletterCard = ({ artigo }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full transition-all hover:shadow-md">
      {/* Imagem do artigo com fallback */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {artigo.imagem ? (
          <img 
            src={artigo.imagem} 
            alt={artigo.titulo} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/api/placeholder/400/320";
            }}
          />
        ) : (
          <img src="/api/placeholder/400/320" alt="Placeholder" className="w-full h-full object-cover" />
        )}
        
        {/* Badge de destaque */}
        {artigo.destaque && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Star size={12} />
              <span>Destaque</span>
            </div>
          </div>
        )}
        
        {/* Badge de categoria */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/80 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
            {artigo.categoria}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{artigo.titulo}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{artigo.resumo}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <User size={14} />
              <span>{artigo.autor}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock size={14} />
                <span>{artigo.tempoLeitura}</span>
              </div>
              <div className="text-gray-400 text-xs">•</div>
              <div className="text-gray-500 text-xs">{formatarData(artigo.dataPublicacao)}</div>
            </div>
          </div>
          
          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-colors">
            Ler artigo
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;