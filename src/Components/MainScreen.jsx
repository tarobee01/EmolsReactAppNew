import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ja';
import CustomDayProps from './Color';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 

moment.updateLocale('ja', {
  week: {
    dow: 0,
    doy: 6,
  },
  months: moment.localeData('ja').months(),
  monthsShort: moment.localeData('ja').monthsShort(),
});

const localizer = momentLocalizer(moment);

const MainScreen = ({ setActivePage, setDateData, eventData, allEventData }) => {
  const [events, setEvents] = useState([
    {
      title: '遊び',
      date: '2024-03-14',
      startTime: 6,
      endTime: 8,
      color: '#ffff00'
    },
    {
      title: '洗濯',
      date: '2024-03-15',
      startTime: 8,
      endTime: 10,
      color: '#0077ff'
    },
    {
      title: '掃除',
      date: '2024-03-17',
      startTime: 7,
      endTime: 14,
      color: '#ffff00'
    },
    {
      title: '出勤',
      date: '2024-03-17',
      startTime: 9,
      endTime: 13,
      color: '#0077ff'
    },
    ...allEventData
  ]);

  const addEvent = () => {
    const db = getFirestore();
    const eventsCollection = collection(db, 'events');
    addDoc(eventsCollection, ...eventData);
    setEvents([...events, ...eventData]);
  };

  const eventsByDate = events.reduce((groupedEvents, event) => {
    const dateStr = moment(event.date).format('YYYY-MM-DD');
    if (!groupedEvents[dateStr] || event.startTime < groupedEvents[dateStr].startTime) {
      groupedEvents[dateStr] = event;
    }
    return groupedEvents;
  }, {});

  const { dayPropGetter } = CustomDayProps({ events });

  const handleDateClick = (date) => {
    const dateEvents = events.filter(event => moment(event.date).format('YYYY-MM-DD') === moment(date.date).format('YYYY-MM-DD'));
    setDateData(dateEvents);
    setActivePage('sub');
  };

  const CustomEventIndicator = ({ event }) => (
    <div style={{ backgroundColor: '#00000000' }}>
      <span>
        {events.filter(e => moment(e.date).format('YYYY-MM-DD') === moment(event.date).format('YYYY-MM-DD')).length}
      </span>
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
    <div>
      <div className="event-container">
        <button onClick={addEvent}>イベントを追加する</button>
      </div>
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
            dayPropGetter={dayPropGetter}
            components={{
              event: CustomEventIndicator,
              toolbar: customToolbar,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
