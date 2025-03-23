import React from "react";

const TaskStats = ({ tasks = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const pendingTasks = totalTasks - (completedTasks + inProgressTasks);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-96">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Task Statistics</h2>
      <div className="space-y-3">
        <p className="text-gray-600 text-md">
          📌 <strong>Total Tasks:</strong> {totalTasks}
        </p>
        <p className="text-green-600 font-medium">
          ✅ <strong>Completed:</strong> {completedTasks}
        </p>
        <p className="text-yellow-500 font-medium">
          🔄 <strong>In Progress:</strong> {inProgressTasks}
        </p>
        <p className="text-red-500 font-medium">
          ⏳ <strong>Pending:</strong> {pendingTasks}
        </p>
      </div>
    </div>
  );
};

export default TaskStats;
