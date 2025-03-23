const express = require('express');
const http = require('http'); // ✅ Required for Socket.io
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const socketIo = require('socket.io'); // ✅ Import socket.io

dotenv.config();
const app = express();
const server = http.createServer(app); // ✅ Create HTTP server for Socket.io
const io = socketIo(server, { cors: { origin: '*' } }); // ✅ Enable CORS

const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/task_manager_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// **Socket.io Setup**
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// **User Schema**
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// **Register Endpoint**
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully!', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// **Login Endpoint**
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// **Task Schema**
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  status: { type: String, default: 'Pending' },
  attachments: [String],
});

const Task = mongoose.model('Task', taskSchema);

// **File Upload Configuration**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// **Create Task Endpoint**
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    req.io.emit('taskCreated', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// **Get All Tasks**
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// **Assign Task Endpoint**
app.put('/api/tasks/:id/assign', async (req, res) => {
  const { assignedTo } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    req.io.emit('taskAssigned', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// **File Upload Endpoint**
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const task = await Task.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.attachments.push(req.file.path);
    await task.save();
    res.status(201).json({ message: 'File uploaded and saved', filePath: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// **Delete Task Endpoint** ✅ Fixed
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Log the ID being deleted
    console.log("Deleting task with ID:", id);

    // Ensure ID is valid before deleting
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.io.emit("taskUpdated", updatedTask); // Emit real-time event
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});



// **Start Server**
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
