import React, { useEffect, useState } from 'react';
import SidebarEmployee from '../main/SidebarEmployee';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-400 text-yellow-900',
  'in progress': 'bg-blue-400 text-blue-900',
  completed: 'bg-green-400 text-green-900',
  declined: 'bg-red-400 text-red-900',
};

const EmployeeTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pageSize] = useState(5);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
    const res = await axios.get(
      `http://localhost:5000/api/tasks/my-tasks?page=${currentPage}&limit=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Employee tasks:', res.data);

    const taskList = Array.isArray(res.data.tasks) ? res.data.tasks : [];
    setTasks(taskList);
    setTotalTasks(res.data.totalCount || 0);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const totalPages = Math.ceil(totalTasks / pageSize);

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarEmployee />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h2>

        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[task.status] || 'bg-gray-200 text-gray-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => navigate(`/task-details/${task._id}`)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No tasks assigned.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeTasksPage;
