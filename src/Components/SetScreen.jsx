import React from 'react';

const SetScreen = ({ eventData, setEventData }) => {
  return (
    <div>
      <h1>設定画面</h1>
      <div>
        {eventData.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '-20px' }}>
            <h3>・{item.startTime}:00~{item.endTime}:00 : {item.title}</h3>
            <div style={{ width: '20px', height: '20px', backgroundColor: item.color, marginLeft: '10px', border: '1px solid black' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetScreen;
