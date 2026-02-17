import React, { useEffect, useMemo, useState } from "react";
import { Card, Box, Typography, Stack, Divider } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { format } from "date-fns";
import DateRangePicker from "../../patient-management/patient-information/PatientTabs/component/DateRangePicker";
import ProgressStat from "./ProgressStat";
export function getMockAppointmentsStats(dateRange) {
  const seed = dateRange
    ? dateRange.start.getDate() + dateRange.end.getDate()
    : 10;

  const total = 600 + seed * 3;

  const completed = Math.round(total * 0.7);
  const canceled = Math.round(total * 0.1);
  const rescheduled = Math.round(total * 0.12);
  const missed = total - completed - canceled - rescheduled;

  return {
    total,
    noShowRate: 12,
    avgLeadTime: 3.4,
    items: [
      {
        label: "Completed",
        count: completed,
        percentage: 70,
      },
      {
        label: "Canceled",
        count: canceled,
        percentage: 10,
      },
      {
        label: "Rescheduled",
        count: rescheduled,
        percentage: 12,
      },
      {
        label: "Missed",
        count: missed,
        percentage: 8,
      },
    ],
  };
}

export default function AppointmentsStatusCard() {
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const data = getMockAppointmentsStats(dateRange);
    setStats(data);
  }, [dateRange]);

  const titleRange = useMemo(() => {
    if (!dateRange) return "";
    return `(${format(
      dateRange.start,
      "d-MM-yyyy",
    )} to ${format(dateRange.end, "d-MM-yyyy")})`;
  }, [dateRange]);

  if (!stats) return null;

  return (
    <div className="payment-card">
      <Card
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "2px solid #eee",
          backgroundColor: "var(--cardcolor)",
          px: 3,
          py: 2.5,
          overflow: "visible",
        }}
      >
        {/* Header */}
        <Stack
          flexWrap={"wrap"}
          direction="row"
          justifyContent={"space-between"}
          spacing={1}
          alignItems="center"
          mb={2}
        >
          <Typography
            display={"flex"}
            gap={1}
            className="mu-titil"
            fontWeight={700}
            fontSize={20}
          >
            <Box>
              <EventNoteIcon sx={{ display: "inline", color: "#646262" }} />
            </Box>
            Appointments Status
          </Typography>
          <div style={{ flexGrow: "1", direction: "rtl", textAlign: "right" }}>
            <DateRangePicker width="fit-content" onChange={setDateRange} />
          </div>
        </Stack>
        <Divider sx={{ mb: 1 }} />

        {/* Summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 3,
            mb: 1,
            alignItems: "center",
          }}
        >
          <Stack direction="row" flexDirection={"column"} mt={2}>
            <Typography fontSize={14} color="var(--text-sub)">
              No-show Rate: <h6 style={{ display: "inline" }}> 12% </h6>
            </Typography>
            <Typography fontSize={14} color="var(--text-sub)">
              Avg Booking Lead Time:{" "}
              <h6 style={{ display: "inline" }}> 3.4 days </h6>{" "}
            </Typography>
          </Stack>

          <Stack alignItems="center">
            <Typography fontSize={28} fontWeight={600}>
              {stats.total}
            </Typography>
            <Typography fontSize={16} fontWeight={500} color="var(--text-sub)">
              All bookings
            </Typography>
          </Stack>
        </Box>

        {/* Progress */}
        {stats.items.map((item) => (
          <ProgressStat
            key={`${item.label}-${dateRange?.start?.getTime()}-${dateRange?.end?.getTime()}`}
            {...item}
          />
        ))}
      </Card>
    </div>
  );
}
