import React, { useState, useEffect } from 'react';
import Sidebar from '../main/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTask = () => {
  const navigate = useNavigate();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [category, setCategory] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [taskCreated, setTaskCreated] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/auth/members', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch members', error);
      }
    };

    fetchMembers();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      return;
    }

    if (!taskTitle || !taskDate || !assignTo || !category || !taskDescription) {
      setError('Please fill all required fields.');
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDate,
      assignedTo: assignTo,
      category,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', newTask, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Task created successfully!');
      setTaskCreated(true);
      setTaskTitle('');
      setCategory('');
      setAssignTo('');
      setTaskDate('');
      setTaskDescription('');
    } catch (error) {
      setError(error.response?.data?.message || 'Task creation failed.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold text-emerald-600 mb-6">Create New Task</h2>

          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          {successMessage && <p className="text-green-600 mb-4 font-medium">{successMessage}</p>}

          {taskCreated ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-emerald-600 mb-4">✅ Task successfully created!</h3>
              <button
                onClick={() => setTaskCreated(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-md"
              >
                Create Another Task
              </button>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Design Login Page"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select Employee</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Design, Development"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Description *</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Write the task details here..."
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md font-semibold transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTask;
