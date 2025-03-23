import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useSocket from './hooks/useSocket';
import HomePage from "./pages/HomePage";
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/TaskDashboard';

function App() {
  useSocket(); // Initialize WebSocket connection

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<HomePage />} /> 

        {/* Other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
