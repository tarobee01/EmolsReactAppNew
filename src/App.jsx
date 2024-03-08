import React, { useState } from 'react';
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

function App() {
  const [activePage, setActivePage] = useState('title');
  const [dateData, setDateData] = useState(null);
  const [showPallet, setShowPallet] = useState(false);

  return (
    <>
      {activePage !== 'title' && <Bar activePage={activePage} setActivePage={setActivePage} showPallet={showPallet} setShowPallet={setShowPallet} />}
      {activePage === 'main' && <Pallet showPalette={showPallet} style={{ position: 'fixed', zIndex: 100 }} />}

      {activePage === 'title' && <Title setActivePage={setActivePage} />}
      {activePage === 'main' && <Main setActivePage={setActivePage} setDateData={setDateData} style={{ position: 'fixed', zIndex: 99 }} />}
      {activePage === 'sub' && <Sub dateData={dateData} />}
      {activePage === 'set' && <Set />}
    </>
  );
}

export default App;
