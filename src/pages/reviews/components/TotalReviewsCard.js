import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import StarRating from "../../shared/StarRating";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
function Stat({  label, subValue, value }) {
  return (
    <Box>
      <Typography fontSize={16} color="var(--text-sub)">
        {label}<h6 style={{ display: "inline" }}>{subValue}</h6>
      </Typography>
      <Typography fontSize={26} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
export default function TotalReviewsCard() {
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
          pb: 1,
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
            <StarIcon sx={{ fontSize: 24, color: "#ffc107" }} />
          </Box>

          <Typography fontWeight={700} fontSize={20} letterSpacing={0.4}>
            Reviews
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
          <Stat label="Total Reviews" value="128" />

          <Divider orientation="vertical" flexItem />

          <Stat
            label="Average Rating: "
            subValue={4.6}
            value={
              <>
                <StarRating rating={4.6} style={{ display: "inline-block" }} />
              </>
            }
          />
        </Box>
          <Typography fontSize={14} textAlign={"center"} color="var(--text-sub)">
            Patient feedback from completed appointments
          </Typography>
                
         <Divider sx={{ mb: 2, mt: 2 }} />
           <Stack direction="row" justifyContent={"space-around"} spacing={1.5} mt={1} mb={1} >
            <Link to="/patients" >
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
            Back to Patients
          </Button>
            </Link>
            <Link to="/dashboard" >
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
           Back to Dashboard
          </Button>
            </Link>

        </Stack>
      </Card>
    </div>
  );
}