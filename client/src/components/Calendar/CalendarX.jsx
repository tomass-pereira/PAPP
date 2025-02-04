import {useState, useRef} from 'react'
import {ScheduleXCalendar, useCalendarApp} from "@schedule-x/react";
import {createEventsServicePlugin} from "@schedule-x/events-service";
import {createViewMonthGrid, createViewWeek, createViewMonthAgenda} from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css'
import '@sx-premium/interactive-event-modal/index.css'
import {createInputField} from "@sx-premium/interactive-event-modal";
import '@sx-premium/drag-to-create/index.css'
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import './Calendar.css'



function CalendarApp() {
  // Add state for events
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Event 5',
      start: '2025-02-01 12:00',
      end: '2025-02-01 15:00',
      isEditable: true,
    },
    {
      id: '2',
      title: 'Event 5',
      start: '2025-02-01 12:00',
      end: '2025-02-01 15:00',
      isEditable: true,
    },
    {
      id: '3',
      title: 'Event 5',
      start: '2025-02-01 12:00',
      end: '2025-02-01 15:00',
      isEditable: true,
    },
    {
      id: '4',
      title: 'Event 6',
      start: '2025-02-01 12:00',
      end: '2025-02-01 15:00',
      isEditable: true,
    },
    {
      title: "Meeting with Mr. boss",
      start: "2025-02-03 13:15",
      end: "2025-02-03 15:00",
      id: "1",
      calendarId: "work"
    }, 
    {
      title: "Vaga",
      start: "2025-02-07 12:00",
      end: "2025-02-07 15:20",
      id: "1",
      calendarId: "disponivel"
    }
  ]);
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [eventsService] = useState(() => createEventsServicePlugin());
 
  const handleConfirm = (event) => {
    console.log('Vaga confirmada:', event);
    // Lógica adicional aqui
  };

  const handleClose = () => {
    setSelectedEvent(null);
    // Lógica adicional aqui
  };
 

 


  const calendar = useCalendarApp({
    views: [createViewMonthGrid(),createViewWeek(),createViewMonthAgenda()],
    calendars: {
     
      disponivel: {
        colorName: 'disponivel',
        lightColors: {
          main: '#34D399',       // Verde principal
          container: '#ECFDF5',  // Verde claro para o fundo
          onContainer: '#065F46' // Verde escuro para o texto
        }
      },
    
     
    },

    
    defaultView: 'month',
   dayBoundaries:{
   start:"10:00",
   end:'19:00'
   },
   events:events,
    
    plugins: [
      eventsService
      
    
    ],
    callbacks: {
      onEventClick(calendarEvent) {
        console.log('onEventClick', calendarEvent)
        setSelectedEvent(calendarEvent);
        modalRef.current?.showModal();
      }
    
    },
   
  
    locale: 'pt-BR',
  });

  return (
    <div>
    <ScheduleXCalendar calendarApp={calendar} />
    <Modal ref={modalRef} event={selectedEvent} onConfirm={handleConfirm} onClose={handleClose} />
  </div>
  )
}

export default CalendarApp;