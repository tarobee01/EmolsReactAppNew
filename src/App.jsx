import React, { useState, useEffect } from 'react';
import Bar from './Components/NavigationBar';
import Title from './Components/Title';
import Main from './Components/MainScreen';
import Sub from './Components/SubScreen';
import Set from './Components/SetScreen';
import Pallet from './Components/Pallet';

import './Components/NavigationBar.css';
import './Components/Title.css';
import './Components/MainScreen.css';
import './Components/SubScreen.css';
import './Components/SetScreen.css';
import './Components/Pallet.css';

import './App.css';
import './Button.css';

import { getDocs, getFirestore, collection, onSnapshot } from 'firebase/firestore';

function App() {
  const [activePage, setActivePage] = useState('title');
  const [dateData, setDateData] = useState(null);
  const [showPallet, setShowPallet] = useState(false);
  const newEvent = {
    title: '出勤',
    date: '2024-03-20',
    startTime: 10,
    endTime: 12,
    color: '#ff0000'
  };
  const [eventData, setEventData] = useState([newEvent]);
  const [allEventData, setAllEventData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const eventsCollection = collection(db, 'events');

      const querySnapshot = await getDocs(eventsCollection);
  
      const fetchedEvents = [];
      querySnapshot.forEach(doc => {
        fetchedEvents.push(doc.data());
      });
      setAllEventData(fetchedEvents);

      const unsubscribe = onSnapshot(eventsCollection, snapshot => {
        const updatedEvents = [];
        snapshot.forEach(doc => {
          updatedEvents.push(doc.data());
        });
        setAllEventData(updatedEvents);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  return (
    <>
      {activePage !== 'title' && <Bar activePage={activePage} setActivePage={setActivePage} showPallet={showPallet} setShowPallet={setShowPallet} />}
      {activePage === 'main' && <Pallet showPalette={showPallet} />}

      {activePage === 'title' && <Title setActivePage={setActivePage} />}
      {activePage === 'main' && <Main setActivePage={setActivePage} setDateData={setDateData} eventData={eventData} allEventData={allEventData} setAllEventData={setAllEventData} />}
      {activePage === 'sub' && <Sub dateData={dateData} />}
      {activePage === 'set' && <Set eventData={eventData} setEventData={setEventData} />}
    </>
  );
}

export default App;
