import { Box, Typography, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import {
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

 function EarningsOverTimeSection() {
  const [range, setRange] = useState("Weekly");

  const chartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        data: [40, 45, 60, 55, 75, 60, 90, 70, 20, 55, 45, 42],
        fill: true,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.25)",
        tension: 0.45,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#eef2f7" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <Box>
      {/* Chart Card ONLY */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "18px",
        //   border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          p: 2.5,
        //   height: 300,
        }}
      >
        <Box sx={{ height: 230 }}>
          <Line data={chartData} options={options} />
        </Box>

      </Card>
        <Typography
          fontSize={12}
          color="text.secondary"
          textAlign="center"
          mt={1}
        >
          Aggregated earnings (mock data)
        </Typography>
    </Box>
  );
}


const ranges = ["Daily", "Weekly", "Monthly"];

  function EarningsRangeTabs({ value = "Weekly", onChange }) {
  return (
    <Stack direction="row" spacing={3} alignItems="center" mb={1.5}>
      {ranges.map((label) => {
        const active = value === label.toLowerCase();

        return (
          <Stack
            key={label}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: "pointer",justifyContent:"center" }}
            onClick={() => onChange(label.toLowerCase())}
          >
            {/* Circle */}
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: active
                  ? "2px solid #60a5fa"
                  : "2px solid #cbd5f5",
                backgroundColor: active ? "#60a5fa" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active && (
                <CheckIcon sx={{ fontSize: 12, color: "#fff" }} />
              )}
            </Box>

            {/* Label */}
            <Typography
              fontSize={13}
              fontWeight={active ? 600 : 400}
              color={ "text.secondary"}
            >
              {label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function EarningsChartBlock() {
  const [range, setRange] = useState("daily");

  return (
    <div className="chart-container mb-4">
      <EarningsRangeTabs value={range} onChange={setRange} />
      <EarningsOverTimeSection range={range} />
    </div>
  );
}
