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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JobChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Jobs",
      data: [12, 19, 8, 15],
      backgroundColor: [   
        "#247cffbf", // Mar (لون مختلف)
        "#247cffbf", // Apr (لون مختلف)
        "#007bff34", // Jan
        "#007bff33", // Feb
 
      ],
      borderColor: [
        "#007bff", 
        "#007bff",
        "#007bff", 
        "#007bff"
      ],
      borderWidth: 1, // سمك الإطار
      borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // إخفاء الليجند
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
        x: {
        grid: { display: false },
      },
    y: {
      beginAtZero: true,
      grid: {
        color: "#ddd", // لون خطوط الشبكة للمحور Y
      },
      ticks: {
        stepSize: 5,
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
