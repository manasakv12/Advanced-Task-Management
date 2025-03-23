import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadAttachment from "../components/UploadAttachment";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";
import AssignTask from "../components/AssignTask";
import ChartComponent from "../components/ChartComponent";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]); 
  const [selectedTaskId, setSelectedTaskId] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setSelectedTaskId(newTask._id);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task");
    }
  };

  const handleUploadFile = async (file) => {
    if (!selectedTaskId) {
      alert("Please select or create a task before uploading files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", selectedTaskId);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      const result = await response.json();
      alert(`File uploaded successfully! Saved at: ${result.filePath}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const handleAssignTask = async (taskId, assignedUser) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: assignedUser }),
      });
  
      if (!response.ok) throw new Error("Failed to assign task");
  
      const updatedTask = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, assignedTo: updatedTask.assignedTo } : task
        )
      );
  
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task");
    }
  };
  
  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      console.log("Updating Task ID:", taskId); // Debugging
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update task");
      }
  
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
  
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.message);
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">📋 Task Dashboard</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? "Hide Task Form" : "➕ Create Task"}
        </button>

        <button
          onClick={() => setShowAssignTask(!showAssignTask)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showAssignTask ? "Hide Assign Task" : "📌 Assign Task"}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-auto"
        >
          🚪 Logout
        </button>
      </div>

      {showForm && <TaskForm onSave={handleCreateTask} onClose={() => setShowForm(false)} />}
      {showAssignTask && <AssignTask tasks={tasks} onAssign={handleAssignTask} onClose={() => setShowAssignTask(false)} />}
      {loading && <p className="text-gray-500">Loading tasks...</p>}

      {!loading && (
        <div className="mt-6">
          <TaskList
            tasks={tasks}
            onSelectTask={(id) => setSelectedTaskId(id)}
            onDeleteTask={handleDeleteTask} 
            onUpdateTask={handleUpdateTask}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TaskStats tasks={tasks} />
        <ChartComponent tasks={tasks} />
      </div>

      {selectedTaskId && (
        <div className="mt-6">
          <UploadAttachment onUpload={handleUploadFile} taskId={selectedTaskId} />
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
