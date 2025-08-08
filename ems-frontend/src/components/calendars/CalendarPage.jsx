import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';

import SidebarEmployee from '../main/SidebarEmployee';
import Sidebar from '../main/Sidebar'; // import your admin sidebar

import '../calendars/custom-calendar.css';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role.toLowerCase());
      setUserId(user._id || user.id);
    }
  }, []);

  useEffect(() => {
    if (role) {
      fetchTasks();
    }
  }, [role]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      let url = 'http://localhost:5000/api/tasks/upcoming';
      if (role === 'employee') {
        url = `http://localhost:5000/api/tasks/assigned/${userId}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data) ? response.data : response.data.tasks || [];
      setTasks(data);
      filterTasksByDate(new Date(), data);
    } catch (err) {
      console.error('Calendar fetch error:', err);
    }
  };

  const filterTasksByDate = (date, allTasks = tasks) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const filtered = allTasks.filter(
      task => format(new Date(task.dueDate), 'yyyy-MM-dd') === dateStr
    );
    setSelectedDateTasks(filtered);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    filterTasksByDate(date);
  };

  // Pick sidebar component dynamically
  const SidebarComponent = role === 'admin' ? Sidebar : SidebarEmployee;

  return (
    <div className="flex min-h-screen">
      <SidebarComponent /> {/* Sidebar rendered here */}

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">📅 Task Calendar</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-lg overflow-hidden shadow-xl bg-white p-6">
            <Calendar
              onChange={onDateChange}
              value={selectedDate}
              className="w-full big-calendar"
              tileContent={({ date }) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const hasTask = tasks.some(
                  task => format(new Date(task.dueDate), 'yyyy-MM-dd') === dateStr
                );
                return hasTask ? <div className="dot"></div> : null;
              }}
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">
              Tasks on {format(selectedDate, 'PPP')}
            </h3>
            {selectedDateTasks.length > 0 ? (
              <ul className="space-y-4">
                {selectedDateTasks.map(task => (
                  <li key={task._id} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded shadow">
                    <p className="text-lg font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">Due: {format(new Date(task.dueDate), 'PPPP')}</p>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-semibold">{task.status}</span>
                    </p>
                    {role === 'admin' && task.assignedTo && (
                      <p className="text-sm text-gray-600">
                        Assigned To: <span className="font-semibold">{task.assignedTo.name}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">No tasks due on this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
