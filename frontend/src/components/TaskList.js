import { Trash, Edit } from "lucide-react";
import { useState } from "react";

const TaskList = ({ tasks, onSelectTask, onDeleteTask, onUpdateTask }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditedData({ title: task.title, description: task.description, status: task.status });
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = (taskId) => {
    onUpdateTask(taskId, editedData);
    setEditingTask(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📌 Task List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-xl transition duration-200"
          >
            <div className="flex justify-between items-start">
              {editingTask === task._id ? (
                <input
                  type="text"
                  name="title"
                  value={editedData.title}
                  onChange={handleChange}
                  className="border p-1 w-full rounded"
                />
              ) : (
                <h3
                  className="text-lg font-semibold cursor-pointer text-blue-600 hover:underline"
                  onClick={() => onSelectTask(task._id)}
                >
                  {task.title}
                </h3>
              )}

              <div className="flex gap-2">
                <button onClick={() => handleEditClick(task)} className="text-green-500 hover:text-green-700">
                  <Edit size={20} />
                </button>
                <button onClick={() => onDeleteTask(task._id)} className="text-red-500 hover:text-red-700">
                  <Trash size={20} />
                </button>
              </div>
            </div>

            {editingTask === task._id ? (
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleChange}
                className="border p-1 w-full mt-2 rounded"
              />
            ) : (
              <p className="text-gray-600 mt-1">{task.description || "No description"}</p>
            )}

            <p className="mt-2 text-sm text-gray-500">
              <strong>Assigned to:</strong> {task.assignedTo || "Unassigned"}
            </p>

            {editingTask === task._id ? (
              <select
                name="status"
                value={editedData.status}
                onChange={handleChange}
                className="border p-1 w-full rounded mt-2"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            ) : (
              <span
                className={`inline-block px-3 py-1 mt-2 text-sm font-semibold rounded-full ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            )}

            <div className="mt-3">
              {task.attachments.length > 0 ? (
                task.attachments.map((file, index) => (
                  <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline block text-sm">
                    Attachment {index + 1}
                  </a>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No attachments</span>
              )}
            </div>

            {editingTask === task._id && (
              <button
                onClick={() => handleSave(task._id)}
                className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
