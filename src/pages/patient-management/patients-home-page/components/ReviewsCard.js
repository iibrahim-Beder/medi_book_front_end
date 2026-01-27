
import {
  Card,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import StarRating from "../../../shared/StarRating";
import { Button } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
export default function ReviewsCard() {
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
            <StarIcon sx={{ fontSize: 23, color: "#ffc107" }} />
          </Box>

          <Typography fontWeight={700} fontSize={18}>
           Reviews (Overview) 
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
                Total Reviews: <h6 display="inline" style={{display:'inline-block', fontWeight:"600"}}>128</h6> 
              </Typography>
            </Stack>

            <Typography color="text.secondary" fontSize={15}>
              Average Rating:  <h6 display="inline" style={{display:'inline-block', fontWeight:"600"}}>4.6</h6>  <StarRating rating={4}  style={{display:"inline-block"}} />
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
            View Reviews
          </Button>
        </Stack>
      </Card>
    </div>
  );
}