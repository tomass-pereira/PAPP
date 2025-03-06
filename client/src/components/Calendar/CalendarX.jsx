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
import { reservarSessao, cancelarSessao } from "../../api/sessoes.js";
import { useUser } from "../../contexts/UserContext.jsx";

function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const { sessoes, sessoesCanceladas, allsessoes } = useSessoes();
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { userId, isFisio } = useUser();
  const [erro, setErro] = useState("");
  const [motivo, setMotivo] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [sessaoParaCancelar, setSessaoParaCancelar] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [erroCancelamento, setErroCancelamento] = useState("");

  // Log para diagnóstico
  useEffect(() => {
    console.log("isFisio:", isFisio);
    console.log("allsessoes:", allsessoes);
    console.log("sessoes:", sessoes);
  }, [isFisio, allsessoes, sessoes]);

  const handleCancelar = async (event) => {
    setSessaoParaCancelar(event);
    setShowCancelDialog(true);
  };

  const confirmarCancelamento = async () => {
    if (motivoCancelamento != "") {
      try {
        await cancelarSessao(sessaoParaCancelar.id, motivoCancelamento);
        setShowCancelDialog(false);
        window.location.reload();
      } catch (error) {
        setErro(error.message);
      }
    } else {
      setErroCancelamento("Digite o motivo do cancelamento");
    }
  };

  const handleConfirm = async (event) => {
    if (motivo != "") {
      try {
        const sessaoReservada = await reservarSessao(event.id, userId, motivo);
        setErro("");
        window.location.reload();
      } catch (error) {
        setErro(error.message);
      }
    } else {
      setErro("Digite o motivo da sessão");
    }
  };

  useEffect(() => {
    // Seleção de sessões com tratamento para evitar erros
    const sessoesParaExibir = isFisio && allsessoes?.length > 0 ? allsessoes : sessoes;
    
    // Log para diagnóstico
    console.log("Sessões a exibir:", sessoesParaExibir?.length || 0);
    
    if (sessoesParaExibir && sessoesParaExibir.length > 0) {
      // Limpar eventos existentes
      const currentEvents = eventsService.getAll();
      currentEvents.forEach((event) => eventsService.remove(event.id));

      const agora = new Date();
      
      // Contador para verificar quantas sessões passam no filtro
      let sessoesExibidas = 0;
      
      sessoesParaExibir.forEach((sessao) => {
        // Pegue o ID do utente de forma segura
        const utenteId = sessao.utenteId?._id || sessao.utenteId;
        const utenteNome = sessao.utenteId?.nome || sessao.utenteNome || "Utente";
        
        // Verifica se a sessão pertence ao utente atual
        const sessaoPertenceAoUtente = utenteId === userId;

        // Verifica se está cancelada
        const sessaoCancelada = sessoesCanceladas.some(
          (cancelada) =>
            cancelada.utenteId === userId && 
            cancelada.sessaoId === (sessao._id || sessao.id)
        );

        const dataInicio = new Date(sessao.dataHoraInicio);
        
        // Calcular a diferença de tempo em horas
        const diferencaEmHoras = (dataInicio - agora) / (1000 * 60 * 60);

        // Lógica de filtro diferente para fisio e utente normal
        let deveExibir = false;
        
        if (isFisio) {
          // Fisioterapeuta vê todas as sessões não canceladas
          deveExibir = !sessaoCancelada;
        } else {
          // Utente normal só vê sessões disponíveis ou próprias
          deveExibir = !sessaoCancelada &&
            ((sessao.status === "disponivel" && dataInicio > agora && diferencaEmHoras > 2) ||
            ((sessao.status === "concluida" || sessao.status === "reservada") &&
              sessaoPertenceAoUtente));
        }
        
        if (deveExibir) {
          sessoesExibidas++;
          const evento = {
            id: sessao._id || sessao.id,
            title:
              sessao.status === "reservada"
                ? `Reservada ${isFisio ? '- ' + utenteNome : ''}`
                : sessao.status === "concluida"
                ? `Concluída ${isFisio ? '- ' + utenteNome : ''}`
                : "Sessão Disponível",
            start: sessao.dataHoraInicio,
            end: sessao.dataHoraFim,
            description: sessao.motivo || "",
            calendarId:
              sessao.status === "disponivel"
                ? "disponivel"
                : sessao.status === "concluida"
                ? "concluida"
                : "reservada",
            sessaoCompleta: sessao,
          };
          eventsService.add(evento);
        }
      });
      
      console.log("Sessões que passaram no filtro:", sessoesExibidas);
    }
  }, [sessoes, allsessoes, sessoesCanceladas, userId, isFisio, eventsService]);

  const handleClose = () => {
    setSelectedEvent(null);
    setMotivo("");
    setErro("");
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
      {isFisio && !allsessoes?.length && (
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
        />
      )}
    </div>
  );
}

export default CalendarApp;