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
        <div className="w-100">
          <div className="d-flex">
            <div className="avatar-title w-100">
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
              <div className="w-100">
              <h6 className="fw-bold m-0">patient name</h6>
              {/* <h6 className="fw-bold mb-1">{message.naem}</h6> */}
              {/* Content */}
              <div className="content w-100">
                <p className=" m-0"> {(message.content)}</p>
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
  const { onMessageReceived ,isConnected} = useSignalR();
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

    if (isConnected)  {
      onMessageReceived(handleNewMessage);
    }
  }, [onMessageReceived, selectedChat,isConnected]);
};
