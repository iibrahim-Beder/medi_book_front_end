// services/signalRService.js
import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.onNotificationReceived = null;
    this.onConnectionStatusChanged = null;
  }

  startConnection = async (userId) => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL 
      || 'https://finds-sellers-relevant-somebody.trycloudflare.com';

    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/notificationHub?userId=${userId}`, {  
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
      headers: {
        "User-Identifier": userId.toString()  
      }
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: retryContext => {
        return Math.min(retryContext.previousRetryCount * 1000, 10000);
      }
    })
    .configureLogging(signalR.LogLevel.Warning)
    .build();
    console.log("SignalR connection started", this.connection,"|  userId", userId);

      this.connection.on("ReceiveNotification", (notification) => {
        console.log("Notification received:", notification);
        if (this.onNotificationReceived) {
          this.onNotificationReceived(notification);
          console.log("Notification received in hook:", notification);
        }
      });

      this.connection.on("NotificationRead", (notificationId) => {
        console.log("Notification marked as read:", notificationId);
      });

      this.connection.onclose(() => {
        console.log("SignalR connection closed");
        if (this.onConnectionStatusChanged) {
          this.onConnectionStatusChanged(false);
        }
      });

      this.connection.onreconnecting(() => {
        console.log("SignalR reconnecting...");
      });

      this.connection.onreconnected(() => {
        console.log("SignalR reconnected");
        if (this.onConnectionStatusChanged) {
          this.onConnectionStatusChanged(true);
        }
      });

      await this.connection.start();
      console.log("SignalR Connected successfully", this.connection,"|  userId", userId);

      if (this.onConnectionStatusChanged) {
        this.onConnectionStatusChanged(true);
      }

      return this.connection;
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      throw error;
    }
  };

  stopConnection = async () => {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("SignalR connection stopped");
    }
  };

  markAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.invoke("MarkNotificationAsRead", notificationId)
        .catch(err => console.error("Error marking as read:", err));
    }
  };

  markAllAsRead = () => {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.invoke("MarkAllAsRead")
        .catch(err => console.error("Error marking all as read:", err));
    }
  };

  isConnected = () => {
    return this.connection && this.connection.state === signalR.HubConnectionState.Connected;
  };
}

export const signalRService = new SignalRService();
