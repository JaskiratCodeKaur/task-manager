import React, { useEffect, useState } from 'react';
import Header from '../main/Header';
import CreateTask from '../main/CreateTask';
import AllTask from '../main/AllTask';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/login');
  };

  const handleCreateMember = () => {
    // Your create member logic or route
    navigate('/create-member');
  };

  const handleCreateTask = () => {
    // Your create task logic or route
    navigate('/create-task');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        navigate('/employee-dashboard'); // Redirect if not admin
      }
    } else {
      navigate('/'); // Redirect to login if no user
    }
  }, [navigate]);

  if (!user) return null; // Prevent rendering before user is loaded

  return (
    <div className="h-screen w-full p-10 overflow-auto">
      <Header username={user.name} 
        onLogout={handleLogout}
        onCreateMember={handleCreateMember}
        onCreateTask={handleCreateTask}
      />
      <div className="mt-6">
        <CreateTask />
        <AllTask />
      </div>
    </div>
  );
};

export default AdminDashboard;
