import React, { useEffect, useState } from "react";
import { Stack, Typography, LinearProgress } from "@mui/material";

export default function ProgressStat({ label, count, percentage }) {
  const [value, setValue] = useState(0);

useEffect(() => {
  let frame;
  let current = 0;

  const animate = () => {
    current += 2;
    if (current >= percentage) {
      setValue(percentage);
      return;
    }
    setValue(current);
    frame = requestAnimationFrame(animate);
  };

  animate();
  return () => cancelAnimationFrame(frame);
}, [percentage]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={14}>
          • {label} <b>{count}</b>
        </Typography>
        <Typography fontSize={14} color="var(--text-sub)">
          {percentage}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 99,
          mb: 1.5,
          backgroundColor: "#e5e7eb",
          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
            background:
              "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
          },
        }}
      />
    </>
  );
}
