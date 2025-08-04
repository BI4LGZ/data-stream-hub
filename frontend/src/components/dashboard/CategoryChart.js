import React, { useState, useEffect, useCallback } from "react";
import apiService from "../../services/apiService";
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
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { subDays, format } from "date-fns";
import DatePicker from "react-datepicker";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Loader2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const CategoryChart = ({ apiKey, category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };
      const response = await apiService.getDataForApiKey(apiKey.id, params);
      // Filter data for the specific category
      const categoryData = response.data
        .filter(
          (d) => d.data[category] !== undefined && d.data[category] !== null
        )
        .map((d) => ({
          x: new Date(d.timestamp),
          y: d.data[category],
        }));
      setData(categoryData);
    } catch (err) {
      // Error is handled by toast in parent components
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey.id, category, startDate, endDate]);

  useEffect(() => {
    fetchChartData();
    // Set up polling
    const intervalId = setInterval(fetchChartData, 30000); // Poll every 30 seconds
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchChartData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) =>
            format(new Date(context[0].parsed.x), "yyyy-MM-dd HH:mm:ss"),
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "yyyy-MM-dd HH:mm:ss",
          displayFormats: {
            hour: "HH:mm",
            day: "MM-dd",
          },
        },
        grid: { color: "rgba(128, 128, 128, 0.2)" },
        ticks: { color: "rgb(var(--color-secondary))" },
      },
      y: {
        grid: { color: "rgba(128, 128, 128, 0.2)" },
        ticks: { color: "rgb(var(--color-secondary))" },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: category,
        data: data,
        borderColor: "rgb(var(--color-primary))",
        backgroundColor: "rgba(var(--color-primary), 0.2)",
        tension: 0.2,
        pointBackgroundColor: "rgb(var(--color-primary))",
        fill: true,
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{category} 数据趋势</CardTitle>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-input rounded-md shadow-sm w-32 bg-card text-card-foreground border-secondary/20"
          />
          <span className="text-secondary">到</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-input rounded-md shadow-sm w-32 bg-card text-card-foreground border-secondary/20"
          />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : data.length > 0 ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-secondary">此时间范围内无数据</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
