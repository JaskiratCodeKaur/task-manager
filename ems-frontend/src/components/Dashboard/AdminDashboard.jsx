import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../main/Sidebar';

import {
  FaTasks, FaCheckCircle, FaSpinner, FaHourglassEnd
} from 'react-icons/fa';

import StatsCard from './StatsCard';
import MiniCalendar from './MiniCalendar';
import QuoteOfTheDay from './QuoteOfTheDay';
import TeamSection from './TeamSection';
import UpcomingEvents from './UpcomingEvents';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        navigate('/employee-dashboard');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const [tasksRes, usersRes, teamRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const tasks = tasksRes.data;
        setTaskCount(tasks.length);

        // Status breakdown
        const counts = tasks.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {});
        setTaskStatusData([
          { name: 'Pending', value: counts['pending'] || 0 },
          { name: 'In Progress', value: counts['in progress'] || 0 },
          { name: 'Completed', value: counts['completed'] || 0 },
        ]);

        const now = new Date();
        const overdue = tasks.filter(
          t => new Date(t.dueDate) < now && t.status !== 'completed'
        );
        setOverdueCount(overdue.length);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto space-y-10">
        <div class="mb-6 pb-3 border-b border-gray-300">
          <h1 className="text-3xl font-semibold text-gray-900 leading-tight mb-2">
            Welcome back, <span className="text-indigo-600">{user.name}</span>
          </h1>
        </div>
        
        <QuoteOfTheDay />

        {/* Stats cards */}
        <div className="flex flex-wrap gap-6">
         <StatsCard title="Total Tasks" icon={FaTasks} variant="default" statKey="totalTasks" />
          <StatsCard title="Completed" icon={FaCheckCircle} variant="success" statKey="completed" />
          <StatsCard title="In Progress" icon={FaSpinner} variant="warning" statKey="inProgress" />
          <StatsCard title="Overdue" icon={FaHourglassEnd} variant="destructive" statKey="overdue" />
        </div>

        {/* Team and Calendar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
         <div className="xl:col-span-2 space-y-6">
          <TeamSection />
          <UpcomingEvents />
        </div>
          <div className="xl:col-span-1">
            <MiniCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
