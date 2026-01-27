
import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
function Stat({ label, value }) {
  return (
    <Box display={"flex" } gap={1} alignItems={"center"} >
      <Typography fontSize={14} color="text.secondary">
        {label}:
      </Typography>
      <Typography fontSize={20} fontWeight={400}>
        {value}
      </Typography>
    </Box>
  );
}
export default function AppointmentsCard() {
  return (
    <div className="payment-card mb-3">
      <Card
    className="card-mu"
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "2px solid #eee",
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
            <EventNoteIcon sx={{ fontSize: 24, color: "#646262" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            Appointments Overview (Last 30 Days)
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 2,
            justifyContent: "space-around",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <Stat label="Completed" value="420" />

          {/* <Divider orientation="vertical" flexItem /> */}

          <Stat label="Cancelled" value="20" />

          {/* <Divider orientation="vertical" flexItem /> */}

          <Stat label="Rescheduled" value="29" />

          {/* <Divider orientation="vertical" flexItem /> */}

          <Stat label=" Missed" value="18" />
        </Box>
      <Stack direction="row" justifyContent="space-around" className="word-footer" mt={2}>
        <Typography fontSize={14} color="text.secondary">
          No-show Rate: <h6 style={{ display: "inline" }}> 12% </h6> 
        </Typography>
        <Typography fontSize={14} color="text.secondary">
           Avg Booking Lead Time:{" "}
          <h6 style={{ display: "inline" }}> 3.4 days </h6>{" "}
        </Typography>

        </Stack>
         {/* <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography fontSize={14}>
            • In Person <b>$13,000</b>
          </Typography>
          <Typography fontSize={14} color="text.secondary">
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
          <Typography fontSize={14} color="text.secondary">
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
        /> */}
      </Card>
    </div>
  );
}
