import React from 'react';

const Title = ({ setActivePage }) => {
  return (
    <div>
      <h1 className='title1'>ペイント<br />カレンダー</h1>
      <img className='title2' src="./title-rogo.png" alt="title-rogo" width="100px" />
      <button className='title3 button' onClick={() => setActivePage('main')}>スタート</button>
    </div>
  );
};

export default Title;
