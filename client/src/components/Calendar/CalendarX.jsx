import { useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

import "@schedule-x/theme-default/dist/index.css";
import "./Calendar.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const eventModal = useState(() => createEventModalPlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        dayBoundaries: {
          start: "08:00",
          end: "20:00",
        },
    calendars: {
      personal: {
        colorName: "personal",
        lightColors: {
          main: "#f9d71c",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
      work: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
      leisure: {
        colorName: "leisure",
        lightColors: {
          main: "#1cf9b0",
          container: "#dafff0",
          onContainer: "#004d3d",
        },
        darkColors: {
          main: "#c0fff5",
          onContainer: "#e6fff5",
          container: "#42a297",
        },
      },
      school: {
        colorName: "school",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
      },
    },
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2025-01-20 12:00",
        end: "2025-01-20 15:00",
        calendarId: "leisure",
      },
    ],
    locale: "pt-BR",
    plugins: [eventsService, eventModal],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
