import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events - em um caso real, isso viria de uma API ou props
  const events = [
    {
      id: 1,
      title: 'Consulta Fisioterapia',
      start: new Date(2024, 0, 9, 12, 10),
      end: new Date(2024, 0, 9, 13, 10),
      location: 'Sala 3',
      color: 'bg-blue-200 border-blue-300'
    },
    {
      id: 2,
      title: 'Terapia Manual',
      start: new Date(2024, 0, 11, 3, 50),
      end: new Date(2024, 0, 11, 5, 20),
      location: 'Sala 1',
      color: 'bg-green-200 border-green-300'
    },
    {
      id: 3,
      title: 'Exercícios',
      start: new Date(2024, 0, 14, 4, 47),
      end: new Date(2024, 0, 14, 6, 47),
      location: 'Sala 2',
      color: 'bg-purple-200 border-purple-300'
    }
  ];

  // Gerar array de dias da semana
  const getWeekDays = () => {
    const days = [];
    const start = getStartOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Obter início da semana
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    return start;
  };

  // Gerar horários do dia
  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  // Navegar entre semanas
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Formatação de data
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Verificar se o evento deve ser exibido na célula
  const getEventsForCell = (day, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getHours() === hour;
    });
  };

  const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  const hours = getHours();
  const currentWeekDays = getWeekDays();

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
            Hoje
          </button>
          <div className="flex space-x-2">
            <button onClick={previousWeek} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">
            {formatDate(currentDate)}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
            Semana
          </button>
          <input
            type="date"
            className="px-4 py-2 border rounded"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="border rounded-lg">
        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {currentWeekDays.map((day, index) => (
            <div key={index} className="p-2 text-center border-r last:border-r-0">
              <div className="font-medium">{weekDays[index]}</div>
              <div className={`text-2xl ${
                day.toDateString() === new Date().toDateString() 
                ? 'text-blue-600 font-bold' 
                : ''
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horários e eventos */}
        <div className="grid grid-cols-8">
          {/* Coluna de horários */}
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b last:border-b-0 p-2 text-right pr-4">
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* Colunas dos dias */}
          {currentWeekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0">
              {hours.map((hour) => {
                const cellEvents = getEventsForCell(day, hour);
                return (
                  <div key={`${dayIndex}-${hour}`} className="h-20 border-b last:border-b-0 relative">
                    {cellEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`absolute left-0 right-0 mx-1 p-2 rounded ${event.color} border text-sm overflow-hidden`}
                        style={{
                          top: '0',
                          height: `${((event.end - event.start) / (1000 * 60 * 60)) * 5}rem`
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs">
                          {event.start.getHours()}:{String(event.start.getMinutes()).padStart(2, '0')} - 
                          {event.end.getHours()}:{String(event.end.getMinutes()).padStart(2, '0')}
                        </div>
                        <div className="text-xs">{event.location}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;