const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.get('/upcoming', auth, taskController.getUpcomingTasks);
router.get('/my-tasks', auth, taskController.getMyTasks);

// Create task (admin only)
router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, category, assignedTo } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create tasks.' });
  }

  if (!title || !description || !dueDate || !category || !assignedTo) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      category,
      assignedTo,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks (admin: all, employee: own) - with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);

    res.status(200).json({
      tasks,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, taskController.getTaskById);

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // configure destination as needed

// Patch route with multer middleware to handle multipart/form-data
router.patch('/:id/status', auth, upload.none(), async (req, res) => {
  const { status, notes } = req.body;

  const allowedStatuses = ['in progress', 'completed', 'declined'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Security: Only assigned employee can update
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this task.' });
    }

    task.status = status;
    task.notes = notes || '';
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
