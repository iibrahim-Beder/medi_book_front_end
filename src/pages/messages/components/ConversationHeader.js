import { t } from "i18next";
import { VscArrowLeft } from "react-icons/vsc";
import { useConversations } from "../hooks/useConversations";
import { formatTime } from "../../shared/utils";

export default function ConversationHeader() {
    const {currentChat} =useConversations();


  return (
    <div className="dc-dashboardboxtitle dc-titlemessages">
      <button onClick={() =>   document.documentElement.setAttribute("isConversationOpen", "false")}  className="dc-back">
        <VscArrowLeft/>
      </button>
      <div className="dc-userlogedin-gird chat-header">
        <div className="dc-userlogedin">
          <figure className={`dc-userimg ${currentChat?.isOnline?"online": "" }`} >
            <img src="/images/avt/patient-avt.png" alt="user" />
          </figure>
          <div className="dc-username">
            <h3>
              {/* <i className="fa fa-check-circle"></i> */}
               {currentChat?.patientName}
            </h3>
          { <span>{currentChat?.isOnline?"online" :formatTime(currentChat?.lastSeen)}</span>}
          </div>
        </div>
        <a href="javascript:void(0);" className="dc-viewprofile">
          {t("View Profile")}
        </a>
      </div>
    </div>
  );
}
