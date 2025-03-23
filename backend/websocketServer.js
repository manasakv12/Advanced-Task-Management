// backend/websocketServer.js
const WebSocket = require('ws');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Define a schema and model
const dataSchema = new mongoose.Schema({
  type: String,
  data: String,
});

const DataModel = mongoose.model('Data', dataSchema);

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Save to database
    saveToDatabase(message)
      .then(() => {
        console.log('Data saved to database');
      })
      .catch((err) => {
        console.error('Failed to save data:', err);
      });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to save data to MongoDB
async function saveToDatabase(data) {
  try {
    const parsedData = JSON.parse(data); // Parse the incoming message
    const newData = new DataModel(parsedData);
    await newData.save();
    console.log('Data saved to database:', parsedData);
  } catch (err) {
    console.error('Failed to save data:', err);
  }
}