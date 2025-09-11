import { VscArrowLeft } from "react-icons/vsc";

export default function ConversationHeader() {
  return (
    <div className="dc-dashboardboxtitle dc-titlemessages">
      <button onClick={() =>   document.documentElement.setAttribute("isConversationOpen", "false")}  className="dc-back">
        <VscArrowLeft/>
      </button>
      <div className="dc-userlogedin-gird">
        <div className="dc-userlogedin">
          <figure className="dc-userimg">
            <img src="images/user-img.jpg" alt="user" />
          </figure>
          <div className="dc-username">
            <h3>
              <i className="fa fa-check-circle"></i> Louanne Mattioli
            </h3>
            <span>Amento Tech</span>
          </div>
        </div>
        <a href="javascript:void(0);" className="dc-viewprofile">
          View Profile
        </a>
      </div>
    </div>
  );
}
