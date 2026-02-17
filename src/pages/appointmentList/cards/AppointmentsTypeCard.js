import { Card, Box, Typography, Stack, Divider } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DateRangePicker from "../../patient-management/patient-information/PatientTabs/component/DateRangePicker";
export function getMockAppointmentsTypeStats(dateRange) {
  const seed = dateRange ? dateRange.start.getDate() * 3 : 20;

  const total = 400 + seed;

  const inPerson = Math.round(total * 0.76);
  const call = Math.round(total * 0.24);
  const online = total - inPerson - call;

  return {
    total,
    items: [
      {
        label: "In-Person",
        count: inPerson,
        percentage: Math.round((inPerson / total) * 100),
      },
      {
        label: "Video Call",
        count: call,
        percentage: Math.round((call / total) * 100),
      },
    ],
  };
}
function Stat({ label, subtitle, value }) {
  return (
    <Box textAlign={"center"}>
      <Typography fontSize={16} color="var(--text-sub)">
        {label} <h6 style={{ display: "inline" }}>: {subtitle} </h6>
      </Typography>
      <Typography fontSize={26} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
function Header() {
  return (
    <>
      <Stack  flexWrap={"wrap"} direction="row" justifyContent="space-between" mb={2}>
        <Typography  fontWeight={700} fontSize={20}>
          <PeopleIcon sx={{ mr: 1 }} />
          Appointments Type
        </Typography>
        <div style={{ width:"100%"}}>
        <DateRangePicker className={"left"} width="fit-content" />
        </div>
      </Stack>
      <Divider sx={{ mb: 2 }} />
    </>
  );
}
const DATA2 = [
  { label: "In-Person", percent: 55, value: 505, color: "#3b82f6" },
  { label: "Video Call", percent: 30, value: 101, color: "#26de81" },
  // { label: "other", percent: 20, value: 101, color: "#eee" },
];
        // background: "linear-gradient(145deg,#2b003f,#3b005c)",

const SIZE = 180;
const STROKE = 18;
const RADIUS2 = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS2;

export default function AppointmentsTypeCard() {
  let offset = 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: "2px solid #eee",
        px: 3,
        py: 2.5,
        overflow: "visible",
        backgroundColor: "var(--cardcolor)",
        color: "var(--themecolor)",
      }}
    >
      <Header />
      <Stack flexWrap={"wrap"} justifyContent={"center"} direction="row" spacing={3} alignItems="center">
        {/* Donut */}
        <Box>
          <svg width={SIZE} height={SIZE}>
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              {/* Track */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS2}
                stroke="#eee"
                strokeWidth={STROKE}
                fill="none"
              />

              {/* Segments */}
              {DATA2.map((item, i) => {
                const dash =
                  (item.percent / 100) * CIRCUMFERENCE;
                const dashArray = `${dash} ${
                  CIRCUMFERENCE - dash
                }`;
                const dashOffset = -offset;

                offset += dash;

                return (
                  <circle
                    key={i}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS2}
                    stroke={item.color}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                  />
                );
              })}
            </g>
          </svg>
        </Box>

        {/* Right */}
        <Stack alignItems={"flex-end"} flexWrap={"wrap"} spacing={2} flex={1} flexDirection={"row"} justifyContent={"space-around"}>


          {DATA2.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: item.color,
                }}
              />
             <Stat label= {item.label}  subtitle={item.value} value={item.percent+"%"} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
