import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../main/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [visibility, setVisibility] = useState({
    new: false,
    confirm: false,
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({ name: storedUser.name, email: storedUser.email });
    }
  }, []);

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const { newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      return setErrorMsg("New passwords don't match");
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { newPassword,confirmPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold text-emerald-600 mb-6">Account Settings</h2>

          {/* Profile Info */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={user.name}
                   readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                   readOnly
                  className="w-full border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-emerald-400 px-4 py-2 bg-gray-100"
                />
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold transition-all"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {['new', 'confirm'].map((type) => {
                  const label = type === 'new' ? 'New Password' : 'Confirm New Password';
                  const field = type === 'new' ? 'newPassword' : 'confirmPassword';
                  return (
                    <div key={type} className="relative">
                      <label className="block text-sm font-medium mb-1">{label}</label>
                      <input
                        type={visibility[type] ? 'text' : 'password'}
                        value={passwordData[field]}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, [field]: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
                        required
                      />
                      <span
                        onClick={() => toggleVisibility(type)}
                        className="absolute top-9 right-3 cursor-pointer text-gray-500"
                      >
                        {visibility[type] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  );
                })}

                {successMsg && <p className="text-green-600">{successMsg}</p>}
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ newPassword: '', confirmPassword: '' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Delete Account */}
          <section>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition-all"
            >
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
