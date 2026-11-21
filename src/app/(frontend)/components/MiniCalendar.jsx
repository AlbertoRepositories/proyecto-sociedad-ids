import React, { useState } from 'react';

export default function MiniCalendar() {
  const [selectedDays, setSelectedDays] = useState([2, 13]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));

  const [hoveredDay, setHoveredDay] = useState(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const style = {
    padding: '15px',
    width: '250px',
    height: 'auto',
    margin: '10px',
    color: 'white',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxSizing: 'border-box',
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.18)", 
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  };

  const header_style = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    paddingRight: '5px'
  };

  const nav_btn_style = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px 6px'
  };

  const calendar_style = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '8px',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: '12px'
  };

  const day_header_style = {
    fontWeight: 'bold',
    color: '#ABA7B4',
    marginBottom: '4px'
  };

  const getDayStyle = (day) => {
    const isSelected = selectedDays.includes(day);
    const isHovered = hoveredDay === day && day !== null;

    let bg = 'transparent';
    if (isSelected) {
      bg = '#9FA1FF';
    } else if (isHovered) {
      bg = "rgba(87, 35, 100, 0.3)"; 
    }

    return {
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      borderRadius: '50%',
      cursor: day ? 'pointer' : 'default',
      backgroundColor: bg,
      color: 'white',
      transition: 'background-color 0.2s ease' 
    };
  };

  const button_style = {
    color: 'white',
    width: '100%',
    height: 'min-content',
    backgroundColor: isBtnHovered ? '#9FA1FF' : 'transparent',
    border: '1px solid white',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '5px',
    transition: 'all 0.2s ease' 
  };

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarCells = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const toggleDay = (day) => {
    if (!day) return;
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <section style={style}>
      <div style={header_style}>
        <button style={nav_btn_style} onClick={() => changeMonth(-1)}>&lt;</button>
        <button style={nav_btn_style} onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      <div style={calendar_style}>
        {daysOfWeek.map((day, index) => (
          <div key={`header-${index}`} style={day_header_style}>
            {day}
          </div>
        ))}

        {calendarCells.map((day, index) => (
          <div
            key={`day-${index}`}
            style={getDayStyle(day)}
            onClick={() => toggleDay(day)}
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {day}
          </div>
        ))}
      </div>

      <div>
        <button
          style={button_style}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
        >
          + Create
        </button>
      </div>
    </section>
  );
}