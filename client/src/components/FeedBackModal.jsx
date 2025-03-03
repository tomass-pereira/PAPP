import React, { useState } from "react";
import { MessageSquare, Star, Smile, Meh, Frown, X } from "lucide-react";

/**

 * @param {Object} props
 * @param {boolean} props.isOpen - Controla se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Object} props.sessao - Dados da sessão
 * @param {Function} props.onSubmit - Função chamada ao enviar o feedback
 */
const FeedbackModal = ({ isOpen, onClose, sessao, onSubmit }) => {
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState("");
  const [dor, setDor] = useState(5); // Escala de 0-10, começa no meio (5)
  const [satisfacao, setSatisfacao] = useState(""); // "bom", "neutro", "ruim"

  // Formatar data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Formatar hora para exibição
  const formatarHora = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = () => {
    onSubmit({
      sessaoId: sessao?._id,
      avaliacao,
      comentario,
      dor,
      satisfacao,
      timestamp: new Date().toISOString(),
    });
    
    // Resetar o formulário
    setAvaliacao(0);
    setComentario("");
    setDor(5);
    setSatisfacao("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Feedback da Sessão</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Detalhes da Sessão */}
          {sessao && (
            <div className="mb-5 bg-indigo-50 p-4 rounded-xl">
              <p className="text-sm text-indigo-700 mb-1">Detalhes da Sessão</p>
              <p className="font-medium">
                {formatarData(sessao.dataHoraInicio)} às{" "}
                {formatarHora(sessao.dataHoraInicio)}
              </p>
              <p className="text-sm text-gray-600">
                {sessao.tipoTerapia || "Fisioterapia"}
              </p>
            </div>
          )}

          {/* Formulário de Feedback */}
          <div className="space-y-5">
            {/* Avaliação por Estrelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Como você avalia a sessão?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    type="button"
                    onClick={() => setAvaliacao(estrela)}
                    className={`p-2 rounded-full transition-colors ${
                      avaliacao >= estrela
                        ? "text-amber-400 hover:text-amber-500"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Nível de Satisfação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Como você se sentiu após a sessão?
              </label>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setSatisfacao("bom")}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    satisfacao === "bom"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Smile className={`w-8 h-8 ${
                    satisfacao === "bom" ? "text-green-500" : ""
                  }`} />
                  <span className="text-sm mt-1">Bem</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSatisfacao("neutro")}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    satisfacao === "neutro"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Meh className={`w-8 h-8 ${
                    satisfacao === "neutro" ? "text-blue-500" : ""
                  }`} />
                  <span className="text-sm mt-1">Neutro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSatisfacao("ruim")}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    satisfacao === "ruim"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Frown className={`w-8 h-8 ${
                    satisfacao === "ruim" ? "text-red-500" : ""
                  }`} />
                  <span className="text-sm mt-1">Não muito bem</span>
                </button>
              </div>
            </div>

            {/* Nível de Dor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de dor após a sessão (0-10)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-green-600 text-sm">Sem dor</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={dor}
                  onChange={(e) => setDor(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-red-600 text-sm">Dor extrema</span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md font-bold w-8 text-center">
                  {dor}
                </span>
              </div>
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentários ou observações adicionais
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Como foi sua experiência? Houve melhora dos sintomas? Alguma sugestão?"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Pular
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1"
            disabled={!satisfacao || avaliacao === 0}
          >
            Enviar Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;