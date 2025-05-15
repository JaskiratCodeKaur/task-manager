import React, { useEffect, useState } from 'react';

const Header = ({ onLogout, onCreateMember, onCreateTask }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }
  }, []);

  return (
    <header className="bg-[#1c1c1c] shadow-sm px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold text-emerald-600">Company name or logo</div>
        <div className="text-gray-500">Admin Dashboard</div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm text-gray-500">Welcome back,</div>
          <div className="text-lg font-semibold text-white-800">{userName || 'User'}</div>
        </div>

        <button onClick={onCreateMember} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
          Create Member
        </button>
        <button onClick={onCreateTask} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
          Create Task
        </button>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
