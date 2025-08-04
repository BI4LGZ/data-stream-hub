import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData, categories }) => {
  const colors = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#8B5CF6",
  ];

  const data = {
    labels: chartData.map((d) => format(new Date(d.timestamp), "MM-dd HH:mm")),
    datasets: categories.map((category, index) => ({
      label: category,
      data: chartData.map((d) => d.data[category]),
      borderColor: colors[index % colors.length],
      backgroundColor: `${colors[index % colors.length]}33`,
      fill: false,
      tension: 0.1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "数据随时间变化图",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "时间",
        },
      },
      y: {
        title: {
          display: true,
          text: "值",
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
