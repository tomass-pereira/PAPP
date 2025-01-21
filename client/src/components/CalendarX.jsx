import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createSidebarPlugin } from "@sx-premium/sidebar"
import '@sx-premium/sidebar/index.css'
import '@schedule-x/theme-default/dist/time-picker.css'
import { createInteractiveEventModal, createInputField } from "@sx-premium/interactive-event-modal"
import '@sx-premium/interactive-event-modal/index.css'
import React, { useState } from 'react'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import '@schedule-x/theme-default/dist/index.css'
import { createResizePlugin } from '@schedule-x/resize'

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin({
    calendars: [
      {
        id: 'personal',
        name: 'Personal',
        primary: true,
        backgroundColor: '#2196F3'
      },
      {
        id: 'work',
        name: 'Work',
        backgroundColor: '#4CAF50'
      },
      {
        id: 'leisure',
        name: 'Leisure',
        backgroundColor: '#FF9800'
      },
      {
        id: 'school',
        name: 'School',
        backgroundColor: '#9C27B0'
      },
      {
        id: 'internal',
        name: 'Internal',
        backgroundColor: '#E91E63'
      },
      {
        id: 'clients',
        name: 'Clients',
        backgroundColor: '#795548'
      }
    ],
    onChange: (events) => {
      console.log('Events changed:', events)
    }
  }))[0]

  // Criar campos personalizados para o modal
  const regionInputField = createInputField({
    label: 'Região',
    type: 'select',
    items: [],
  })

  const countryInputField = createInputField({
    label: 'País',
    type: 'select',
    items: [
      { label: 'Brasil', value: 'BR' },
      { label: 'Portugal', value: 'PT' },
    ],
    onChange: (value) => {
      console.log('País selecionado:', value)
      modalPlugin.formValues.value = {
        ...modalPlugin.formValues.value,
        region: ''
      }
      regionInputField.value.rerender()
      
      if (value === 'BR') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'São Paulo', value: 'sp' },
            { label: 'Rio de Janeiro', value: 'rj' },
          ]
        }
      } else if (value === 'PT') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'Lisboa', value: 'lisboa' },
            { label: 'Porto', value: 'porto' },
          ]
        }
      }
    }
  })

  const modalPlugin = useState(() => createInteractiveEventModal({
    eventsService,
    onAddEvent: (event) => {
      console.log('Evento adicionado:', event)
    },
    onDeleteEvent: (eventId) => {
      console.log('Evento deletado:', eventId)
    },
    onUpdateEvent: (event) => {
      console.log('Evento atualizado:', event)
    },
    fields: {
      title: {},
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {},
      description: {},
    },
    customFields: {
      country: countryInputField,
      region: regionInputField,
    }
  }))[0]
 
  const sidebar = createSidebarPlugin({
    eventsService,
    openOnRender: false,
    activeCalendarIds: ['personal', 'work', 'leisure', 'school', 'internal', 'clients'],
    hasCalendarToggles: true,
    placeholderEvents: [
      {
        title: 'Morning brief',
        calendarId: 'internal',
        people: ['John Doe', 'Jane Doe', 'Steve Smith'],
      },
      {
        title: 'Client demo',
        calendarId: 'internal',
        people: ['John Doe', 'Jane Doe'],
      },
      {
        title: 'Team meeting',
        calendarId: 'clients',
        people: ['John Doe', 'Jane Doe', 'Steve Smith'],
      }
    ],
    idFactory: () => crypto.randomUUID()
  })
  
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService, modalPlugin, createDragAndDropPlugin(), createResizePlugin(), sidebar],
    locale: 'pt-BR',
    defaultView: 'week',
    dayBoundaries: {
      start: '09:00',
      end: '20:00',
    },
    minDate: '2025-01-01',
    events: [
      {
        id: 1,
        title: 'Coffee with John',
        description: 'Discuss the project',
        start: '2025-01-20 10:05',
        end: '2025-01-20 12:35',
        color: '#FF0000',
        isEditable: true,
        calendarId: 'work'
      },
    ],
    defaultEventConfig: {
      isEditable: true,
      isDraggable: true,
      isResizable: true
    }
  })
 
  return (
    <div className="max-w-7xl ml-18 h-[600px] p-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp