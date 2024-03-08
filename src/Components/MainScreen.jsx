import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ja';

moment.updateLocale('ja', {
  week: {
    dow: 0,
    doy: 6,
  },
  months: moment.localeData('ja').months(),
  monthsShort: moment.localeData('ja').monthsShort(),
});

const localizer = momentLocalizer(moment);

const MyCalendar = ({ setActivePage, setDateData }) => {
  const events = [
    {
      title: '遊び',
      date: '2024-03-14',
      startTime: 6,
      endTime: 8,
      color: '#eeaaee'
    },
    {
      title: '洗濯',
      date: '2024-03-15',
      startTime: 8,
      endTime: 10,
      color: '#ee6aee'
    },
    {
      title: '掃除',
      date: '2024-03-17',
      startTime: 7,
      endTime: 14,
      color: '#eea99e'
    },
    {
      title: '出勤',
      date: '2024-03-17',
      startTime: 9,
      endTime: 13,
      color: '#e66aee'
    },
  ];

  const eventsByDate = events.reduce((groupedEvents, event) => {
    const dateStr = moment(event.date).format('YYYY-MM-DD');
    if (!groupedEvents[dateStr] || event.startTime < groupedEvents[dateStr].startTime) {
      groupedEvents[dateStr] = event;
    }
    return groupedEvents;
  }, {});

  const customDayPropGetter = date => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const eventCount = events.filter(event => moment(event.date).format('YYYY-MM-DD') === dateStr).length;

    return {
      className: eventCount > 0 ? 'has-events' : '',
    };
  };

  const handleDateClick = (date) => {
    const dateEvents = events.filter(event => moment(event.date).format('YYYY-MM-DD') === moment(date.date).format('YYYY-MM-DD'));
    setDateData(dateEvents);
    setActivePage('sub');
  };

  const CustomEventIndicator = ({ event }) => (
    <div className="event-indicator-container">
      <span className="event-indicator">{events.filter(e => moment(e.date).format('YYYY-MM-DD') === moment(event.date).format('YYYY-MM-DD')).length}</span>
    </div>
  );

  const customToolbar = toolbar => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToPrev = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const currentDate = moment(toolbar.date);
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month() + 1;

    return (
      <div className="custom-toolbar">
        <div className="left-section">
          <button onClick={goToToday}>今日</button>
          <div className="current-date">{`${currentYear}年${currentMonth}月`}</div>
        </div>
        <div className="right-section">
          <button onClick={goToPrev}>前月</button>
          <button onClick={goToNext}>次月</button>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={Object.values(eventsByDate)}
          views={['month']}
          defaultView="month"
          startAccessor="date"
          endAccessor="date"
          style={{ backgroundColor: '#f0f0f0' }}
          onSelectEvent={handleDateClick}
          selectable="ignoreEvents"
          dayPropGetter={customDayPropGetter}
          components={{
            event: CustomEventIndicator,
            toolbar: customToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;
