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
      id: "98d85d98541f",
      calendarId: "work"
    }, 
    {
      title: "Sipping Aperol Spritz on the beach",
      start: "2025-02-07 12:00",
      end: "2025-02-07 15:20",
      id: "0d13aae3b8a1",
      calendarId: "disponivel"
    }
  ]);
  const modalRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [eventsService] = useState(() => createEventsServicePlugin());
 

 

  const regionInputField = createInputField({
    label: 'Region',
    type: 'select',
    items: [],
  });

  const countryInputField = createInputField({
    label: 'Country',
    type: 'select',
    items: [
      { label: 'USA', value: 'USA' },
      { label: 'Germany', value: 'Germany' },
    ],
    onChange: (value) => {
      if (!modalRef.current) return;
      
      modalRef.current.formValues.value = {
        ...modalRef.current.formValues.value,
        region: ''
      };
      regionInputField.value.rerender();

      if (value === 'USA') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'California', value: 'ca' },
            { label: 'New York', value: 'ny' },
          ]
        };
      } else if (value === 'Germany') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'Berlin', value: 'berlin' },
            { label: 'Munich', value: 'munich' },
          ]
        };
      }
    }
  });

 

 

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
    <Modal ref={modalRef} event={selectedEvent} />
  </div>
  )
}

export default CalendarApp;