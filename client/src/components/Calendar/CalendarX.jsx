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
import { reservarSessao, cancelarSessao, DeleteSessao } from "../../api/sessoes.js";
import { useUser } from "../../contexts/UserContext.jsx";

function CalendarApp() {
  // Core state
  const [eventsService] = useState(() => createEventsServicePlugin());
  const { sessoes, sessoesCanceladas, allSessoes, fetchSessoes } = useSessoes();
  const { userId, isFisio } = useUser();
  
  // Modal state
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");
  
  // Cancelation dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [sessaoParaCancelar, setSessaoParaCancelar] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [erroCancelamento, setErroCancelamento] = useState("");

  // Handle deleting a session (for physio only)
  const handleDelete = async () => {
    try {
      await DeleteSessao(selectedEvent?.id);
      window.location.reload();
     
      
      // Close modal and refresh
      modalRef.current?.close();
      handleClose();
      fetchSessoes();
    } catch (error) {
      setErro(error.message);
    }
  };

  // Handle reserving a session
  const handleConfirm = async (event) => {
    if (!motivo) {
      setErro("Digite o motivo da sessão");
      return;
    }
    
    try {
      await reservarSessao(event.id, userId, motivo);
      setErro("");
      window.location.reload();
    } catch (error) {
      setErro(error.message);
    }
  };

  // Handle cancellation flow
  const handleCancelar = (event) => {
    setSessaoParaCancelar(event);
    setShowCancelDialog(true);
  };

  const confirmarCancelamento = async () => {
    if (!motivoCancelamento) {
      setErroCancelamento("Digite o motivo do cancelamento");
      return;
    }
    
    try {
      await cancelarSessao(sessaoParaCancelar.id, motivoCancelamento);
      setShowCancelDialog(false);
      window.location.reload();
    } catch (error) {
      setErro(error.message);
    }
  };

  // Modal handling
  const handleClose = () => {
    setSelectedEvent(null);
    setMotivo("");
    setErro("");
  };

  // Process sessions and create calendar events
  useEffect(() => {
    const sessoesParaExibir = isFisio && allSessoes?.length > 0 ? allSessoes : sessoes;
    if (!sessoesParaExibir || sessoesParaExibir.length === 0) return;
    
    // Clear existing events
    const currentEvents = eventsService.getAll();
    currentEvents.forEach((event) => eventsService.remove(event.id));
    
    const agora = new Date();
    
    // Create events from sessions
    sessoesParaExibir.forEach((sessao) => {
      // Determine if session is canceled
      const sessaoCancelada = sessoesCanceladas.some(
        (cancelada) => 
          cancelada.utenteId === userId && 
          cancelada.sessaoId === (sessao._id || sessao.id)
      );
      
      // Determine if session belongs to current user
      const sessaoPertenceAoUtente = sessao.utenteId === userId;
      
      // Calculate time difference in hours
      const dataInicio = new Date(sessao.dataHoraInicio);
      const diferencaEmHoras = (dataInicio - agora) / (1000 * 60 * 60);
      
      // Determine if session should be displayed based on user role
      let deveExibir = false;
      
      if (isFisio) {
        // Physiotherapist sees all non-canceled sessions
        deveExibir = !sessaoCancelada;
      } else {
        // Normal user sees available sessions or their own
        deveExibir = !sessaoCancelada &&
          ((sessao.status === "disponivel" && dataInicio > agora && diferencaEmHoras > 2) ||
          ((sessao.status === "concluida" || sessao.status === "reservada") &&
            sessaoPertenceAoUtente));
      }
      
      // If session should be displayed, create event
      if (deveExibir) {
        // Get user name for display
        const utenteNome = sessao.utenteId?.nome || '';
        
        // Create event object
        const evento = {
          id: sessao._id || sessao.id,
          title: getEventTitle(sessao, isFisio, utenteNome),
          start: sessao.dataHoraInicio,
          end: sessao.dataHoraFim,
          description: sessao.motivo || "",
          calendarId: sessao.status,
          sessaoCompleta: sessao,
        };
        
        eventsService.add(evento);
      }
    });
  }, [sessoes, allSessoes, sessoesCanceladas, userId, isFisio, eventsService]);

  // Helper function to get event title
  function getEventTitle(sessao, isFisio, utenteNome) {
    switch (sessao.status) {
      case "reservada":
        return `Reservada ${isFisio ? '- ' + utenteNome : ''}`;
      case "concluida":
        return `Concluída ${isFisio ? '- ' + utenteNome : ''}`;
      default:
        return "Sessão Disponível";
    }
  }

  // Calendar configuration
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
        colorName: "concluida",
        lightColors: {
          main: "#0EA5E9",
          container: "#F0F9FF",
          onContainer: "#0369A1",
        },
      },
      reservada: {
        colorName: "reservada",
        lightColors: {
          main: "#6366F1",
          container: "#EEF2FF",
          onContainer: "#4338CA",
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
        setSelectedEvent(calendarEvent);
        setTimeout(() => {
          modalRef.current?.showModal();
        }, 0);
      },
    },
    locale: "pt-BR",
  });

  return (
    <div>
      {isFisio && !allSessoes?.length && (
        <div className="text-center p-4 mb-4 bg-yellow-100 text-yellow-800 rounded">
          Nenhuma sessão disponível para visualização.
        </div>
      )}
      
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
          isFisio={isFisio}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default CalendarApp;