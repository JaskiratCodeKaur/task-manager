const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User'); // Adjust path if needed
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root route (health check)
app.get('/', (req, res) => {
    res.send('Employment Management System API is running.');
});
const mongoose = require('mongoose');


mongoose.connection.once('open', async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections in your MongoDB database:');
  collections.forEach(col => console.log(`- ${col.name}`));

  // ✅ List all user documents
  const users = await User.find();
  console.log('Users in database:');
  users.forEach(user => {
    console.log(`- ${user.name} (${user.email}) | Role: ${user.role} | (${user.password})`);
  });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use('/api/tasks', require('./routes/taskRoutes'));
const departmentRoutes = require('./routes/departments');
app.use('/api/departments', departmentRoutes);

