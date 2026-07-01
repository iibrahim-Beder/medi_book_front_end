import { t } from "i18next";
import { VscArrowLeft } from "react-icons/vsc";
import { useConversations } from "../hooks/useConversations";
import { convertSrcPatientImg, formatTime } from "../../shared/utils";
import {  Link, useNavigate } from "react-router-dom";

export default function ConversationHeader() {
    const {currentChat} =useConversations();
    const navigate = useNavigate();


  return (
    <div className="dc-dashboardboxtitle dc-titlemessages">
      <button onClick={() =>  {navigate("/chat")}}  className="dc-back">
        <VscArrowLeft/>
      </button>
      <div className="dc-userlogedin-gird chat-header">
        <div className="dc-userlogedin">
          <figure className={`dc-userimg ${currentChat?.isOnline?"online": "" }`} >
                       <img src={convertSrcPatientImg(currentChat?.imageUrl) || "/images/avt/unSelectedChat.png" }
                         alt="profile"
                         onError={(e) => (e.target.src = "/images/avt/patient-avt.png")}
                       />
          </figure>
          <div className="dc-username">
            <h3>
              {/* <i className="fa fa-check-circle"></i> */}
               {currentChat?.patientName}
            </h3>
          { <span>{currentChat?.isOnline?"online" :formatTime(currentChat?.lastSeen)}</span>}
          </div>
        </div>
        <Link to={`/pationt-information/${currentChat?.patientId}`} className="dc-viewprofile">
        <a  href="!"  className="dc-viewprofile">
          {t("View Profile")}
        </a>
        </Link>
      </div>
    </div>
  );
}
