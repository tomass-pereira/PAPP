import {useState, useRef} from 'react'
import './Calendar.css'
import {ScheduleXCalendar, useCalendarApp} from "@schedule-x/react";
import {createEventsServicePlugin} from "@schedule-x/events-service";
import {createViewDay, createViewMonthGrid, createViewWeek} from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css'
import '@sx-premium/interactive-event-modal/index.css'
import {createInputField, createInteractiveEventModal} from "@sx-premium/interactive-event-modal";
import { createSidebarPlugin } from "@sx-premium/sidebar";
import {createDragToCreatePlugin} from "@sx-premium/drag-to-create";
import '@sx-premium/sidebar/index.css'
import '@sx-premium/drag-to-create/index.css'
import { v4 as uuidv4 } from 'uuid';

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

  const dragToCreatePlugin = useState(() => createDragToCreatePlugin({
    onAddEvent: (event) => {
      const newEvent = {
        ...event,
        id: uuidv4(),
        calendar: 'personal', // or any default calendar you prefer
        isEditable: true
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
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

  const sidebar = createSidebarPlugin({
    eventsService,
    openOnRender: true,
    activeCalendarIds: ['personal', 'work', 'leisure', 'school'],
    hasCalendarToggles: true,
    placeholderEvents: [
      {
        title: 'Agendar sessão',
        description: 'Vaga para sessão de fisioterapia',
        calendarId: 'work',
        people: ['John Doe', 'Jane Doe', 'Steve Smith'],
      }
    ],
    idFactory: () => uuidv4()
  });

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    defaultView: 'week',
   
    events: events, // Use the events from state
    locale: 'pt-BR',
    plugins: [
      eventsService,
      sidebar,
      dragToCreatePlugin,
      modalPlugin,
    ],
    isDark: false,
    dateClickEnabled: true,
    eventClickEnabled: true,
  });

  return (
   
      <ScheduleXCalendar calendarApp={calendar} />
   
  );
}

export default CalendarApp;