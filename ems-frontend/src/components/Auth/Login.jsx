import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        setError('Unknown user role');
      }

      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: Login Form */}
      <div className=" w-full md:w-1/2 flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
            initial={{ x: 0 }}
            animate={{
              x: [0, 10, -10, 0], // moves right, then left, then back to center
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h2 className="text-3xl font-bold text-emerald-700 flex items-center">
              Welcome Back
            </h2>
          </motion.div>

            <p className="text-gray-500 mt-1">Login to continue to your dashboard</p>
          </motion.div>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border text-black border-emerald-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border text-black border-emerald-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Log In
            </button>
          </motion.form>
        </motion.div>
      </div>

      {/* Right: Image or Brand */}
      <motion.div
        className="hidden md:block md:w-3/4 bg-gray-50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/src/images/login_image.jpeg"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900 opacity-60" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h1 className="text-white text-4xl font-bold">StudyTogether Inc.</h1>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
