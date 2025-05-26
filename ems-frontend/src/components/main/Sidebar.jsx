import React from 'react';
import {
  FaTasks,
  FaUserPlus,
  FaUsers,
  FaBuilding,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">
        Employee MS
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3">
        <button onClick={() => navigate('/admin-dashboard')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaThLarge /> Dashboard
        </button>
        <button onClick={() => navigate('/create-task')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaTasks /> Create Task
        </button>
        <button onClick={() => navigate('/create-member')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaUserPlus /> Add Member
        </button>
        <button onClick={() => navigate('/view-members')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaBuilding /> Employees
        </button>
        <button onClick={() => navigate('/all-tasks')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaTasks /> Tasks
        </button>
        <button onClick={() => navigate('/settings')} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 w-full text-left">
          <FaCogs /> Settings
        </button>
      </nav>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 p-4 border-t border-gray-700 hover:bg-gray-700 w-full justify-center"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
