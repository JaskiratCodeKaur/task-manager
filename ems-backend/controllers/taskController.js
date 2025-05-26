const Task = require('../models/Task');

exports.getUpcomingTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ensure beginning of day

    const query = {
      dueDate: { $gte: today },
      ...(req.user.role === 'employee' && { assignedTo: req.user.id }),
    };

    const tasks = await Task.find(query)
      .sort({ dueDate: 1 }) // sort by closest deadline
      .select('title dueDate status'); // keep it lightweight

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching upcoming tasks:', err);
    res.status(500).json({ message: 'Server error fetching upcoming tasks' });
  }
};


// @desc Create a task (admin only)
exports.createTask = async (req, res) => {
  const { title, description, dueDate, category, assignedTo } = req.body;

  if (!title || !description || !dueDate || !assignedTo) {
    return res.status(400).json({ message: 'Missing required fields' });
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
    res.status(400).json({ message: err.message });
  }
};

// @desc Get tasks (admin sees all, employee sees own) with pagination
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user.id };

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query)
    ]);

    res.json({
      tasks,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('createdBy', 'name email')
;

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Restrict access if not admin and not assigned to the user
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Update task status (employee accept/decline or complete)
exports.updateTaskStatus = async (req, res) => {
  const { status, notes } = req.body;

  const allowedStatuses = ['in progress', 'completed', 'declined'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Employees can only update their own task
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.status = status;
    task.notes = notes || '';
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyTasks = async (req, res) => {
  const employeeId = req.user.id;
  const { page = 1, limit = 5 } = req.query;

  try {
    const tasks = await Task.find({ assignedTo: employeeId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Task.countDocuments({ assignedTo: employeeId });

    res.json({ tasks, totalCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


