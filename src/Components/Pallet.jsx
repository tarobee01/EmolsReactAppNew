import React, { useState } from 'react';

function Palette({ showPallet, setEventData }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [palette, setPalette] = useState([
    { color: '#FF0000', title: '出勤' },
    { color: '#0077FF', title: '講義' },
    { color: '#FFFF00', title: '研究' },
  ]);
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const [newColorText, setNewColorText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const addColorToPalette = () => {
    // テキストフィールドが空かどうかチェック
    if (!newColorText.trim()) {
      setErrorMessage('テキストを入力してください');
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
      return;
    }
    // 同じ色が既にパレットに存在するかチェック
    const isColorExists = palette.some(item => item.color === newColor);
    if (!isColorExists) {
      setPalette([...palette, { color: newColor, title: newColorText }]);
      setNewColorText('');
      setErrorMessage(''); // エラーメッセージをクリア
    } else {
      // 同じ色が既に存在する場合、エラーメッセージを設定
      setErrorMessage('同じ色は追加できません');
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    }
  };

  const removeColorFromPalette = (index) => {
    const newPalette = palette.filter((_, i) => i !== index);
    setPalette(newPalette);
  };

  const handleSelectColor = (color, title) => {
    if (selectedColor === color) {
      // 同じ色を再度選択した場合、選択を解除
      setSelectedColor('');
      setSelectedText('');
    } else {
      setSelectedColor(color);
      setSelectedText(title);
    }
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
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {showPallet && (
        <div className="palette-container">
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
                  style={{
                    backgroundColor: item.color,
                    width: '55px',
                    height: '35px',
                    textAlign: 'center',
                    border: item.color === selectedColor ? '3px solid black' : 'none', // 選択された要素の枠線を太くする
                    borderRadius: '10px 10px 0 0',
                    position: 'relative',
                    color: '#333333',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                  }}
                  onClick={() => handleSelectColor(item.color, item.title)}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      color: '#333333',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      padding: '2px', // テキストとオブジェクトの境界線との間に余白を設定
                    }}
                  >
                    {item.title}
                  </div>
                </button>
                <button
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(44, 62, 80, 0.5)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '10px',
                    borderRadius: '50%',
                  }}
                  onClick={() => removeColorFromPalette(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                marginRight: '6px'
              }}
            />
            <input
              type="text"
              value={newColorText}
              onChange={(e) => setNewColorText(e.target.value)}
              placeholder="Color text"
              style={{
                flexGrow: 1,
                border: '1px solid #ddd',
                borderRadius: '20px',
                padding: '5px 10px',
                marginRight: '6px'
              }}
            />
            <button
              onClick={addColorToPalette}
              style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 15px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              Save
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Palette;
