import { useTranslation } from "react-i18next";

import FeedbackSlider from "./components/FeedbackSlider";
import JobChart from "./components/JobChart";
import AlertCard from "./components/AlertMessage";
import DashboardBoxTitle from "./components/DashboardBoxTitle";
import LatestAppointments from "./components/LatestAppointments";
import StatsSidebar from "./components/StatsSidebar";
import DashboardInsights from "./components/DashboardInsights";

export default function DashboardMain() {
  const { t } = useTranslation();

  const appointmentsData = [
    { img: "/images/user/userlisting/img-01.jpg", name: "Terrence Tynan", date: "Jun 27, 2019" },
    { img: "/images/user/userlisting/img-02.jpg", name: "Aileen Remington", date: "Jun 27, 2019" },
    { img: "/images/user/userlisting/img-03.jpg", name: "Freddie Lisi", date: "Jun 27, 2019" },
    { img: "/images/user/userlisting/img-07.jpg", name: "Golden Fellman", date: "Jun 27, 2019" }
  ];

  const statsData = [
    { img: "/images/thumbnail/img-17.png", count: "150", title: t("dashboard.totalAppointments") },
    { img: "/images/thumbnail/img-16.png", count: "1406", title: t("dashboard.completedAppointments") },
    { img: "/images/thumbnail/img-15.png", count: "2075", title: t("dashboard.cancelledAppointments") },
    { img: "/images/thumbnail/img-18.png", count: "334", title: t("dashboard.followupAppointments") }
  ];

  const insightsData = [
    { img: "/images/thumbnail/img-19.png", title: t("dashboard.newMessages"), link: "#" },
    { img: "/images/thumbnail/img-20.png", title: t("dashboard.latestProposals"), link: "#" },
    { img: "/images/thumbnail/img-21.png", title: t("dashboard.checkPackageExpiry"), link: "#", countdown: "2025-08-20T20:20:22" },
    { img: "/images/thumbnail/img-22.png", title: t("dashboard.viewSavedItems"), link: "#" }
  ];

  return (
    <div className="when686m-t-40">
      {/* Alert Boxss start */}
      <div style={{ paddingRight: "11px" }} className="dc-haslayout dc-jobalertsdashboard">
        <div className="row">
          <AlertCard
            title={t("alerts.reminderTitle")}
            type="success"
            message={t("alerts.reminderMessage")}
            actionText={t("alerts.visit")}
          />
          <AlertCard
            title={t("alerts.warningTitle")}
            type="warning"
            message={t("alerts.warningMessage")}
            actionText={t("alerts.visit")}
          />
          <AlertCard
            title={t("alerts.dangerTitle")}
            type="danger"
            message={t("alerts.dangerMessage")}
            actionText={t("alerts.visit")}
          />
          <AlertCard
            title={t("alerts.infoTitle")}
            type="info"
            message={t("alerts.infoMessage")}
            actionText={t("alerts.visit")}
          />
        </div>
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
