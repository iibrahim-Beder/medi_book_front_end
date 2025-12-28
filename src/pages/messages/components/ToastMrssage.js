import toast from "react-hot-toast";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useEffect } from "react";
import { formatChatDate, truncateTitle } from "../../shared/utils";
import { MdClose } from "react-icons/md";
import { useDevice } from "../../../context/useIsMobile";
import { audioService } from "../../notifications/audioService";
import { useSelector } from "react-redux";
export default function ToastMessage({ t, message }) {
  return (
    <>
      <div
      title={message.content}
        className={` message toast-box toast-custom-box shadow  bg-white border p-2 d-flex align-items-start 
             ${t.visible ? "opacity-100" : "opacity-0"} 
              transition-opacity`}
      >
        <div>
          <div className="d-flex">
            <div className="avatar-title">
              {/* Avatar / Icon */}
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
              <div>
              <h6 className="fw-bold mb-1">patient name</h6>
              {/* <h6 className="fw-bold mb-1">{message.naem}</h6> */}
              {/* Content */}
              <div className="content">
                <p className=" m-0"> {truncateTitle(message.content,40)}</p>
                <time className="text-muted"> {formatChatDate(message.sentAt)} </time>
              </div>

              </div>
            </div>
          </div>

        </div>
        {/* Close */}
        <button className="alert-close" style={{top:"0", right:"0"}} onClick={() => toast.dismiss(t.id)}>
          <MdClose />
          
        </button>          
      </div>
    </>
  );
}
export const useMessageListener = () => {
  const { onMessageReceived ,getIsconnection} = useSignalR();
    const { isMobile } = useDevice();
  const selectedChat = useSelector((state) => state.chats.selectedChatId);

  useEffect(() => {
    const  handleNewMessage = (message) => {
      if (message.chatId === selectedChat) return;
      audioService.play('messageArrived')
      toast.custom(
        (t) => <ToastMessage t={t} message={message} />,
        {
          duration: 600000,
          position: isMobile ? "top-right" : "bottom-right",
        }
      );
    };

    if (getIsconnection())  {
      onMessageReceived(handleNewMessage);
    }
  }, [onMessageReceived, selectedChat]);
};
