import { useTranslation } from "react-i18next";

import FeedbackSlider from "./components/FeedbackSlider";
import JobChart from "./components/JobChart";
import AlertCard from "./components/AlertMessage";
import DashboardBoxTitle from "./components/DashboardBoxTitle";
import LatestAppointments from "./components/LatestAppointments";
import StatsSidebar from "./components/StatsSidebar";
import DashboardInsights from "./components/DashboardInsights";
import AlertMessage from "./components/AlertMessage";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Row } from "react-bootstrap";

export default function DashboardMain() {
  const { t } = useTranslation();

  const appointmentsData = [
    { img: "/images/avt/patient-avt.png", name: "Terrence Tynan", date: "Jun 27, 2019" },
    { img: "/images/avt/patient-avt.png", name: "Aileen Remington", date: "Jun 27, 2019" },
    { img: "/images/avt/patient-avt.png", name: "Freddie Lisi", date: "Jun 27, 2019" },
    { img: "/images/avt/patient-avt.png", name: "Golden Fellman", date: "Jun 27, 2019" }
  ];

  const statsData = [
    { img: "/images/card-icon/img-17.png", count: "150", title: t("dashboard.totalAppointments") },
    { img: "/images/card-icon/img-16.png", count: "1406", title: t("dashboard.completedAppointments") },
    { img: "/images/card-icon/img-15.png", count: "2075", title: t("dashboard.cancelledAppointments") },
    { img: "/images/card-icon/img-18.png", count: "334", title: t("dashboard.followupAppointments") }
  ];

  const insightsData = [
    { img: '/images/card-icon/chat.png', title: t("dashboard.newMessages"), link: "#",isNotIcon:true },
    { img: "/images/thumbnail/img-20.png", title: t("dashboard.latestProposals"), link: "#" },
    { img: "/images/thumbnail/img-21.png", title: t("dashboard.checkPackageExpiry"), link: "#", countdown: "2025-08-20T20:20:22" },
    { img: "/images/thumbnail/img-22.png", title: t("dashboard.viewSavedItems"), link: "#" }
  ];

  const  [ alerts , setAlerts]=useState ([
    { id: 1, type: "success", title: "Success Alert", message: "This is a success alert.", actionText: "Take Action", onActionClick: () => {} },
    { id: 2, type: "error", title: "Error Alert", message: "This is an error alert.", actionText: "Take Action", onActionClick: () => {} },
    { id: 3, type: "warning", title: "Warning Alert", message: "This is a warning alert.", actionText: "Take Action", onActionClick: () => {} },
    { id: 4, type: "info", title: "Info Alert", message: "This is an info alert.", actionText: "Take Action", onActionClick: () => {} },
  ]);

  const removeAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };
  return (
    <div className="">
      {/* Alert Boxss start */}
      <div className="dc-haslayout dc-jobalertsdashboard">
        <Row>
  <AnimatePresence mode="popLayout">
  {alerts.map((alert) => (
    <AlertMessage
      key={alert.id}                    
      type={alert.type}
      title={alert.title}
      message={alert.message}
      actionText={alert.actionText}
      onActionClick={alert.onActionClick}
      onClose={() => removeAlert(alert.id)} 
    />
  ))}
</AnimatePresence>
        </Row>
      </div>
      {/* Alert Boxss end */}

      {/* Dashboard Box Section Start */}
      <section className="dc-haslayout dc-dbsectionspace">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="dc-dashboardbox">
              <DashboardBoxTitle
                title={t("dashboard.healthForumFeedback")}
                tags={[t("months.march"), t("months.february"), t("months.january")]}
              />
              <FeedbackSlider />
              <JobChart />
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 dc-dashboardbox-mt mt-xl-0">
            <LatestAppointments
              title={t("dashboard.latestAppointments")}
              appointments={appointmentsData}
            />
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 dc-dashboardbox-mt mt-xl-0">
            <StatsSidebar stats={statsData} />
          </div>

          <DashboardInsights insights={insightsData} />
        </div>
      </section>
    </div>
  );
}
