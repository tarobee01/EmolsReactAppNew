import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ja';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ setActivePage, setDate }) => {
  const events = [
    {
      title: 'イベント1',
      date: new Date('2024-03-14'),
    },
    {
      title: 'イベント2',
      date: new Date('2024-03-15'),
    },
    {
      title: 'イベント3',
      date: new Date('2024-03-17'),
    },
  ];

  const handleDateClick = (event) => {
    const dateStr = moment(event.date).format('YYYY-MM-DD');
    setDate(dateStr);
    setActivePage('sub');
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          views={['month']}
          defaultView="month"
          startAccessor="date"
          endAccessor="date"
          style={{ backgroundColor: '#f0f0f0' }}
          onSelectEvent={handleDateClick}
          selectable="ignoreEvents"
        />
      </div>
    </div>
  );
};

export default MyCalendar;
