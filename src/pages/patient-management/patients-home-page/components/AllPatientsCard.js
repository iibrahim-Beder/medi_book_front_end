
import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
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
export default function AllPatientsCard() {
  return (
    <div className="payment-card mb-3 dashboard-page">
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
            <Groups2Icon sx={{ fontSize: 24, color: "#60a5fa" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            Patients
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
            gap: 2,
            justifyContent: "space-around",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <Stat label="Total Patients" value="420" />

          <Divider orientation="vertical" flexItem />

          <Stat label="Active" value="280" />

          <Divider className="divider-vertical" orientation="vertical" flexItem />

          <Stat label=" Recently Seen" value="320" />

          <Divider orientation="vertical" flexItem />

          <Stat label=" Inactive" value="220" />
        </Box>
              <Stack direction="row" justifyContent="space-around" mt={2}>
        <Typography fontSize={14} color="var(--text-sub)">
         Today: <h6 style={{ display: "inline" }}> Seen 12 </h6> 
        </Typography>
        <Typography fontSize={14} color="var(--text-sub)">
          Upcoming:{" "}
          <h6 style={{ display: "inline" }}> 9 </h6>{" "}
        </Typography>

        </Stack>
      </Card>
    </div>
  );
}