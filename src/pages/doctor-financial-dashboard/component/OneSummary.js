import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import FilePresentIcon from '@mui/icons-material/FilePresent';
export default function OneSummary() {
  return (
    <div className="payment-card mb-3" >
      <Card
        elevation={0}
        sx={{
          borderRadius: "32px",
          border: "2px solid #eee",
          backgroundColor: "transparent",
          px: 2,
          py: 1.5,
          // maxWidth: 400,
          paddingBottom: 1,
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
            <FilePresentIcon sx={{ fontSize: 24, color: "#7e7e7e" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            New York Clinic
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        {/* Breakdown */}
        <Typography
          fontSize={14}
          color="text.secondary"
          fontWeight={600}
          mb={1}
        >
          By leasson
        </Typography>

        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography fontSize={14}>• leasson</Typography>
          <Typography fontSize={14} color="text.secondary">
            70 Ls
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={70}
          sx={{
            marginBottom: 1,
            height: 10,
            borderRadius: 99,
            backgroundColor: "#e5e7eb",
            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
              background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
            },
          }}
        />
        <Typography fontSize={14} color="text.secondary">
          Breakdowns are aggregated — mock allowed
        </Typography>
      </Card>
    </div>
  );
}
