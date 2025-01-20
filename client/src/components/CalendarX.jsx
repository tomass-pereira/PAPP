import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import React, { useState} from 'react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import '@schedule-x/theme-default/dist/index.css'
import { createResizePlugin } from '@schedule-x/resize'
 
function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const eventModal = useState(() => createEventModalPlugin())[0]
  
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService, eventModal, createDragAndDropPlugin(), createResizePlugin()],
    locale: 'pt-BR',
    defaultView: 'week',
    dayBoundaries: {
      start: '09:00', // Alterado para incluir o horário do evento
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
        color: '#FF0000', // Adicionado cor para melhor visualização
        isEditable: true  // Permite edição do evento
      },
    ],
  })
 
  return (
    <div className="max-w-7xl ml-18 h-[600px] p-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp