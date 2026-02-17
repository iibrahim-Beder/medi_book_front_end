import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function EarningsSummaryCard() {
  return (
    <div className="payment-card" >
      <Card
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "2px solid #cceedd",
          backgroundColor: "transparent",
          px: 3,
          py: 2.5,
          // maxWidth: 900,
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              // backgroundColor: "#e6f7ef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChartIcon sx={{ fontSize: 24, color: "#16a34a" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            EARNINGS SUMMARY
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            mb: 3,
            gap: 2,
            justifyItems: "center",
          }}
        >
          <Stat label="Lifetime Earnings" value="$18,420" />

          <Divider orientation="vertical" flexItem />

          <Stat label="This Month" value="$1,280" />

          <Divider className="divider-vertical" orientation="vertical" flexItem />

          <Stat label="This Week" value="$320" />
        </Box>

        {/* Breakdown */}
        <Typography
          fontSize={14}
          color="var(--text-sub)"
          fontWeight={600}
          mb={1}
        >
          By Appointment Type
        </Typography>

        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography fontSize={14}>
            • In Person <b>$13,000</b>
          </Typography>
          <Typography fontSize={14} color="var(--text-sub)">
            70% ($5,390)
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={70}
          sx={{
            height: 10,
            borderRadius: 99,
            backgroundColor: "#e5e7eb",
            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
              background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
            },
          }}
        />
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography fontSize={14}>
            • vedio call <b>$10,200</b>
          </Typography>
          <Typography fontSize={14} color="var(--text-sub)">
            30% ($2,190)
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={30}
          sx={{
            height: 10,
            borderRadius: 99,
            backgroundColor: "#e5e7eb",
            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
              background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
            },
          }}
        />
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <Box>
      <Typography fontSize={16} color="var(--text-sub)">
        {label}
      </Typography>
      <Typography fontSize={26} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
