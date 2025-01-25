import {useState, useRef} from 'react'
import './Calendar.css'
import {ScheduleXCalendar, useCalendarApp} from "@schedule-x/react";
import {createEventsServicePlugin} from "@schedule-x/events-service";
import {createViewDay, createViewMonthGrid, createViewWeek, createViewMonthAgenda} from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css'
import '@sx-premium/interactive-event-modal/index.css'
import {createInputField, createInteractiveEventModal} from "@sx-premium/interactive-event-modal";
import {createDragToCreatePlugin} from "@sx-premium/drag-to-create";
import '@sx-premium/drag-to-create/index.css'
import { v4 as uuidv4 } from 'uuid';
import DraggableSession from './dragablesSession';



function CalendarApp() {
  // Add state for events
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Event 5',
      start: '2025-01-25 12:00',
      end: '2025-01-25 15:00',
      isEditable: true,
    }
  ]);

  const [eventsService] = useState(() => createEventsServicePlugin());
  let dragToCreatePlugin = useState(createDragToCreatePlugin({
    onAddEvent: (event) => {
      console.log(event)
      // save to your server
    }
  }))[0];

 

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

  const modalRef = useRef(null);
  const [modalPlugin] = useState(() => {
    const modal = createInteractiveEventModal({
      eventsService,
      onAddEvent: (event) => {
        const newEvent = {
          ...event,
          id: uuidv4(),
          calendar: event.calendar || 'personal',
          isEditable: true
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
      },
      onDeleteEvent: (eventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      },
      onUpdateEvent: (updatedEvent) => {
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        ));
      },
      fields: {
        title: {
          required: true
        },
        startDate: {
          required: true
        },
        startTime: {
          required: true
        },
        endDate: {
          required: true
        },
        endTime: {
          required: true
        },
      },
      customFields: {
        country: countryInputField,
        region: regionInputField,
      }
    });

    modalRef.current = modal;
    return modal;
  });

 

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    defaultView: 'week',
   
    events: events, // Use the events from state
    plugins: [
      eventsService,
      dragToCreatePlugin,
      modalPlugin,
    ],
    
    locale: 'pt-BR',
  });

  return (
    <div>
      <div
        className={'placeholderEvent'}
        draggable={true}
        onDragStart={() => {
          dragToCreatePlugin.dragToCreate(uuidv4(), {
            title: 'Sessão de Fisioterapia',
            description: 'Some description',
            
          })
        }}
        style={{
          width: '100px',
          height: '50px',
          backgroundColor: '#eaddff',
          color: '--sx-color-on-primary-container',
          textAlign: 'center',
          lineHeight: '50px',
          cursor: 'move',
        }}
      >
        Criar Sessão
      </div>

      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default CalendarApp;