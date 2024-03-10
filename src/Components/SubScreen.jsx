import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, query, where, deleteDoc, getDocs, updateDoc, doc } from 'firebase/firestore'; 

const SubScreen = ({ dateData, setDateData, setActivePage }) => {
  const canvasRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(dateData.length > 0 ? dateData[0] : null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedStartTime, setEditedStartTime] = useState(0);
  const [editedEndTime, setEditedEndTime] = useState(0);

  useEffect(() => {
    if (selectedEvent) {
      setEditedTitle(selectedEvent.title);
      setEditedStartTime(selectedEvent.startTime);
      setEditedEndTime(selectedEvent.endTime);
    }
  }, [selectedEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const radius = 90;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = '#e0e0e0';
    context.fill();

    dateData.forEach(event => {
      const startAngle = ((event.startTime - 6) / 24) * Math.PI * 2;
      const endAngle = ((event.endTime - 6) / 24) * Math.PI * 2;

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, startAngle, endAngle);
      context.closePath();
      context.fillStyle = event.color;
      context.fill();

      const textAngle = (startAngle + endAngle) / 2;
      const textX = centerX + (radius * 0.7) * Math.cos(textAngle);
      const textY = centerY + (radius * 0.7) * Math.sin(textAngle);

      context.font = '12px Arial';
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`${String(event.startTime).padStart(2, '0')}:00~${String(event.endTime).padStart(2, '0')}:00`, textX, textY - 10);
      context.fillText(event.title, textX, textY + 10);

      if (selectedEvent && selectedEvent.startTime === event.startTime && selectedEvent.endTime === event.endTime) {
        context.strokeStyle = 'blue';
        context.lineWidth = 2;
        context.stroke();
      }
    });
  }, [dateData, selectedEvent]);

  useEffect(() => {
    // dateDataをstartTimeでソートする
    const sortedData = [...dateData].sort((a, b) => a.startTime - b.startTime);
    setDateData(sortedData);
  }, []);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    const titleToDelete = selectedEvent.title;
    const startTimeToDelete = selectedEvent.startTime;
    const endTimeToDelete = selectedEvent.endTime;

    const db = getFirestore();
    const eventsCollection = collection(db, 'events');
    const q = query(
      eventsCollection,
      where('title', '==', titleToDelete),
      where('startTime', '==', startTimeToDelete),
      where('endTime', '==', endTimeToDelete)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        const newData = dateData.filter(item => !(item.title === titleToDelete && item.startTime === startTimeToDelete && item.endTime === endTimeToDelete));
        setDateData(newData);
        setSelectedEvent(null);
        if (newData.length === 0) {
          setActivePage('main');
        }
      });
    } catch (e) {
      console.error('Error deleting event:', e);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;

    const titleToUpdate = editedTitle;
    const startTimeToUpdate = editedStartTime;
    const endTimeToUpdate = editedEndTime;

    const db = getFirestore();
    const eventsCollection = collection(db, 'events');
    const q = query(
      eventsCollection,
      where('title', '==', selectedEvent.title),
      where('startTime', '==', selectedEvent.startTime),
      where('endTime', '==', selectedEvent.endTime)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          title: titleToUpdate,
          startTime: startTimeToUpdate,
          endTime: endTimeToUpdate
        });
        const newData = [...dateData];
        const index = newData.findIndex(item => item.startTime === selectedEvent.startTime && item.endTime === selectedEvent.endTime);
        newData[index].title = titleToUpdate;
        newData[index].startTime = startTimeToUpdate;
        newData[index].endTime = endTimeToUpdate;
        setDateData(newData);
      });
    } catch (e) {
      console.error('Error updating event:', e);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} onClick={() => setSelectedEvent(null)} style={{ display: 'block', margin: '20px auto' }} />

      <div style={{ overflowY: 'auto', height: '190px', margin: '5px 0', border: '5px solid #ff000033' }}>
        {dateData.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '0px', 
              border: selectedEvent && selectedEvent.startTime === item.startTime && selectedEvent.endTime === item.endTime ? '2px solid blue' : 'none',
              cursor: 'pointer',
              background: selectedEvent && selectedEvent.startTime === item.startTime && selectedEvent.endTime === item.endTime ? '#ccc' : 'none',
              padding: '5px',
            }}
            onClick={() => setSelectedEvent(item)}
          >
            <h3 style={{ margin: '0px' }}>・{String(item.startTime).padStart(2, '0')}:00~{String(item.endTime).padStart(2, '0')}:00 : {item.title}</h3>
            <div style={{ width: '20px', height: '20px', backgroundColor: item.color, marginLeft: '10px', border: '1px solid black' }}></div>
            <div 
              style={{ 
                textAlign: 'center',
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ffffff', 
                marginLeft: '10px', 
                border: '1px solid black', 
                cursor: 'pointer'
              }}
              onClick={() => handleDeleteEvent()}
            >
              ×
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="edit-event-container">
          <input type="text" className="edit-event-input" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          <input type="number" className="edit-event-input" value={editedStartTime} onChange={(e) => setEditedStartTime(parseInt(e.target.value))} />:00~
          <input type="number" className="edit-event-input" value={editedEndTime} onChange={(e) => setEditedEndTime(parseInt(e.target.value))} />:00
          <button onClick={handleEditEvent} style={{ marginLeft: '10px' }}>保存</button>
        </div>
      )}
    </div>
  );
};

export default SubScreen;
