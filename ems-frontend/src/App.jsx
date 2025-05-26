import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Auth/Login';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CreateMember from "./components/UserCreation/CreateMember";
import CreateTask from "./components/UserCreation/CreateTask";
import ViewMembers from './context/ViewMembers';
import SettingsPage from './components/main/Settings';
import EmployeeTasksPage from './components/TaskList/EmployeeTasksPage';
import CalendarPage from './components/calendars/CalendarPage';
import TaskDetailsPage from './components/TaskList/TaskDetailsPage';
import AllTasks from './components/TaskList/AllTasks';
import SettingsEmployee from './components/main/SettingsEmployee';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/create-member" element={<CreateMember />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/view-members" element={<ViewMembers />} />
        <Route path="/all-tasks" element={<AllTasks />} />
        <Route path="/employee-tasks" element={<EmployeeTasksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/employee-calendar" element={<CalendarPage />} />
        <Route path="/task-details/:taskId" element={<TaskDetailsPage />} />
        <Route path="/settings-page" element={<SettingsEmployee />} />
      </Routes>
    </Router>
  );
};

export default App;
