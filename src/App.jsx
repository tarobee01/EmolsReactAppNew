import React, { useState } from 'react';
import Bar from './Components/NavigationBar';
import Title from './Components/Title';
import Main from './Components/MainScreen';
import Sub from './Components/SubScreen';
import Set from './Components/SetScreen';

import './Components/NavigationBar.css';
import './Components/Title.css';
import './Components/MainScreen.css';
import './Components/SubScreen.css';
import './Components/SetScreen.css';

import './App.css';
import './Button.css';

function App() {
  const [activePage, setActivePage] = useState('title');
  const [dateData, setDateData] = useState(null);

  return (
    <>
      {activePage !== 'title' && <Bar setActivePage={setActivePage} />}

      {activePage === 'title' && <Title setActivePage={setActivePage} />}
      {activePage === 'main' && <Main setActivePage={setActivePage} setDateData={setDateData} />}
      {activePage === 'sub' && <Sub dateData={dateData} />}
      {activePage === 'set' && <Set />}
    </>
  );
}

export default App;
