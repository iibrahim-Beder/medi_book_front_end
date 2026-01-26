import { Box, Card, Typography, Button, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export default function PaymentsStripeCard() {
  return (
    <div className="payment-card mb-3" >
      <Card
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "2px solid #cfe3ff",
          backgroundColor: "transparent",
          px: 3.5,
          py: 3,
          // maxWidth: 600,
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
            //   backgroundColor: "#eaf2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCardIcon sx={{ fontSize: 23, color: "#60a5fa" }} />
          </Box>

          <Typography fontWeight={700} fontSize={18}>
            Payments & Earnings
          </Typography>
        </Stack>

        {/* Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 3,
            border: "1px solid #eee",
            borderRight: 0,
            borderLeft: 0,
            padding: "9px 0",
            marginBottom:"10px"
          }}
        >
          {/* Left */}
          <Stack
            spacing={1.1}
            style={{
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="text.secondary" fontSize={15}>
                Stripe Status:
              </Typography>

              <CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e" }} />

              <Typography  color="text.secondary"
            //   fontWeight={600} 
              fontSize={15}>
                Connected & Active
              </Typography>
            </Stack>

            <Typography color="text.secondary" fontSize={15}>
              Wallet Balance
            </Typography>

            <Typography color="text.secondary" fontSize={15}>
              Last Payout:{" "}
              <Box component="span"
            //    fontWeight={600}
                // color="text.primary"
                >
                12 Sep 2025
              </Box>
            </Typography>
          </Stack>

          {/* Right */}
          <Stack alignItems="flex-end" justifyContent="center">
            <Typography fontSize={28}fontWeight={600}>
              $1,340
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Pending Payout
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.5} mt={1}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              backgroundColor: "#60a5fa",   
              boxShadow: "none",
            }}
          >
            Manage Stripe
          </Button>

          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              backgroundColor: "#60a5fa",
              boxShadow: "none",
            }}
          >
            View Payouts
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
