import DashboardBoxTitle from "../DashboardBoxTitle";
import { useTranslation } from "react-i18next";
import AppointmentsSlider from "../AppointmentsSlider";
import JobChart from "../JobChart";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useState } from "react";

export default function StatsSection() {
    const [activeTag, setActiveTag] = useState("Day"); // Default to the first tag
  const { t } = useTranslation();
  return (
    <div className="dc-dashboardbox">
      <DashboardBoxTitle
        title={t("Appointments")}
        tags={[t("Day"), t("Week"), t("Month")]}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
      />
      <AppointmentsSlider />
      <JobChart period={activeTag} />
      
      {/* Quick Links */}
      <Divider sx={{ mb: 3, mt: 2 }} />
      <Stack
        direction="row"
        justifyContent={"space-around"}
        spacing={1.5}
        mt={1}
        mb={3}
      >
        <Link to="/appointment-management">
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
            Appointments Page
          </Button>
        </Link>
        <Link to="/reviews">
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
            Reviews Page
          </Button>
        </Link>
      </Stack>
    </div>
  );
}
