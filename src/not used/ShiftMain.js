// import React, { useState } from "react";
// // import ExperienceEducation from "./ProfilCart/Education";

// import ShiftsManager from "../pages/shiftSetting/ShiftsManager";
// // import AwardsDownloads from "../pages/profileSettings/AwardsDownloads";
// export default function ShiftMain() {
//   const [activeTab, setActiveTab] = useState("shifts");

//   return (
//     <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
//       <div className="dc-haslayout dc-dbsectionspace">
//         <div className="dc-dashboardbox dc-dashboardtabsholder">
//           <div className="dc-dashboardboxtitle">
//             <h2>Shift Management</h2>
//           </div>

//           {/* Tabs Navigation */}
//           <div className="dc-dashboardtabs">
//             <ul  className="dc-tabstitle nav navbar-nav">
//               <li className="nav-item">
//                 <a
//                   href="#dc-skills"
//                   className={` ${
//                     activeTab === "shifts" ? "active" : ""
//                   }`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActiveTab("shifts");
//                   }}
//                 >
//                  Location and working hours
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a
//                   href="#dc-skills"
//                   className={` ${
//                     activeTab === " LocationAndWorkingHours" ? "active" : ""
//                   }`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActiveTab(" LocationAndWorkingHours");
//                   }}
//                 >
//               2 thing

//                 </a>
//               </li>
           
//             </ul>
//           </div>

//           {/* Tabs Content */}
//           <div className="dc-tabscontent tab-content NewShado">
//             {activeTab === "shifts" && <ShiftsManager />}
//              {/* {activeTab === "LocationAndWorkingHours" && <LocationAndWorkingHours />} */}
     
//           </div>
//         </div>



//       </div>
//     </div>
//   );
// };

