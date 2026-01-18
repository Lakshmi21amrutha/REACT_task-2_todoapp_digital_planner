import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [form, setForm] = useState({ title: '', date: '', time: '', priority: 'low', notes: '' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notebook-tasks")) || [];// Retrieve saved tasks
    setTasks(saved);// Load saved tasks on mount
  }, []);

  useEffect(() => {
    localStorage.setItem("notebook-tasks", JSON.stringify(tasks));// Save tasks to local storage
  }, [tasks]);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();// Calculate days in month
  const monthName = viewDate.toLocaleString('default', { month: 'long' });// Get month name

  const changeMonth = (offset) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1)); // Change the view date
  };

  const addTask = () => {
    if (!form.title || !form.date) return alert("Please fill in the title and date!");
    setTasks([...tasks, { ...form, id: Date.now(), completed: false }]); // Add new task
    setForm({ title: '', date: '', time: '', priority: 'low', notes: '' });// Reset form
  };

  if (!isStarted) {
    return (
      <div className="landing-area">
        <div className="landing-card">
          <h1 className="handwritten">Digital Planner</h1>
          <p className="hero-subtitle">A classic spiral notebook for your modern tasks.</p>
          <button className="open-btn" onClick={() => setIsStarted(true)}>Open My Book</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-canvas">
      <div className="controls">
        <div className="toggle-nav">
          <button className={!showCalendar ? "active" : ""} onClick={() => setShowCalendar(false)}>📓 Tasks</button>
          <button className={showCalendar ? "active" : ""} onClick={() => setShowCalendar(true)}>📅 Calendar</button>
        </div>
        <button className="info-trigger" onClick={() => setShowInfo(true)}>ℹ️ Info</button>
      </div>

      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-sheet" onClick={e => e.stopPropagation()}>
            <button className="close-sheet" onClick={() => setShowInfo(false)}>×</button>
            <h2>Notebook Features</h2>
            <div className="feat-list">
              <div className="feat-item"><span className="dot dot-high"></span> <strong>Red:</strong> High Priority</div>
              <div className="feat-item"><span className="dot dot-medium"></span> <strong>Orange:</strong> Mid Priority</div>
              <div className="feat-item"><span className="dot dot-low"></span> <strong>Yellow:</strong> Low Priority</div>
            </div>
            <p>Your data is saved automatically in this browser.</p>
          </div>
        </div>
      )}

      <div className="notebook-container">
        <div className="spiral-rings">
          {[...Array(9)].map((_, i) => <div key={i} className="metal-ring"></div>)}
        </div>

        <div className="notebook-pages">
          <div className="page page-left">
            <h2 className="handwritten">New Entry</h2>
            <div className="form-ui">
              <input type="text" placeholder="Task Title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              <div className="row">
                <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <textarea placeholder="Write notes here..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              <button className="ink-btn" onClick={addTask}>Seal the Page</button>
            </div>
          </div>

          <div className="page page-right">
            {showCalendar ? (
              <div className="calendar-ui">
                <div className="cal-head">
                  <button onClick={() => changeMonth(-1)}>◀</button>
                  <h3>{monthName} {currentYear}</h3>
                  <button onClick={() => changeMonth(1)}>▶</button>
                </div>
                <div className="cal-grid">
                  {['S','M','T','W','T','F','S'].map((dayLabel, index) => (
                    <div key={`head-${index}`} className="cal-day-label">{dayLabel}</div>
                  ))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayTasks = tasks.filter(t => t.date === dateStr);
                    return (
                      <div key={i} className="cal-day">
                        <span className="day-num">{day}</span>
                        <div className="dot-strip">
                          {dayTasks.map(t => <div key={t.id} className={`dot dot-${t.priority}`}></div>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="list-ui">
                <h2 className="handwritten">Tasks</h2>
                <div className="task-scroller">
                  {tasks.map(t => (
                    <div key={t.id} className={`retro-card ${t.priority}`}>
                      <div className="card-main">
                        <input type="checkbox" checked={t.completed} onChange={() => setTasks(tasks.map(x => x.id === t.id ? {...x, completed: !x.completed} : x))} />
                        <span className={t.completed ? 'strike' : ''}>{t.title}</span>
                        <button className="del-btn" onClick={() => setTasks(tasks.filter(x => x.id !== t.id))}>×</button>
                      </div>
                      <div className="card-meta">{t.date} | {t.time}</div>
                    </div>
                  ))}
                  {tasks.length === 0 && <p className="empty">The book is empty...</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;