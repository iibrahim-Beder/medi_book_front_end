import { Link } from "react-router-dom";
import { useConversations } from "../hooks/useConversations";

export default function ProfileSidebar() {
      const {currentChat,isLoading} =useConversations();
      if(isLoading){
        return<></>
      }

  return (
    <div className="dc-dashboardbox dc-messagebox">
      <div className="dc-dashboardboxcontent">
        <div className="dc-userprofile">
          <figure>
            <img src="/images/avt/patient-avt.png" alt="profile" />
          </figure>
          <div className="dc-title">
            <h3>
              <i className="fa fa-check-circle"></i>
              {currentChat?.patientName}
            </h3>
            <span>
              Member since May 30, 2025 <br />
              <a href="javascript:void(0);">@valentine20658</a>
            </span>
          </div>
        </div>
        <div className="dc-applyfilters">
          <Link to={`/pationt-information/${currentChat?.patientId}`} className="dc-btn" >
          {/* <a  className="dc-btn"> */}
            View Profile
          {/* </a> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
