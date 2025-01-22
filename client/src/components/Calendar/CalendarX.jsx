import {useState} from 'react'
import './Calendar.css'
import {ScheduleXCalendar, useCalendarApp} from "@schedule-x/react";
import {createEventsServicePlugin} from "@schedule-x/events-service";
import {createViewDay, createViewMonthGrid, createViewWeek} from "@schedule-x/calendar";


import '@schedule-x/theme-default/dist/index.css'
import '@sx-premium/interactive-event-modal/index.css'
import {createInputField, createInteractiveEventModal} from "@sx-premium/interactive-event-modal";

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const regionInputField = createInputField({
    label: 'Region',
    type: 'select',
    items: [],
  })

  const countryInputField = createInputField({
    label: 'Country',
    type: 'select',
    items: [
      { label: 'USA', value: 'USA' },
      { label: 'Germany', value: 'Germany' },
    ],
    onChange: (value) => {
      console.log(modalPlugin.formValues.value)
      modalPlugin.formValues.value = {
        ...modalPlugin.formValues.value,
        region: ''
      }
      regionInputField.value.rerender()

      if (value === 'USA') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'California', value: 'ca' },
            { label: 'New York', value: 'ny' },
          ]
        }
      } else if (value === 'Germany') {
        regionInputField.value = {
          ...regionInputField.value,
          items: [
            { label: 'Berlin', value: 'berlin' },
            { label: 'Munich', value: 'munich' },
          ]
        }
      }
    }
  });
  const modalPlugin = useState(() => createInteractiveEventModal({
    eventsService,

    onAddEvent: (event) => {
      console.log(event)
      // save the event on your server
    },

    // (Optional): callback for when an event is updated
    onDeleteEvent: (eventId) => {
      console.log(eventId)
      // delete the event from your server
    },

    fields: {
      title: {},
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {},
    },

    customFields: {
      country: countryInputField,
      region: regionInputField,
    }
  }))[0];

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-01-20',
        end: '2025-01-20',
      },
    ],
    selectedDate: '2025-01-20',
    plugins: [
      eventsService,
      modalPlugin,
    ]
  })

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default CalendarApp
