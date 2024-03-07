import React from 'react';

const Title = ({ setActivePage }) => {
  return (
    <div>
      <h1 className='title1'>スポイト<br />カレンダー</h1>
      <img className='title2' src="./rogo.png" alt="sample" width="100px" />
      <button className='title3 button' onClick={() => setActivePage('main')}>スタート</button>
    </div>
  );
};

export default Title;
