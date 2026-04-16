import toast from "react-hot-toast";
import { formatChatDate, truncateTitle } from "../../shared/utils";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightCircleFill } from "react-icons/bs";

export default function ToastMessage({ t, messages }) {
  const[expandedMessage, setExpandedMessage] = useState([]);
  return (
    <div
      className={`toast-box toast-custom-box shadow  border p-2 d-flex align-items-start
        ${t.visible ? "opacity-100" : "opacity-0"}
        transition-opacity`}
    >
      <div className="w-100">
        <div className="d-flex">
          <div className="avatar-title w-100">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                minWidth: "40px",
                minHeight: "40px",
                background: "#eef1f6",
                fontSize: "18px",
              }}
            >
              <img
                src="/images/avt/patient-avt.png"
                className="rounded-circle toast-messsage-img"
                alt="avatar"
              />
            </div>

            <div className="w-100">
              <h6 className="fw-bold m-0">patient name</h6>

              <div className="content w-100">
                {messages.map((msg) => (
                  <div key={msg.messageId} className="d-flex align-items-center justify-content-between pb-2" onClick={() => expandedMessage.includes(msg.messageId) ? setExpandedMessage(expandedMessage.filter((id) => id !== msg.messageId)) : setExpandedMessage([...expandedMessage, msg.messageId])} >
                    <p className={`m-0 ${expandedMessage.includes(msg.messageId) ? "expanded" : ""}`}>
                      {
                        expandedMessage.includes(msg.messageId) ?
                        msg.content:
                            truncateTitle(msg.content, 90) 
                      }
                    </p>
                    <time className="text-muted">
                      {formatChatDate(msg.sentAt)}
                    </time>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="alert-close"
        style={{ top: "0", right: "0" }}
        onClick={() => toast.dismiss(t.id)}
      >
        <MdClose />
      </button>

      <Link to={`/chat/${messages[0].chatId}`} className="w-100" >
       <button title="open chat" className='button-elment'>
        <BsArrowRightCircleFill/>
       </button>
      </Link>
    </div>
  );
}
