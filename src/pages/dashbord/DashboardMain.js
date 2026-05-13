import { useTranslation } from "react-i18next";

import LatestReviews from "./components/LatestReviews";
import StatsSidebar from "./components/StatsSidebar";
import DashboardInsights from "./components/DashboardInsights";

import AlertMessages from "./components/AlertMessage";
import StatsSection from "./components/stats-section/StatsSection";

export default function DashboardMain() {
  const { t } = useTranslation();


  const statsData = [
    {
      img: "/images/card-icon/img-17.png",
      count: "24",
      title: t("dashboard.totalAppointments"),
    },
    {
      img: "/images/card-icon/img-16.png",
      count: "14",
      title: t("dashboard.completedAppointments"),
    },
    {
      img: "/images/card-icon/img-15.png",
      count: "3",
      title: t("dashboard.cancelledAppointments"),
    },
    {
      img: "/images/card-icon/img-18.png",
      count: "7",
      title: t("dashboard.followupAppointments"),
    },
  ];

  return (
    <div className="">
      {/* Alert Boxss start */}
      <AlertMessages />
      {/* Alert Boxss end */}

      {/* Dashboard Box Section Start */}
      <section className="dc-haslayout dc-dbsectionspace">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <StatsSection />
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 dc-dashboardbox-mt mt-xl-0">
            <LatestReviews/>
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 dc-dashboardbox-mt mt-xl-0">
            <StatsSidebar stats={statsData} />
          </div>

          <DashboardInsights />
        </div>
      </section>
    </div>
  );
}
