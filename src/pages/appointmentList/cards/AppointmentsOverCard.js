
import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
function Stat({ label, value}) {
  return (
    <Box >
      <Typography fontSize={16} color="var(--text-sub)">
        {label}
      </Typography>
      <Typography fontSize={26} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
export function Appointments() {
  return (
    <div className="payment-card mb-3 appointments-dashboard">
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
            <EventNoteIcon sx={{ fontSize: 24, color: "#60a5fa" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            Appointments
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            mb: 3,
            gap: 1,
            justifyContent: "space-around",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <Stat label="Today" value="12" />

          <Divider orientation="vertical" flexItem />

          <Stat label="Upcoming (7 days)" value="64" />

          <Divider className="divider-vertical" orientation="vertical" flexItem />

          <Stat label="Pending Requests" value="3" />

          <Divider orientation="vertical" flexItem />

          <Stat label="Canceled (7 days)" value="5" />
        </Box>
      </Card>
    </div>
  );
}
