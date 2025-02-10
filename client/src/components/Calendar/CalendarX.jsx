import { useState, useRef, useEffect } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import {
  createViewMonthGrid,
  createViewWeek,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "@sx-premium/interactive-event-modal/index.css";
import { useSessoes } from "../../contexts/SessoesContext.jsx";
import "@sx-premium/drag-to-create/index.css";
import Modal from "../Modal";
import { v4 as uuidv4 } from "uuid";
import "./Calendar.css";
import { reservarSessao, cancelarSessao } from "../../api/sessoes.js";

function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const { sessoes } = useSessoes();
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const utenteId = sessionStorage.getItem("utenteId");
  const [erro, setErro] = useState('');
  const [motivo, setMotivo]=useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [sessaoParaCancelar, setSessaoParaCancelar] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [erroCancelamento, setErroCancelamento] = useState('');
 
  const handleCancelar = async (event) => {
    setSessaoParaCancelar(event);
    setShowCancelDialog(true);
  };
 
  const confirmarCancelamento = async () => {
   if(motivoCancelamento!=''){
    try {
      await cancelarSessao(sessaoParaCancelar.id, motivoCancelamento);
      setShowCancelDialog(false);
      window.location.reload();
      console.log(motivoCancelamento);
    } catch (error) {
      setErro(error.message);
    }
   }
   else{
    setErroCancelamento("Digite o motivo do cancelamento");
   }
  };
 
  const handleConfirm = async (event) => {
   if(motivo!=""){

    try {
      
      console.log('aqui');
      const sessaoReservada = await reservarSessao(event.id, utenteId, motivo);
      
      setErro('');
      window.location.reload();
      // Aqui você pode atualizar a UI, mostrar uma mensagem de sucesso, etc.
    } catch (error) {
      setErro(error.message);
    }
   }
   else{
    setErro('Digite o motivo da sessão');
   }



  };

  useEffect(() => {
    if (sessoes && sessoes.length > 0) {
      const currentEvents = eventsService.getAll();
      currentEvents.forEach((event) => eventsService.remove(event.id));

      // Adiciona cada sessão como um evento separado
      sessoes.map((sessao) => {
        eventsService.add({
          id: sessao._id,
          title: sessao.status === "reservada" ? "Sessão Reservada" : "Sessão disponível",
          start: sessao.dataHoraInicio.replace("T", " ").slice(0, 16),
          end: sessao.dataHoraFim.replace("T", " ").slice(0, 16),
          description:sessao.motivo,
          calendarId: sessao.status === "reservada" ? null : "disponivel",
        });
      });

      console.log("Eventos após atualização:", eventsService.getAll());
    }
  }, [sessoes]);

  const handleClose = () => {
    setSelectedEvent(null);
    setMotivo('');
    setErro('');
  };

  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewWeek(), createViewMonthAgenda()],
    calendars: {
      disponivel: {
        colorName: "disponivel",
        lightColors: {
          main: "#34D399",
          container: "#ECFDF5",
          onContainer: "#065F46",
        },
      },
    },
    defaultView: "month",
    dayBoundaries: {
      start: "10:00",
      end: "19:00",
    },
    plugins: [eventsService],
    callbacks: {
      onEventClick(calendarEvent) {
        console.log("onEventClick", calendarEvent);
        setSelectedEvent(calendarEvent);
        modalRef.current?.showModal();
      },
    },
    locale: "pt-BR",
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      
      {selectedEvent?.title === "Sessão Reservada" ? (
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box bg-white border border-indigo-200">
            {/* Cabeçalho com ícone */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">{selectedEvent?.title}</h3>
                <p className="text-sm text-indigo-600">Detalhes da Sessão</p>
              </div>
            </div>
  
            {/* Informações da Sessão */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-lg">
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 font-medium">Início</span>
                  <p className="text-gray-800 font-semibold">
                    {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : '-'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 font-medium">Fim</span>
                  <p className="text-gray-800 font-semibold">
                    {selectedEvent?.end ? new Date(selectedEvent.end).toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : '-'}
                  </p>
                </div>
              </div>
  
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600 font-medium">Duração</span>
                  <p className="text-gray-800 font-semibold">
                    {selectedEvent && new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime() > 0
                      ? Math.round((new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime()) / (1000 * 60))
                      : '45'} minutos
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
  
              <div className="p-4 bg-indigo-50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Data</span>
                <p className="text-gray-800 font-semibold">
                  {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : '-'}
                </p>
              </div>
  
              <div className="p-4 bg-indigo-50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Número da sessão</span>
                <p className="text-gray-700 font-mono text-sm">
                  {selectedEvent?.id || '-'}
                </p>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Motivo:</span>
                <input
                  type="text"
                  className="w-full px-3 py-2"
                  placeholder="ex: Dor de costas"
                  value={selectedEvent?.description}
                  disabled={true}
                 
                />
              </div>
              
            </div>
  
            {/* Ações */}
            <div className="modal-action flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  modalRef.current?.close();
                  handleClose();
                }}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={() => handleCancelar(selectedEvent)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Cancelar Sessão
              </button>
            </div>
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
                  <p className="text-red-700 font-medium">{erro}</p>
                </div>
              </div>
            )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCancelDialog(false)       }
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
        
      ) : (
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box bg-white border border-[#34D399]/20">
            {/* Cabeçalho com ícone */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">{selectedEvent?.title}</h3>
                <p className="text-sm text-[#34D399]">Vaga Disponível</p>
              </div>
            </div>
  
            {/* Informações da Sessão */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 bg-[#ECFDF5]/50 p-4 rounded-lg">
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 font-medium">Início</span>
                  <p className="text-gray-800 font-semibold">
                    {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : '-'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 font-medium">Fim</span>
                  <p className="text-gray-800 font-semibold">
                    {selectedEvent?.end ? new Date(selectedEvent.end).toLocaleTimeString('pt-PT', { 
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
                    {selectedEvent && new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime() > 0
                      ? Math.round((new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime()) / (1000 * 60))
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
                  {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : '-'}
                </p>
              </div>
  
              <div className="p-4 bg-[#ECFDF5] rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Número da sessão</span>
                <p className="text-gray-700 font-mono text-sm">
                  {selectedEvent?.id || '-'}
                </p>
              </div>
  
              <div className="p-4 bg-[#ECFDF5] rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Motivo:</span>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399]"
                  placeholder="ex: Dor de costas"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
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
                Cancelar
              </button>
              <button 
                onClick={() => handleConfirm(selectedEvent)}
                className="px-4 py-2 rounded-lg bg-[#34D399] text-white hover:bg-[#34D399]/90 transition-colors"
              >
                Confirmar Vaga
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default CalendarApp;
