import React, { useState } from 'react';

function Palette({ showPalette }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [palette, setPalette] = useState([
    { color: '#0000FF', text: '講義' },
    { color: '#FFFF00', text: '研究' },
  ]);
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const [newColorText, setNewColorText] = useState('');

  const addColorToPalette = () => {
    setPalette([...palette, { color: newColor, text: newColorText }]);
    setNewColorText('');
  };

  const handleSelectColor = (color) => {
    setSelectedColor(selectedColor === color ? '' : color);
  };

  const removeColorFromPalette = (index) => {
    const newPalette = palette.filter((_, i) => i !== index);
    setPalette(newPalette);
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', display: 'flex', zIndex: '100' }}>
      {showPalette && (
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
                  onClick={() => handleSelectColor(item.color)}
                ></button>
                <button
                  className="remove-button"
                  onClick={() => removeColorFromPalette(index)}
                >×</button>
                <div className="color-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Palette;
