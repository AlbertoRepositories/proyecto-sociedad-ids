"use client";

import React, { useState } from "react";
import { Lalezar, Jost } from "next/font/google";
import MiniCalendar from "../components/MiniCalendar";

const lalezar = Lalezar({ weight: "400", subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });

const INITIAL_EVENTS = [
  { id: 1, date: "2026-11-16", hour: 7, title: "Visita a jefa" },
  { id: 2, date: "2026-11-17", hour: 8, title: "Hackathon" },
  { id: 3, date: "2026-11-19", hour: 8, title: "Reunión con asesor" },
  { id: 4, date: "2026-11-19", hour: 9, title: "Enlace" },
  { id: 5, date: "2026-11-19", hour: 9, title: "Duolingo" },
  { id: 6, date: "2026-11-21", hour: 10, title: "Escuela" },
];

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAYS_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 19));
  const [viewMode, setViewMode] = useState("week");
  const [events] = useState(INITIAL_EVENTS);
  const [hoveredKey, setHoveredKey] = useState(null);

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getWeekDays = (baseDate) => {
    const dayOfWeek = (baseDate.getDay() + 6) % 7;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const getMonthCells = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

    const cells = Array(firstDayIndex).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(new Date(year, month, i));
    }
    return cells;
  };

  const changeMonth = (offset) => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(next);
  };

  const changePeriod = (offset) => {
    const next = new Date(currentDate);
    if (viewMode === "day") next.setDate(currentDate.getDate() + offset);
    if (viewMode === "week") next.setDate(currentDate.getDate() + offset * 7);
    if (viewMode === "month") next.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(next);
  };

  const START_HOUR = 7;
  const END_HOUR = 22;
  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  const formatHour = (h) => {
    if (h === 0) return "12:00 AM";
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return "12:00 PM";
    return `${h - 12}:00 PM`;
  };

  const visibleDays = viewMode === "day" ? [currentDate] : getWeekDays(currentDate);

  const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #111184 0%, #070738 70%, #010736 100%)",
    color: "white",
    padding: "20px",
    gap: "24px",
    boxSizing: "border-box",
  };

  const mainSectionStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflow: "hidden",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  };

  const monthTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: "32px",
    margin: 0,
    color: "white",
  };

  const getArrowBtnStyle = (key) => ({
    background: hoveredKey === key ? "rgba(87, 35, 100, 0.3)" : "transparent",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    padding: "4px 10px",
    transition: "background 0.2s ease",
  });

  const switcherContainerStyle = {
    display: "flex",
    border: "2px solid #9FA1FF",
    borderRadius: "10px",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.06)", 
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.18)", 
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  };

  const getSwitcherBtnStyle = (mode) => {
    const isActive = viewMode === mode;
    const isHovered = hoveredKey === `mode-${mode}`;

    let bg = "transparent"; 
    let color = "#9FA1FF";    

    if (isActive) {
      bg = "#9FA1FF";        
      color = "white";  
    } else if (isHovered) {
      bg = "rgba(87, 35, 100, 0.3)"; 
    }

    return {
      padding: "8px 16px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "13px",
      background: bg,
      color,
      transition: "all 0.2s ease",
    };
  };

  return (
    <main style={pageStyle} className={jost.className}>
      <aside style={{ flexShrink: 0 }}>
        <MiniCalendar />
      </aside>

      <section style={mainSectionStyle}>
        <div style={topBarStyle}>
          <div style={monthTitleStyle} className={lalezar.className}>
            <button
              style={getArrowBtnStyle("month-prev")}
              onMouseEnter={() => setHoveredKey("month-prev")}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            <span>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button
              style={getArrowBtnStyle("month-next")}
              onMouseEnter={() => setHoveredKey("month-next")}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => changeMonth(1)}
            >
              &gt;
            </button>
          </div>

          <div style={switcherContainerStyle}>
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                style={getSwitcherBtnStyle(mode)}
                onMouseEnter={() => setHoveredKey(`mode-${mode}`)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => setViewMode(mode)}
              >
                {mode === "day" ? "Día" : mode === "week" ? "Semana" : "Mes"}
              </button>
            ))}
          </div>
        </div>

        {(viewMode === "week" || viewMode === "day") && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  background: "#9FA1FF",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "11px",
                  padding: "10px 6px",
                  borderRadius: "14px",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                GMT
              </div>

              <button
                style={getArrowBtnStyle("period-prev")}
                onMouseEnter={() => setHoveredKey("period-prev")}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => changePeriod(-1)}
              >
                &lt;
              </button>

              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
                  gap: "8px",
                  
                }}
              >
                {visibleDays.map((date) => {
                  const dateKey = formatDateKey(date);
                  const isSelected = dateKey === formatDateKey(currentDate);
                  const isHovered = hoveredKey === `day-card-${dateKey}`;
                  const dayName = DAYS_NAMES[(date.getDay() + 6) % 7];

                 let bg = "rgba(255, 255, 255, 0.06)"; 
                 let color = "white";                 
                 let border = "1px solid rgba(255, 255, 255, 0.18)"; 
                 
                 if (isSelected) {
                   bg = "rgba(159, 161, 255, 0.55)";   
                   color = "white";                  
                   border = "1px solid rgba(255, 255, 255, 0.45)"; 
                 } else if (isHovered) {
                   bg = "rgba(87, 35, 100, 0.45)";   
                   border = "1px solid rgba(255, 255, 255, 0.32)"; 
                 }
                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => setCurrentDate(date)}
                      onMouseEnter={() => setHoveredKey(`day-card-${dateKey}`)}
                      onMouseLeave={() => setHoveredKey(null)}
                      style={{
                        background: bg,
                        color,
                        border, 
                        backdropFilter: "blur(10px)",       
                        WebkitBackdropFilter: "blur(10px)", 
                        borderRadius: "12px",
                        padding: "8px 4px",
                        textAlign: "center",
                        cursor: "pointer",
                        fontSize: "13px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{dayName}</div>
                      <div>{date.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              <button
                style={getArrowBtnStyle("period-next")}
                onMouseEnter={() => setHoveredKey("period-next")}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => changePeriod(1)}
              >
                &gt;
              </button>
            </div>

            <div
              style={{
                flex: 1,
                maxHeight: "65vh",
                overflowY: "auto",
                border: "2px solid #9FA1FF",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.06)", 
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.18)", 
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `82px repeat(${visibleDays.length}, 1fr)`,
                    minHeight: "64px",
                    borderBottom: "1px solid rgba(159, 161, 255, 0.5)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      fontSize: "12px",
                      color: "#d8bfd8",
                      textAlign: "right",
                      paddingRight: "12px",
                      borderRight: "1px solid rgba(159, 161, 255, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {formatHour(hour)}
                  </div>

                  {visibleDays.map((date) => {
                    const dateKey = formatDateKey(date);
                    const cellKey = `cell-${dateKey}-${hour}`;
                    const isCellHovered = hoveredKey === cellKey;
                    const cellEvents = events.filter(
                      (ev) => ev.date === dateKey && ev.hour === hour
                    );

                    return (
                      <div
                        key={cellKey}
                        onMouseEnter={() => setHoveredKey(cellKey)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          borderRight: "1px solid rgba(159, 161, 255, 0.5)",
                          padding: "4px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          background: isCellHovered
                            ? "rgba(87, 35, 100, 0.3)"
                            : "transparent",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {cellEvents.map((ev) => {
                          const evKey = `event-${ev.id}`;
                          const isEvHovered = hoveredKey === evKey;
                        
                          return (
                            <div
                              key={ev.id}
                              onMouseEnter={() => setHoveredKey(evKey)}
                              onMouseLeave={() => setHoveredKey(null)}
                              style={{
                                background: isEvHovered
                                  ? "#9FA1FF"
                                  : "linear-gradient(90deg, #8b5cf6 0%, #9FA1FF 100%)",
                                color: "white", 
                                borderRadius: "999px",
                                padding: "3px 10px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                              }}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {viewMode === "month" && (
          <div
            style={{
              border: "1px solid #9FA1FF",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.06)", 
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.18)", 
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              padding: "12px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
                paddingBottom: "10px",
                borderBottom: "1px solid rgba(159, 161, 255, 0.3)",
              }}
            >
              {DAYS_NAMES.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
                marginTop: "10px",
              }}
            >
              {getMonthCells(currentDate).map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} style={{ minHeight: "85px" }} />;
                const dateKey = formatDateKey(date);
                const isDayHovered = hoveredKey === `month-day-${dateKey}`;
                const dayEvents = events.filter((ev) => ev.date === dateKey);

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      setCurrentDate(date);
                      setViewMode("day");
                    }}
                    onMouseEnter={() => setHoveredKey(`month-day-${dateKey}`)}
                    onMouseLeave={() => setHoveredKey(null)}
                    style={{
                      minHeight: "85px",
                      border: "1px solid rgba(159, 161, 255, 0.3)",
                      borderRadius: "10px",
                      padding: "6px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      background: isDayHovered
                        ? "rgba(87, 35, 100, 0.3)"
                        : "transparent",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "13px", color: "white" }}>
                      {date.getDate()}
                    </span>

                    {dayEvents.map((ev) => {
                      const monthEvKey = `month-ev-${ev.id}`;
                      const isMonthEvHovered = hoveredKey === monthEvKey;

                      return (
                        <div
                          key={ev.id}
                          onMouseEnter={() => setHoveredKey(monthEvKey)}
                          onMouseLeave={() => setHoveredKey(null)}
                          style={{
                            background: isMonthEvHovered ? "#9FA1FF" : "linear-gradient(90deg, #8b5cf6 0%, #9FA1FF 100%)",
                            color: "white",
                            borderRadius: "999px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}