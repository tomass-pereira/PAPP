import React from 'react';

const SessionModal = ({
  modalRef,
  selectedEvent,
  handleClose,
  handleCancelar,
  handleConfirm,
  showCancelDialog,
  setShowCancelDialog,
  motivoCancelamento,
  setMotivoCancelamento,
  erroCancelamento,
  erro,
  motivo,
  setMotivo,
  confirmarCancelamento,
  isFisio, // Added isFisio prop
  handleDelete // New prop for delete functionality
}) => {
  const sessao = selectedEvent?.sessaoCompleta;
  const reservada = sessao?.status === "reservada";
  const concluida = sessao?.status === "concluida";
  const disponivel = !reservada && !concluida;

  const getModalStyle = () => {
    if (concluida) {
      return {
        border: 'border-sky-200',
        bg: 'bg-sky-50',
        iconBg: 'bg-sky-100',
        text: 'text-sky-600'
      };
    }
    if (reservada) {
      return {
        border: 'border-indigo-200',
        bg: 'bg-indigo-50',
        iconBg: 'bg-indigo-100',
        text: 'text-indigo-600'
      };
    }
    return {
      border: 'border-[#34D399]/20',
      bg: 'bg-[#ECFDF5]',
      iconBg: 'bg-[#ECFDF5]',
      text: 'text-[#34D399]'
    };
  };

  const styles = getModalStyle();

  // Get user name if available (for reserved or completed sessions)
  const utenteNome = sessao?.utenteId?.nome || 'Utente';

  return (
    <dialog id="my_modal_1" className="modal" ref={modalRef}>
      <div className={`modal-box bg-white border ${styles.border}`}>
        {/* Cabeçalho com ícone */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" 
                 className={`h-6 w-6 ${styles.text}`} 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{selectedEvent?.title}</h3>
            <p className={`text-sm ${styles.text}`}>
              {concluida ? 'Sessão Concluída' : reservada ? 'Detalhes da Sessão' : 'Vaga Disponível'}
            </p>
          </div>
        </div>

        {/* User Profile Section - Only for physio when session is reserved or completed */}
        {isFisio && (reservada || concluida) && (
          <div className={`p-4 ${styles.bg} rounded-lg mb-4`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow">
              {/* User profile photo placeholder - replace with actual image if available */}
              {sessao?.utenteId?.profileImage ? (
                <img 
                  src={sessao.utenteId.profileImage} 
                  alt={`Foto de ${utenteNome}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-md font-semibold text-gray-800">{utenteNome}</h4>
              <p className="text-sm text-gray-600">
                {sessao?.utenteId?.telefone || 'Sem telefone'}
              </p>
              <p className="text-sm text-gray-600">
                {sessao?.utenteId?.email || 'Sem email'}
              </p>
              
              {/* Informações de deslocamento */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {sessao?.utenteId?.morada?.distancia 
                      ? `${sessao.utenteId.morada.distancia.quilometros} km`
                      : 'Distância não disponível'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {sessao?.utenteId?.morada?.duracao
                      ? `${sessao.utenteId.morada.duracao.minutos} minutos de viagem`
                      : 'Tempo de viagem não disponível'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Informações da Sessão */}
        <div className="space-y-4 mb-6">
          <div className={`grid grid-cols-2 gap-4 ${styles.bg} p-4 rounded-lg`}>
            <div className="space-y-1">
              <span className="text-sm text-gray-600 font-medium">Início</span>
              <p className="text-gray-800 font-semibold">
                {sessao?.dataHoraInicio ? new Date(sessao.dataHoraInicio).toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '-'}
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm text-gray-600 font-medium">Fim</span>
              <p className="text-gray-800 font-semibold">
                {sessao?.dataHoraFim ? new Date(sessao.dataHoraFim).toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '-'}
              </p>
            </div>
          </div>

          <div className={`flex justify-between items-center p-4 ${styles.bg} rounded-lg`}>
            <div>
              <span className="text-sm text-gray-600 font-medium">Duração</span>
              <p className="text-gray-800 font-semibold">
                {sessao ? 
                  Math.round((new Date(sessao.dataHoraFim) - new Date(sessao.dataHoraInicio)) / (1000 * 60)) 
                  : '45'} minutos
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${styles.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className={`p-4 ${styles.bg} rounded-lg`}>
            <span className="text-sm text-gray-600 font-medium">Data</span>
            <p className="text-gray-800 font-semibold">
              {sessao?.dataHoraInicio ? new Date(sessao.dataHoraInicio).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : '-'}
            </p>
          </div>
          {!isFisio && (


          <div className={`p-4 ${styles.bg} rounded-lg`}>
            <span className="text-sm text-gray-600 font-medium">Motivo:</span>
            {reservada || concluida ? (
              <input
                type="text"
                className="w-full px-3 py-2"
                placeholder="ex: Dor de costas"
                value={selectedEvent?.description || ''}
                disabled={true}
              />
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399]"
                placeholder="ex: Dor de costas"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            )}
          </div>
        )}
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{erro}</p>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="modal-action flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={() => {
              modalRef.current?.close();
              handleClose();
            }}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {reservada || concluida ? 'Fechar' : 'Cancelar'}
          </button>
          
          {/* Delete button for Physio and available sessions */}
          {isFisio && disponivel && (
            <button 
              onClick={() => handleDelete && handleDelete(selectedEvent)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Eliminar Sessão
            </button>
          )}
          
          {/* Cancel session button for reserved and not completed sessions */}
          {reservada && !concluida && (
            <button 
              onClick={() => handleCancelar(selectedEvent)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Cancelar Sessão
            </button>
          )}
          
          {/* Confirm button for available sessions */}
          {disponivel && !isFisio && (
            <button 
              onClick={() => handleConfirm(selectedEvent)}
              className="px-4 py-2 rounded-lg bg-[#34D399] text-white hover:bg-[#34D399]/90 transition-colors"
            >
              Confirmar Vaga
            </button>
          )}
        </div>

        {/* Dialog de Cancelamento */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className={`
              bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl
              transition-all duration-300 ease-in-out
              ${showCancelDialog ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancelar Sessão
                </h3>
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Tem a certeza que pretende cancelar esta sessão?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo do Cancelamento *
                </label>
                <input
                  type="text"
                  value={motivoCancelamento}
                  onChange={(e) => {
                    setMotivoCancelamento(e.target.value);
                    if (erroCancelamento) setErroCancelamento('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite o motivo do cancelamento"
                  rows="3"
                />
                {erroCancelamento && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 font-medium">{erroCancelamento}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarCancelamento}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default SessionModal;