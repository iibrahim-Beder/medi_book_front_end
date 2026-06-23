import { Link } from "react-router-dom";
import { useConversations } from "../hooks/useConversations";
import { convertSrcPatientImg } from "../../shared/utils";
import { useSelector } from "react-redux";

export default function ProfileSidebar() {
  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  const { currentChat, isLoading } = useConversations();
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="dc-dashboardbox dc-messagebox">
      <div className="dc-dashboardboxcontent">
        <div className="dc-userprofile">
          <figure>
            <img
              src={
                (selectedChat && convertSrcPatientImg(currentChat?.imageUrl)) ||
                "/images/avt/unSelectedChat.png"
              }
              alt="profile"
              onError={(e) => (e.target.src = "/images/avt/patient-avt.png")}
            />
          </figure>
          <div className="dc-title">
            {selectedChat ? (
              <>
                <h3>
                  <i className="fa fa-check-circle"></i>
                  {currentChat?.patientName}
                </h3>
                <span>
                  Member since May 30, 2025 <br />
                  <a href="!#">@valentine20658</a>
                </span>
              </>
            ) : (
              <>
                <h3 style={{ color: "#008ce9" }}>Select a chat</h3>
                <span> select a chat to view profile </span>
              </>
            )}
          </div>
        </div>
        <div className="dc-applyfilters"disabled={!selectedChat}>
          <Link
            to={ selectedChat && `/pationt-information/${currentChat?.patientId}`}
            className="dc-btn"
            style={{cursor: selectedChat? "pointer": "not-allowed" }}
          >
            {/* <a  className="dc-btn"> */}
            View Profile
            {/* </a> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
