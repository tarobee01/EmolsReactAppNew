import React from 'react';
import Object from './Object';

const Title = ({ setActivePage }) => {
  return (
    <div>
      <h1 className='title1'>ペイント<br />カレンダー</h1>
      <h4 className='title0'>作 がれんだーまん</h4>
      <div className='title2'>
        <Object />
      </div>
      <button className='title3 button' onClick={() => setActivePage('main')}>はじめる</button>
    </div>
  );
};

export default Title;
