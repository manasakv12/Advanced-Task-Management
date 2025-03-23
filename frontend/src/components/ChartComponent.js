import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ tasks = [] }) => {
  const taskStatusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const labels = Object.keys(taskStatusCounts);
  const dataValues = Object.values(taskStatusCounts);

  // Assigning dynamic colors
  const colors = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Task Status",
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Task Status Overview",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">📊 Task Chart</h2>
      {tasks.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p className="text-gray-500">No tasks available</p>
      )}
    </div>
  );
};

export default ChartComponent;
