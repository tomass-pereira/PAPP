import React from 'react'
import {ScheduleXCalendar, useCalendarApp} from '@schedule-x/react';
import {createViewWeek, createViewMonthGrid} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';

export default function Calendar() {
    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
            createViewMonthGrid() // Erro corrigido abaixo
        ],
        events: [
            {
                id: 1,
                title: 'Event 1',
                start: new Date(2023, 5, 1), // O mês em JavaScript é zero-based, 5 é junho
                end: new Date(2023, 5, 3)
            }
        ],
        selectedDate: '2023-06-01'
    });
    



    
  return (
    <>
    <div>
        <ScheduleXCalendar calendarApp={calendar}/>
    </div>
    </>
  )
}
