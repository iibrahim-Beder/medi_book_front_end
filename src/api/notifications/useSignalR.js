import { useState, useEffect } from 'react';
import { signalRService } from './signalRService';
import toast from 'react-hot-toast';
import { getNotificationIcon } from '../../pages/shared/utils';


export const useSignalRNotifications = ({ userId, enableToast=true, onMessage }) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  useEffect(() => {
    if (!userId) return;
    const initConnection = async () => {
      try {
        signalRService.onConnectionStatusChanged = (isConnected) => {
          setConnectionStatus(isConnected);
          if (!isConnected) {
            toast.error('Connection lost. Reconnecting...', {
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
                className={`toast-box toast-custom-box shadow  bg-white border p-3 d-flex align-items-start 
             ${t.visible ? "opacity-100" : "opacity-0"} 
              transition-opacity`}
              >
                <div style={{marginRight:"60px"}}>     
                <div className='d-flex'>
                <div className='avatar-title'>
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
                  {getNotificationIcon(notification.type)}
                </div>  
             <h6 className="fw-bold mb-1">{notification.title}</h6>
                </div>


                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <p className=" m-0">{notification.message}</p>
                </div>

             </div>
             {/* Close */}
                <button
                  className="btn-close ms-2"
                  onClick={() => toast.dismiss(t.id)}
                >
                  close
                {/* <MdClose /> */}
                </button>
              </div>
            ),
            {
              duration: 600000,
              position: "top-left",
            }
          );
          }
        };

        await signalRService.startConnection(userId);
        
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
        toast.error('Failed to connect to notifications', {
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