import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/main/Sidebar';
import { useNavigate } from 'react-router-dom';

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/members', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(response.data);
      } catch (err) {
        setError('❌ Failed to fetch members');
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-emerald-600 mb-6">Team Members</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Created At</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-t text-black">
                  <td className="px-6 py-4">{member.name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 capitalize">{member.role}</td>
                  <td className="px-6 py-4">
                    {member.department ? member.department.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4">{new Date(member.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    No members found.
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

export default ViewMembers;
