import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';export default function Notes() {
  return (
    <div className="payment-card mb-3" >
      <Card
        elevation={0}
        sx={{
          borderRadius: "22px",
          border: "2px solid #eee",
          backgroundColor: "transparent",
          px: 2,
          py: 1.5,
          // maxWidth: 500,
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
            <WarningAmberIcon sx={{ fontSize: 24, color: "#7e7e7e" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
           NOTES
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2}} />
        <Stack direction="column" justifyContent="space-between" mb={0.5}>
          <Typography fontSize={14} mb={1} > • Earnings charts and summaries are aggregated for analytics purposes.</Typography>
          <Typography fontSize={14} mb={1} > • Transaction records reflect real Stripe payment events.     </Typography>
          <Typography fontSize={14} mb={1}> • Payouts and refunds are managed outside this screen. .</Typography>
        </Stack>
      </Card>
    </div>
  );
}
