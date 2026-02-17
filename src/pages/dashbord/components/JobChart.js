import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/**
 * JobChart Component
 * @param {("Day"|"Week"|"Month")} period
 */
const JobChart = ({ period = "Week" }) => {
  const chartConfig = useMemo(() => {
    const configs = {
      Day: {
        labels: ["Shift 1", "Shift 2", "Shift 3"],
        data: [12, 18, 9],
      },
      Week: {
        labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
        data: [12, 19, 8, 15, 22, 17, 10],
      },
      Month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [55, 78, 64, 90],
      },
    };

    return configs[period];
  }, [period]);

  const getBackgroundColors = (values) => {
    const sorted = [...values].sort((a, b) => b - a);

    return values.map((value) => {
      const rank = sorted.indexOf(value);

      if (rank === 0) return "#247cffbf";   // darkest
      if (rank === 1) return "#5b9dffdb";   // medium
      return "#49a2ff6b";                   // lightest
    });
  };

  const maxValue = Math.max(...chartConfig.data);

  const data = {
    labels: chartConfig.labels,
    datasets: [
      {
        label: "Bookings",
        data: chartConfig.data,
        backgroundColor: getBackgroundColors(chartConfig.data),
        borderColor: "#007bff",
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 121,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
        x: {
       ticks: {
          color: "#adacac", 
        },
        grid: { display: false },
      },
    y: {
      beginAtZero: true,
      grid: {
        color: "#ddd" ,
      },
      ticks: {
        stepSize: period==="Month"?20 : period==="Week"?10: 5
      },
    },
  },
};
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default JobChart;
