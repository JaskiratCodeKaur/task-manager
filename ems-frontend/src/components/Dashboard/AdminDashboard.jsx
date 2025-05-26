import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../main/Sidebar';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  FaTasks, FaUsers, FaCheckCircle, FaSpinner, FaHourglassEnd,
} from 'react-icons/fa';

const COLORS = ['#fbbf24', '#3b82f6', '#10b981'];

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [taskTrends, setTaskTrends] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);

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
        const [tasksRes, membersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const tasks = tasksRes.data;
        const members = membersRes.data.filter(user => user.role === 'employee');
        setTaskCount(tasks.length);
        setMemberCount(members.length);
        setRecentTasks(tasks.slice(-5).reverse());

        // Status counts
        const statusCounts = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});
        const pieData = [
          { name: 'Pending', value: statusCounts['pending'] || 0 },
          { name: 'In Progress', value: statusCounts['in progress'] || 0 },
          { name: 'Completed', value: statusCounts['completed'] || 0 },
        ];
        setTaskStatusData(pieData);

        // Overdue count
        const now = new Date();
        const overdue = tasks.filter(task => new Date(task.dueDate) < now && task.status !== 'completed');
        setOverdueCount(overdue.length);

        // Tasks created by date
        const trends = {};
        tasks.forEach(task => {
          const date = new Date(task.createdAt).toLocaleDateString();
          trends[date] = (trends[date] || 0) + 1;
        });
        setTaskTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name}</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <SummaryCard icon={<FaTasks />} label="Total Tasks" value={taskCount} color="indigo" />
          <SummaryCard icon={<FaCheckCircle />} label="Completed" value={taskStatusData.find(t => t.name === 'Completed')?.value || 0} color="green" />
          <SummaryCard icon={<FaSpinner />} label="In Progress" value={taskStatusData.find(t => t.name === 'In Progress')?.value || 0} color="blue" />
          <SummaryCard icon={<FaHourglassEnd />} label="Overdue" value={overdueCount} color="red" />
          <SummaryCard icon={<FaUsers />} label="Team Members" value={memberCount} color="purple" />
        </div>

        {/* Charts and Table */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Task Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Tasks Created Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Assigned To</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.assignedTo?.name || 'Unassigned'}</td>
                  <td className="px-4 py-2 capitalize">{task.status}</td>
                  <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentTasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No recent tasks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// SummaryCard component
const SummaryCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
    <div className={`text-3xl text-${color}-500`}>{icon}</div>
    <div>
      <p className="text-gray-500">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
