import React, { useState } from "react";

const AssignTask = ({ tasks, onAssign, onClose }) => {
  const [taskId, setTaskId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(taskId, assignedTo); // Pass taskId and assignedTo to the parent component
    onClose(); // Close the form
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Assign Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Selection */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Select Task
            </label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            >
              <option value="">Select a task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Assign To
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
