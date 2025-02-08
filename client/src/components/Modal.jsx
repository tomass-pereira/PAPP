import { forwardRef, useState } from 'react';

const Modal = forwardRef(({ event, onClose, onConfirm, page, password, onPasswordChange, passwordError, erro }, ref) => {
  const [success, setSuccess] = useState(false);
  const [motivo, setMotivo] = useState('');  // Estado para o motivo

  const handleCancel = () => {
    if (ref.current) {
      ref.current.close();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
if(erro!=''){
  window.location.href='/';

}


    if (page === 'config') {
      onConfirm();
      if (onConfirm()) {
        ref.current.close();
        window.location.reload();  // Atualiza a página após a confirmação
      }
    } else {
      onConfirm(event, motivo); 
      console.log(erro)
      window.location.reload();  // Atualiza a página após a confirmação
    }
  };

  const handleMotivoChange = (e) => {
    setMotivo(e.target.value); // Atualiza o estado com o valor do motivo
  };

  if (page === 'config') {
    return (
      <dialog id="my_modal_1" className="modal" ref={ref}>
        <div className="modal-box bg-white border border-indigo-200">
          {/* Cabeçalho com ícone */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Confirmar Senha</h3>
              <p className="text-sm text-indigo-600">Verificação de segurança</p>
            </div>
          </div>

          {/* Campo de senha */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <label className="text-sm text-gray-600 font-medium block mb-2">
                Digite sua senha para continuar
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="********"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="modal-action flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </dialog>
    );
  }

  // Modal original de reserva
  return (
    <dialog id="my_modal_1" className="modal" ref={ref}>
      <div className="modal-box bg-white border border-[#34D399]/20">
        {/* Cabeçalho com ícone */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{event?.title}</h3>
            <p className="text-sm text-[#34D399]">Vaga Disponível</p>
          </div>
        </div>
        
        {/* Informações da Sessão */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 bg-[#ECFDF5]/50 p-4 rounded-lg">
            <div className="space-y-1">
              <span className="text-sm text-gray-600 font-medium">Início</span>
              <p className="text-gray-800 font-semibold">
                {event?.start ? new Date(event.start).toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '-'}
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm text-gray-600 font-medium">Fim</span>
              <p className="text-gray-800 font-semibold">
                {event?.end ? new Date(event.end).toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '-'}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-[#ECFDF5] rounded-lg">
            <div>
              <span className="text-sm text-gray-600 font-medium">Duração</span>
              <p className="text-gray-800 font-semibold">
                {event && new Date(event.end).getTime() - new Date(event.start).getTime() > 0
                  ? Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60))
                  : '45'} minutos
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="p-4 bg-[#ECFDF5] rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Data</span>
            <p className="text-gray-800 font-semibold">
              {event?.start ? new Date(event.start).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : '-'}
            </p>
          </div>

          <div className="p-4 bg-[#ECFDF5] rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Número da sessão</span>
            <p className="text-gray-700 font-mono text-sm">
              {event?.id || '-'}
            </p>
          </div>

          <div className="p-4 bg-[#ECFDF5] rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Motivo:</span>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:[#34D399]"
              placeholder="ex: Dor de costas"
              value={motivo}
              onChange={handleMotivoChange} // Atualiza o estado com o motivo
            />
          </div>
        </div>
            
        {/* Ações */}
        <div className="modal-action flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-[#34D399] text-white hover:bg-[#34D399]/90 transition-colors"
          >
            Confirmar Vaga
          </button>
        </div>
      </div>
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;
