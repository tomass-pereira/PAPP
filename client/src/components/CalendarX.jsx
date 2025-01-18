import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import React, { useState, useEffect } from 'react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import '@schedule-x/theme-default/dist/index.css'
 
function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const eventModal = useState(() => createEventModalPlugin())[0]
  const scrollPlugin = createScrollControllerPlugin({
    initialScroll: '08:00', // Define o scroll inicial aqui
    scrollBehavior: 'smooth' // Opcional: adiciona scroll suave
  })
  const scrollController = createScrollControllerPlugin({
    initialScroll: '08:00'
  })
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService, eventModal, createDragAndDropPlugin(30), scrollController],
    locale: 'pt-BR',
    defaultView: 'week', 
    dayBoundaries: {
      start: '06:00',
      end: '18:00',
    },
    minDate: '2025-01-01',
    events: [
      {
        id: 1,
        title: 'Coffee with John',
        description: 'Discuss the project',
        start: '2025-01-18 10:05',
        end: '2025-01-18 12:35',
      },
      {
        id: 2,
        title: 'Ski trip',
        start: '2025-01-20 08:00',
        end: '2025-01-20 18:00',
      },
    ],
    
  })
 
  return (
    <div className="w-auto max-w-7xl ml-18 h-[600px] p-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp