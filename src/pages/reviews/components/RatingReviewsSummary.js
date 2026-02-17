import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import StarRating from "../../shared/StarRating";
const RATING_STATS = [
  { rating: 5, count: 82, percentage: 64, color: "#ffc107" },
  { rating: 4, count: 31, percentage: 24, color: "#ffc107" },
  { rating: 3, count: 9,  percentage: 7,  color: "#ffc107" },
  { rating: 2, count: 4,  percentage: 3,  color: "#ffc107" },
  { rating: 1, count: 2,  percentage: 2,  color: "#ffc107" },
];

export default function RatingSummary() {
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
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Typography fontWeight={700} fontSize={20}>
            RATING SUMMARY
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {RATING_STATS.map((item) => (
          <ProgressStat
            key={item.rating}
            label={<StarRating rating={item.rating} />}
            count={item.count}
            percentage={item.percentage}
            color={item.color}
          />
        ))}
      </Card>
    </div>
  );
}

export function ProgressStat({
  label,
  count = 0,
  percentage = 0,
  color,
}) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography display={"flex"} gap={1} fontSize={14}>
         {label} <b>{count}</b>
        </Typography>
        <Typography fontSize={14} color="var(--text-sub)">
          {percentage}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 99,
          backgroundColor: "#e5e7eb",
          mb: 1.5,
          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
            backgroundColor: color,
          },
        }}
      />
    </>
  );
}
