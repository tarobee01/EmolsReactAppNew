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
    // 重複チェック用のフラグ
    let isOverlapping = false;

    // 新しく追加しようとしているイベント
    const newEvent = {
      title: eventData[0].title,
      date: moment(`${newStartDate.year}-${newStartDate.month}-${newStartDate.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      startTime: newStartTime,
      endTime: newEndTime,
      color: eventData[0].color
    };

    // イベントの終了時間が開始時間以下にならないように制限
    if (newEvent.endTime <= newEvent.startTime) {
      alert('終了時間は開始時間より後の時間を設定してください。');
      return;
    }

    // 既存のイベントとの重複チェック
    allEventData.forEach(event => {
      if (
        moment(event.date).format('YYYY-MM-DD') === newEvent.date &&
        (
          (newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
          (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime) ||
          (newEvent.startTime <= event.startTime && newEvent.endTime >= event.endTime)
        )
      ) {
        // 重複がある場合
        isOverlapping = true;
      }
    });

    // 重複がある場合はアラートを表示して追加を中止
    if (isOverlapping) {
      alert('指定された時間帯に既にイベントが存在します。時間帯を変更してください。');
      return;
    }

    // 重複がない場合は新しいイベントを追加
    const db = getFirestore();
    const eventsCollection = collection(db, 'events');
    addDoc(eventsCollection, newEvent);
    setEvents([...events, newEvent]);
  };

  // 新しいイベントの開始時間の初期値を設定
  useEffect(() => {
    const dateStr = moment(`${newStartDate.year}-${newStartDate.month}-${newStartDate.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const eventsOnDate = allEventData.filter(event => moment(event.date).format('YYYY-MM-DD') === dateStr);

    if (eventsOnDate.length > 0) {
      // 日付にイベントがある場合、最も遅いendTimeを取得してstartTimeの初期値とする
      const latestEndTime = Math.max(...eventsOnDate.map(event => event.endTime));
      let initialStartTime = latestEndTime + 1;
      // startTimeの上限を23にする
      initialStartTime = Math.min(23, initialStartTime);
      // endTimeの上限を24にする
      const initialEndTime = Math.min(24, initialStartTime + 1);
      setNewStartTime(initialStartTime);
      setNewEndTime(initialEndTime);
    } else {
      // 日付にイベントがない場合、デフォルトの値8を設定
      setNewStartTime(8);
      setNewEndTime(11);
    }
  }, [newStartDate, allEventData]);

  // 新しいイベントの開始時間の初期値を設定
  useEffect(() => {
    const dateStr = moment(`${newStartDate.year}-${newStartDate.month}-${newStartDate.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const eventsOnDate = allEventData.filter(event => moment(event.date).format('YYYY-MM-DD') === dateStr);

    if (eventsOnDate.length > 0) {
      // 日付にイベントがある場合、最も遅いendTimeを取得してstartTimeの初期値とする
      const latestEndTime = Math.max(...eventsOnDate.map(event => event.endTime));
      setNewStartTime(latestEndTime);
    } else {
      // 日付にイベントがない場合、デフォルトの値8を設定
      setNewStartTime(8);
    }
  }, [newStartDate, allEventData]);

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

  // 開始日付の上限と下限
  const maxYear = moment().year() + 10; // 10年後まで
  const minYear = moment().year() - 10; // 10年前まで
  const maxMonth = 12;
  const minMonth = 1;
  const maxDay = moment(newStartDate.year + '-' + newStartDate.month, 'YYYY-MM').daysInMonth();
  const minDay = 1;

  // 開始時間と終了時間の上限と下限
  const maxTime = 24;
  const minTime = 0;

  // テキストボックスの値を増減させる関数
  const handleValueChange = (type, value) => {
    switch (type) {
      case 'year':
        setNewStartDate({ ...newStartDate, year: Math.max(minYear, Math.min(maxYear, value)) });
        break;
      case 'month':
        setNewStartDate({ ...newStartDate, month: Math.max(minMonth, Math.min(maxMonth, value)) });
        break;
      case 'day':
        setNewStartDate({ ...newStartDate, day: Math.max(minDay, Math.min(maxDay, value)) });
        break;
      case 'startTime':
        setNewStartTime(Math.max(minTime, Math.min(maxTime, value)));
        break;
      case 'endTime':
        setNewEndTime(Math.max(minTime, Math.min(maxTime, value)));
        break;
      default:
        break;
    }
  };

  // テキストボックスの選択状態を管理するための状態
  const [selectedTextbox, setSelectedTextbox] = useState(null);

  // 増減ボタンがクリックされたときの処理
  const handleIncrement = () => {
    if (selectedTextbox !== null) {
      switch (selectedTextbox) {
        case 'year':
          handleValueChange('year', newStartDate.year + 1);
          break;
        case 'month':
          handleValueChange('month', newStartDate.month + 1);
          break;
        case 'day':
          handleValueChange('day', newStartDate.day + 1);
          break;
        case 'startTime':
          handleValueChange('startTime', newStartTime + 1);
          break;
        case 'endTime':
          handleValueChange('endTime', newEndTime + 1);
          break;
        default:
          break;
      }
    }
  };

  const handleDecrement = () => {
    if (selectedTextbox !== null) {
      switch (selectedTextbox) {
        case 'year':
          handleValueChange('year', newStartDate.year - 1);
          break;
        case 'month':
          handleValueChange('month', newStartDate.month - 1);
          break;
        case 'day':
          handleValueChange('day', newStartDate.day - 1);
          break;
        case 'startTime':
          handleValueChange('startTime', newStartTime - 1);
          break;
        case 'endTime':
          handleValueChange('endTime', newEndTime - 1);
          break;
        default:
          break;
      }
    }
  };

  // テキストボックスの選択時に選択されたテキストボックスを設定
  const handleTextboxSelect = (type) => {
    setSelectedTextbox(type);
  };

  return (
    <div>
      <div className="event-container">
        <div className="left">
          <div>
            {eventData.map((item, index) => (
              <div key={index} style={{ width: '100px', height: '36px', backgroundColor: item.color, border: '1px solid black', textAlign: 'center', lineHeight: '36px' }}>
                <p style={{ margin: 0, fontSize: '20px' }}>{item.title}</p>
              </div>
             ))}
          </div>
          <button onClick={addEvent}>イベントの追加</button>
        </div>
        <div className="right">
          <input
            className='input-year'
            type="number"
            value={newStartDate.year}
            onChange={(e) => handleValueChange('year', parseInt(e.target.value))}
            onClick={() => handleTextboxSelect('year')} // テキストボックスがクリックされたときに選択状態にする
            style={{ border: selectedTextbox === 'year' ? '2px solid blue' : 'none' }} // 選択されている場合はボーダーを表示
          />
          年
          <br />
          <input
            className='input-day'
            type="number"
            value={newStartDate.month}
            onChange={(e) => handleValueChange('month', parseInt(e.target.value))}
            onClick={() => handleTextboxSelect('month')}
            style={{ border: selectedTextbox === 'month' ? '2px solid blue' : 'none' }}
          />
          月
          <input
            className='input-day'
            type="number"
            value={newStartDate.day}
            onChange={(e) => handleValueChange('day', parseInt(e.target.value))}
            onClick={() => handleTextboxSelect('day')}
            style={{ border: selectedTextbox === 'day' ? '2px solid blue' : 'none' }}
          />
          日
          <br />
          <input
            className='input-day'
            type="number"
            value={newStartTime}
            onChange={(e) => handleValueChange('startTime', parseInt(e.target.value))}
            onClick={() => handleTextboxSelect('startTime')}
            style={{ border: selectedTextbox === 'startTime' ? '2px solid blue' : 'none' }}
          />:00~
          <input
            className='input-day'
            type="number"
            value={newEndTime}
            onChange={(e) => handleValueChange('endTime', parseInt(e.target.value))}
            onClick={() => handleTextboxSelect('endTime')}
            style={{ border: selectedTextbox === 'endTime' ? '2px solid blue' : 'none' }}
          />:00
        </div>
        {/* 増減ボタン */}
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
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
