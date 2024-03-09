import React from 'react';

const Title = ({ setActivePage }) => {
  return (
    <div>
      <h1 className='title1'>スポイト<br />カレンダー</h1>
      <h4 className='title0'>作 がれんだーまん</h4>
      <img className='title2' src="./title-rogo.png" alt="title-rogo" width="100px" />
      <button className='title3 button' onClick={() => setActivePage('main')}>はじめる</button>
    </div>
  );
};

export default Title;
