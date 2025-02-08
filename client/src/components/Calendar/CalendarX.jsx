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
import { reservarSessao } from "../../api/sessoes.js";

function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const { sessoes } = useSessoes();
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const utenteId = localStorage.getItem("utenteId");
  const [erro, setErro] = useState('');
  const handleConfirm = async (event) => {
    try {
      const sessaoReservada = await reservarSessao(event.id, utenteId);
      setErro('');
      // Aqui você pode atualizar a UI, mostrar uma mensagem de sucesso, etc.
    } catch (error) {
      console.error("Erro ao reservar sessão:", error);
      setErro(error.message);
      // Aqui você pode mostrar uma mensagem de erro para o usuário
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
          title:"Sessão Disponível",
          start: sessao.dataHoraInicio.replace("T", " ").slice(0, 16),
          end: sessao.dataHoraFim.replace("T", " ").slice(0, 16),
          calendarId: sessao.status === "reservada" ? null : "disponivel",
        });
      });

      console.log("Eventos após atualização:", eventsService.getAll());
    }
  }, [sessoes]);

  const handleClose = () => {
    setSelectedEvent(null);
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
      <Modal
        ref={modalRef}
        event={selectedEvent}
        onConfirm={handleConfirm}
        onClose={handleClose}
        erro={erro}
      />
    </div>
  );
}

export default CalendarApp;
