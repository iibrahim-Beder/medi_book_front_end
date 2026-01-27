import {
  Card,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Button } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import { Link } from "react-router-dom";

export default function CommunicationCard() {
  return (
    <div className="payment-card mb-3" >
      <Card
    className="card-mu"
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "2px solid #eee",
          backgroundColor: "transparent",
          px: 3.5,
          py: 3,
          pb: 2,
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
            <MessageIcon sx={{ fontSize: 23, color: "#60a5fa" }} />
          </Box>

          <Typography fontWeight={700} fontSize={18}>
           Communication
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
               Patients with Unread Messages:    <h6 display="inline" style={{display:'inline-block', fontWeight:"600"}}>12</h6> 
              </Typography>
            </Stack>

            <Typography color="text.secondary" fontSize={15}>
             Active Conversations Today:        <h6 display="inline" style={{display:'inline-block', fontWeight:"600"}}>7</h6>
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.5} mt={1}>
          <Link to="/messages" >
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
            Open Messages
          </Button>
          </Link>
        </Stack>
      </Card>
    </div>
  );
}