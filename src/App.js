
import { Routes, Route } from "react-router-dom";
import Navbar from './pages/navbar/Navbar';
import './App.css';
import './assets/css/font-awesome.min.css';
import Sidebar from './pages/sidbar/Sidebar';
import  { useState, useEffect } from "react";
import DashboardMain from './pages/dashbord/DashboardMain';
import Acco from './pages/account-settings-security/MainSecuritySettings';
import LocationMain from "./pages/location-settings/LocationMain";
import SecuritySettings from "./pages/securty/MainSecuritySettings";
import MainAppointtmentList2 from "./pages/appointmentList/MainAppointmentList";
import MakeSlostMain from "./pages/making-slots/MakeSlostMain";
import { useTranslation } from "react-i18next";
import DoctorRegistration from './pages/doctor-registration/DoctorRegistration';
// import DoctorPaymentDashboard from './pages/DoctorPaymentDashboard';


function App() {

  // language in html
const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl"; 
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);


//this loading for preloader 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20);
    return () => clearTimeout(timer);
  }, []);
 const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="dc-userlogin">
      {loading && (
        <div className="preloader-outer">
          <div className="wt-preloader-holder">
            <div className="wt-loader"></div>
          </div>
        </div>
      )}
{!loading && (
 <Routes>
 
      <Route path="/" element={<DoctorRegistration />} />

      <Route
        path="/*"
        element={
          <div>
            <Navbar />
            <Sidebar />
            <div className="contentdiv">
              <Routes>
                <Route path="dashboard" element={<DashboardMain />} />
                <Route path="account-settings" element={<Acco />} />
                <Route path="appointment-list" element={<MainAppointtmentList2 />} />
                <Route path="appointment-location" element={<LocationMain />} />
                <Route path="security-settings" element={<SecuritySettings />} />
                <Route path="manage-services" element={<MakeSlostMain />} />
                
              </Routes>
            </div>
          </div>
        }
      />
    </Routes>
)}
    </div>
  );
}

export default App;
