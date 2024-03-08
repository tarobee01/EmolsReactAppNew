import React, { useState } from 'react';

function Palette({ showPallet, eventData, setEventData }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [palette, setPalette] = useState([
    { color: '#0077FF', title: '講義' },
    { color: '#FFFF00', title: '研究' },
  ]);
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const [newColorText, setNewColorText] = useState('');

  const addColorToPalette = () => {
    setPalette([...palette, { color: newColor, title: newColorText }]);
    setNewColorText('');
  };

  const removeColorFromPalette = (index) => {
    const newPalette = palette.filter((_, i) => i !== index);
    setPalette(newPalette);
  };

  const handleSelectColor = (color, title) => {
    setSelectedColor(color);
    const newEvent = {
      title: title,
      date: '2024-03-20',
      startTime: 10,
      endTime: 12,
      color: color
    };
    setEventData([newEvent]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', display: 'flex', zIndex: '100' }}>
      {showPallet && (
        <div className="palette-container">
          <button onClick={() => setShowAddColorForm(!showAddColorForm)} className="add-button">
            {showAddColorForm ? '×' : '色の追加'}
          </button>
          {showAddColorForm && (
            <div className="add-color-form">
              <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              <input type="text" value={newColorText} onChange={(e) => setNewColorText(e.target.value)} placeholder="名前を入力して下さい..." />
              <button onClick={addColorToPalette}>保存</button>
            </div>
          )}
          <div className="color-palette">
            {palette.map((item, index) => (
              <div key={index} className="color-item">
                <button
                  className="color-button"
                  style={{ backgroundColor: item.color, opacity: selectedColor === item.color ? '0.5' : '1' }}
                  onClick={() => handleSelectColor(item.color, item.title)}
                ></button>
                <button
                  className="remove-button"
                  onClick={() => removeColorFromPalette(index)}
                >×</button>
                <div className="color-text">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Palette;
