import React, { useState, useEffect, useRef } from 'react';

const SubScreen = ({ setActivePage, date }) => {
  const canvasRef = useRef(null);
  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(10);
  const [color, setColor] = useState('#e6c229');
  const [title, setTitle] = useState('遊び');
  const [dragging, setDragging] = useState(false); // ドラッグ中かどうかを管理

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const radius = 100;
    const startAngle = ((startTime - 6) / 24) * Math.PI * 2;
    const endAngle = ((endTime - 6) / 24) * Math.PI * 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(radius, radius, radius, 0, Math.PI * 2);
    context.fillStyle = '#e0e0e0';
    context.fill();

    context.beginPath();
    context.moveTo(radius, radius);
    context.arc(radius, radius, radius, startAngle, endAngle);
    context.closePath();
    context.fillStyle = color;
    context.fill();

    const textRadiusOuter = radius * 0.9;
    const textRadiusInner = radius * 0.7;

    const textXStart = radius + textRadiusOuter * Math.cos(startAngle);
    const textYStart = radius + textRadiusOuter * Math.sin(startAngle);

    context.font = '12px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(startTime.toString(), textXStart, textYStart);

    const textXEnd = radius + textRadiusOuter * Math.cos(endAngle);
    const textYEnd = radius + textRadiusOuter * Math.sin(endAngle);

    context.fillText(endTime.toString(), textXEnd, textYEnd);

    const textAngle = (startAngle + endAngle) / 2;
    const textX = radius + textRadiusInner * Math.cos(textAngle);
    const textY = radius + textRadiusInner * Math.sin(textAngle);

    context.font = '16px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(title, textX, textY);

    context.beginPath();
    context.arc(radius, radius, 5, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
  }, [startTime, endTime, color, title]);

  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    // タッチ位置が円内であればドラッグを開始
    if (isInsideCircle(x, y)) {
      setDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      // 角度を計算
      const angle = Math.atan2(y - radius, x - radius);
      // 時間を計算
      let hour = Math.round((angle / (Math.PI * 2) + 0.25) * 24);
      if (hour < 0) hour += 24;
      if (hour > 24) hour -= 24;

      // 弧の幅を保つために、endtime-starttimeを計算
      const timeDifference = endTime - startTime;

      // ドラッグしている位置によって開始時間または終了時間を更新
      if (hour >= startTime && hour <= 24 - timeDifference) {
        setStartTime(hour);
        setEndTime(hour + timeDifference);
      } else if (hour < startTime) {
        setStartTime(hour);
        setEndTime(hour + timeDifference);
      } else {
        setEndTime(hour);
        setStartTime(hour - timeDifference);
      }
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const isInsideCircle = (x, y) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= radius;
  };

  const radius = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div>
      <h1>ここはサブ画面です</h1>
      <h3>選択された日付: {date}</h3>
      <canvas ref={canvasRef} width={200} height={200} />
      <br />
      <button onClick={() => setActivePage('main')}>もどる</button>
    </div>
  );
};

export default SubScreen;
