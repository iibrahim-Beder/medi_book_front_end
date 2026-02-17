import { Box, Typography, CircularProgress, Stack, Divider, Card } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
// src/components/PatientBehaviorChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
// PatientBehaviorDonut.tsx
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";

const VALUE = 70;
  const data = [
    { value: VALUE },
    { value: 100 - VALUE },
  ];
const VALUE2 = 30;
  const data2 = [
    { value: VALUE2 },
    { value: 100 - VALUE2 },
  ];

export default  function PatientBehavior() {
  return (
    <Card
    className="card-mu mb-3"
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: "2px solid #eee",
        backgroundColor: "transparent",
        px: 3,
        py: 2.5,
      }}
    >
      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChartIcon sx={{ fontSize: 24, color: "#16a34a" }} />
        </Box>
        <Typography fontWeight={700} fontSize={20}>
          Patient Behavior (Last 30 Days)
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />
      <div className="d-flex flex-wrap">

      <Box sx={{ width: 200, height: 200, mx: "auto", position: "relative" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill="#16a34a" />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography fontSize={32} fontWeight={800}>
            {VALUE}%
          </Typography>
          <Typography fontSize={12} color="var(--text-sub)">
            Repeat Rate
          </Typography>
        </Box>
      </Box>
     <Box sx={{ width: 200, height: 200, mx: "auto", position: "relative" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data2}
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill="#60a5fa" />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography fontSize={32} fontWeight={800}>
            {VALUE2}%
          </Typography>
          <Typography fontSize={12} color="var(--text-sub)">
            Repeat Rate
          </Typography>
        </Box>
      </Box>
      </div>
        <Divider sx={{ mb: 2 }} />
      {/* Chart */}
      {/* Footer Stats */}
      <Stack direction="row" gap={1.5} mt={2}>
        <Typography fontSize={14} color="var(--text-sub)">
          Avg Visits / Patient: <strong>2.1</strong> 
        </Typography>
          <Divider orientation="vertical" flexItem />
        
        <Typography fontSize={14} color="var(--text-sub)">
          Avg Days Between Visits: <strong>27</strong>
        </Typography>
      </Stack>
    </Card>
  );
}