import React, { useState, useEffect, useRef } from 'react';

const SubScreen = ({ dateData }) => {
  const canvasRef = useRef(null);
  const [date, setDate] = useState(dateData[0].date);
  const [startTime, setStartTime] = useState(dateData[0].startTime);
  const [endTime, setEndTime] = useState(dateData[0].endTime);
  const [color, setColor] = useState(dateData[0].color);
  const [title, setTitle] = useState(dateData[0].title);
  const [dragging, setDragging] = useState(false);

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

      const angle = Math.atan2(y - radius, x - radius);

      let hour = Math.round((angle / (Math.PI * 2) + 0.25) * 24);
      if (hour < 0) hour += 24;
      if (hour > 24) hour -= 24;

      const timeDifference = endTime - startTime;

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

      if (hour >= dateData[0].startTime && hour <= 24 - timeDifference) {
        dateData[0].startTime = hour;
        dateData[0].endTime = hour + timeDifference;
      } else if (hour < dateData[0].startTime) {
        dateData[0].startTime = hour;
        dateData[0].endTime = hour + timeDifference;
      } else {
        dateData[0].endTime = hour;
        dateData[0].startTime = hour - timeDifference;
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

      {dateData.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '-20px' }}>
          <h3>・{item.startTime}:00~{item.endTime}:00 : {item.title}</h3>
          <div style={{ width: '20px', height: '20px', backgroundColor: item.color, marginLeft: '10px', border: '1px solid black' }}></div>
        </div>
      ))}

    </div>
  );
};

export default SubScreen;
