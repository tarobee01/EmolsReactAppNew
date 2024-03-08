import React from 'react';

const NavigationBar = ({ activePage, setActivePage, showPallet, setShowPallet }) => {
  return (
    <div>
      <div className='navigationBar'>
        <button onClick={() => setActivePage('title')}><img src="./title-rogo.png" alt="title-rogo" width="34px" /></button>
        <button onClick={() => setActivePage('main')}><img src="./calender-rogo.png" alt="calender-rogo" width="34px" /></button>
        {activePage === 'main' && <button onClick={() => setShowPallet(!showPallet)}><img src="./pallet-rogo.png" alt="pallet-rogo" width="34px" /></button>}
        <button onClick={() => setActivePage('set')}><img src="./set-rogo.png" alt="set-rogo" width="34px" /></button>
      </div>
    </div>
  );
};

export default NavigationBar;
