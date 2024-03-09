import React, { useState, useEffect } from 'react';
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

const MainScreen = ({ setActivePage, setDateData, eventData, setEventData, allEventData, setAllEventData }) => {
  const [newStartDate, setNewStartDate] = useState({
    year: moment().year(),
    month: moment().month() + 1,
    day: moment().date(),
  });
  const [newStartTime, setNewStartTime] = useState(8);
  const [newEndTime, setNewEndTime] = useState(11);

  const [events, setEvents] = useState([...allEventData]);

  const addEvent = () => {
    const db = getFirestore();
    const eventsCollection = collection(db, 'events');
    const newEvent = {
      title: '残業',
      date: moment(`${newStartDate.year}-${newStartDate.month}-${newStartDate.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      startTime: newStartTime,
      endTime: newEndTime,
      color: '#ff0000' // 任意の色
    };
    addDoc(eventsCollection, newEvent);
    setEvents([...events, newEvent]);
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
        <div>
          <label>開始日付</label>
          <input
            type="number"
            value={newStartDate.year}
            onChange={(e) => setNewStartDate({ ...newStartDate, year: parseInt(e.target.value) })}
          />
          <input
            type="number"
            value={newStartDate.month}
            onChange={(e) => setNewStartDate({ ...newStartDate, month: parseInt(e.target.value) })}
          />
          <input
            type="number"
            value={newStartDate.day}
            onChange={(e) => setNewStartDate({ ...newStartDate, day: parseInt(e.target.value) })}
          />
          <label>開始時間</label>
          <input
            type="number"
            value={newStartTime}
            onChange={(e) => setNewStartTime(parseInt(e.target.value))}
          />
          <label>終了時間</label>
          <input
            type="number"
            value={newEndTime}
            onChange={(e) => setNewEndTime(parseInt(e.target.value))}
          />
        </div>
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
