import { useState, useRef, useEffect } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import {
  createViewMonthGrid,
  createViewWeek,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { useSessoes } from "../../contexts/SessoesContext.jsx";
import SessionModal from "./SessionModal.jsx";

import "./Calendar.css";
import { reservarSessao, cancelarSessao} from "../../api/sessoes.js";

function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const { sessoes, sessoesCanceladas} = useSessoes();
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
  
      const agora = new Date();
  
      sessoes.forEach((sessao) => {
        // Verifica se a sessão pertence ao utente atual
        const sessaoPertenceAoUtente = sessao.clienteId === utenteId;
        
        // Verifica se está cancelada
        const sessaoCancelada = sessoesCanceladas.some(
          cancelada => 
            cancelada.utenteId === utenteId && 
            cancelada.consultaId === sessao._id
        );
  
        const dataInicio = new Date(sessao.dataHoraInicio);
  
        // Só adiciona a sessão se:
        // 1. Não estiver cancelada
        // 2. Se for disponível, precisa ser uma data futura
        // 3. Se for concluída ou reservada, precisa pertencer ao utente
        if (!sessaoCancelada && 
            ((sessao.status === "disponivel" && dataInicio > agora) ||
             ((sessao.status === "concluida" || sessao.status === "reservada") && sessaoPertenceAoUtente))) {
          
          const evento = {
            id: sessao._id,
            title: sessao.status === "reservada" ? "Sessão Reservada" : 
                   sessao.status === "concluida" ? "Sessão Concluída" : 
                   "Sessão Disponível",
            start: sessao.dataHoraInicio,
            end: sessao.dataHoraFim,
            description: sessao.motivo,
            calendarId: sessao.status === "disponivel" ? "disponivel" : 
                       sessao.status === "concluida" ? "concluida" : 
                       "reservada",
            sessaoCompleta: sessao
          };
          eventsService.add(evento);
        }
      });
    }
  }, [sessoes, sessoesCanceladas, utenteId]);

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
          main: "#059669",
          container: "#ECFDF5",
          onContainer: "#065F46",
        },
      },
      concluida: {
        colorName: 'concluida',
        lightColors: {
          main: '#0EA5E9',
          container: '#F0F9FF',
          onContainer: '#0369A1',
        },
    },
    reservada: {
      colorName: "reservada",
      lightColors: {
        main: "#6366F1",   
        container: "#EEF2FF", 
        onContainer: "#4338CA",
      }
    }
  },
    
   
    defaultView: "month",
    dayBoundaries: {
      start: "10:00",
      end: "19:00",
    },
    plugins: [eventsService],
    callbacks: {
      onEventClick(calendarEvent) {
        setSelectedEvent(calendarEvent);
        // Usando setTimeout para garantir que o setState foi concluído
        setTimeout(() => {
          modalRef.current?.showModal();
        }, 0);
      },
    },
    locale: "pt-BR",
  });

  return (
    <div>
    <ScheduleXCalendar calendarApp={calendar} />
    
    {selectedEvent && (
  <SessionModal 
    modalRef={modalRef}
    selectedEvent={selectedEvent}
    handleClose={handleClose}
    handleCancelar={handleCancelar}
    handleConfirm={handleConfirm}
    showCancelDialog={showCancelDialog}
    setShowCancelDialog={setShowCancelDialog}
    motivoCancelamento={motivoCancelamento}
    setMotivoCancelamento={setMotivoCancelamento}
    erroCancelamento={erroCancelamento}
    erro={erro}
    motivo={motivo}
    setMotivo={setMotivo}
    confirmarCancelamento={confirmarCancelamento}
  />
)}
  </div>
  );
}

export default CalendarApp;
