import { useTranslation } from "react-i18next";

import FeedbackSlider from "./components/FeedbackSlider";
import JobChart from "./components/JobChart";
import DashboardBoxTitle from "./components/DashboardBoxTitle";
import LatestAppointments from "./components/LatestAppointments";
import StatsSidebar from "./components/StatsSidebar";
import DashboardInsights from "./components/DashboardInsights";

import AlertMessages from "./components/AlertMessage";

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

  return (
    <div className="">
      {/* Alert Boxss start */}
     <AlertMessages />
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

          <DashboardInsights />
        </div>
      </section>
    </div>
  );
}
