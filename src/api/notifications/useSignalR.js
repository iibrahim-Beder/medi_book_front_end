import { useState, useEffect } from "react";
import { signalRService } from "./signalRService";
import toast from "react-hot-toast";
import { getNotificationIcon } from "../../pages/shared/utils";
import { MdClose } from "react-icons/md";

export const useSignalRNotifications = ({
  userId,
  enableToast = true,
  onMessage,
}) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  useEffect(() => {
    if (!userId) return;
    const initConnection = async () => {
      try {
        signalRService.onConnectionStatusChanged = (isConnected) => {
          setConnectionStatus(isConnected);
          if (!isConnected) {
            toast.error("Connection lost. Reconnecting...", {
              duration: 3000,
            });
          }
        };
        signalRService.onNotificationReceived = (notification) => {
          onMessage?.(notification);
          if (enableToast && notification) {
            toast.custom(
              (t) => (
                <div
                  className={`toast-box toast-custom-box shadow  bg-white border p-2 d-flex align-items-start 
             ${t.visible ? "opacity-100" : "opacity-0"} 
              transition-opacity`}
                >
                  <div className="d-flex align-items-center">
                    <div className="notification-avatar mr-3">
                      <img
                        src="/images/avt/patient-avt.png"
                        alt="notification avatar"
                        style={{ width: "45px", height: "45px" }}
                      />
                    </div>

                    <div className="notification-content flex-grow-1">
                      <h6 className="mb-0 notification-title">
                        <spn className="mr-1">
                          {getNotificationIcon(notification.type)}
                        </spn>
                        {notification.title}
                      </h6>
                      <p className="mb-0">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    className="alert-close"
                    style={{ top: "0", right: "0" }}
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <MdClose />
                  </button>
                </div>
              ),
              {
                duration: 600000,
                position: "top-left",
              },
            );
          }
        };

        await signalRService.startConnection(userId);
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
        toast.error("Failed to connect to notifications", {
          duration: 3000,
        });
      }
    };

    initConnection();

    return () => {
      signalRService.stopConnection();
    };
  }, [userId, enableToast]);

  return {
    connectionStatus,
    isConnected: signalRService.isConnected(),
  };
};
