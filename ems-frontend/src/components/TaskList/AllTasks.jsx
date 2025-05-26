import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../main/Sidebar';
import { useNavigate } from 'react-router-dom';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const fetchTasks = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setError('No token found. Please login.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Log to inspect the actual response structure
    console.log('Tasks Response:', response.data);

    // Adjust based on structure (either response.data.tasks or response.data)
    const taskList = Array.isArray(response.data) ? response.data : response.data.tasks;
    setTasks(taskList);

  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch tasks');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-emerald-600 mb-6">All Tasks</h1>

          {loading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500 font-medium">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-600">No tasks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 rounded-md">
                <thead className="bg-emerald-100 text-emerald-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Assigned To</th>
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Created By</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {tasks.map((task, index) => (
                    <tr
                      key={task._id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-4 font-medium">{task.title}</td>
                      <td className="px-4 py-4">{task.category}</td>
                      <td className="px-4 py-4">{task.assignedTo?.name || 'Unassigned'}</td>
                      <td className="px-4 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'in progress'
                              ? 'bg-yellow-100 text-yellow-700'
                              : task.status === 'declined'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {task.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">{task.createdBy?.name || 'N/A'}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/admin/tasks/${task._id}`)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllTasks;
