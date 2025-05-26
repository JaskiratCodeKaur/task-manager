import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarEmployee from '../main/SidebarEmployee';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(response.data);
      setNote(response.data.notes || '');
      setAttachments(response.data.attachments || []);

      // If the task is responded to
      if (['in progress', 'completed', 'declined'].includes(response.data.status)) {
        setHasResponded(true);
      }
    } catch (err) {
      console.error('Failed to fetch task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleAction = async (action) => {
    const token = localStorage.getItem('token');
    const statusMap = {
      accept: 'in progress',
      complete: 'completed',
      decline: 'declined',
    };

    const status = statusMap[action];
    if (!status) return;

    try {
      setActionInProgress(true);

      const formData = new FormData();
      formData.append('status', status);
      formData.append('notes', note);
      attachments.forEach((file) => formData.append('attachments', file));

      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      await fetchTask(); // Refresh task with updated data
      if (action === 'complete') {
        setHasResponded(true);
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const isCompleted = task?.status === 'completed';

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <SidebarEmployee />
        <main className="flex-1 flex items-center justify-center text-lg text-gray-600">
          Loading task details...
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-100">
        <SidebarEmployee />
        <main className="flex-1 flex items-center justify-center text-lg text-red-600">
          Failed to load task. Please try again later.
        </main>
      </div>
    );
  }

  const assignedByText =
    typeof task.createdBy === 'object'
      ? task.createdBy.name || 'N/A'
      : task.createdBy || 'N/A';

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarEmployee />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Task Details</h2>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4 mb-6">
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span className="capitalize">{task.status}</span></p>
          <p><strong>Category:</strong> {task.category || 'N/A'}</p>
          <p><strong>Assigned By:</strong> {assignedByText}</p>
        </div>

        {/* Notes Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Notes / Comments:</label>
          <textarea
            disabled={isCompleted}
            className="w-full border border-gray-300 rounded p-3 text-gray-800 disabled:opacity-60 bg-gray-100"
            rows="4"
            placeholder="Write your notes or summary here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* File Upload / View Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2 text-gray-700">
            {isCompleted ? 'Submitted Attachments:' : 'Attach Files:'}
          </label>

          {isCompleted ? (
            task.attachments && task.attachments.length > 0 ? (
              <ul className="list-disc list-inside text-blue-600">
                {task.attachments.map((fileUrl, idx) => (
                  <li key={idx}>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {fileUrl.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attachments submitted.</p>
            )
          ) : (
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded px-3 py-2"
              disabled={isCompleted}
            />
          )}
        </div>

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="flex space-x-4 mb-4">
            {!hasResponded ? (
              <>
                <button
                  onClick={() => handleAction('accept')}
                  disabled={actionInProgress}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction('decline')}
                  disabled={actionInProgress}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                >
                  Decline
                </button>
              </>
            ) : (
              task.status === 'in progress' && (
                <button
                  onClick={() => handleAction('complete')}
                  disabled={actionInProgress}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                >
                  Mark as Complete
                </button>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskDetailsPage;
