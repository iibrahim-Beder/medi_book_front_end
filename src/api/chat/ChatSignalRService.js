  import * as signalR from '@microsoft/signalr';

  class SignalRService {
    constructor() {
      this.connection = null;
      this.startPromise = null;
      this.messageHandlers = new Map();
      this.MarkAllMessagesAsRead = new Map();
      this.statusHandlers = new Map();
      this.userStatusHandlers = new Map(); 
      this.UserTypingHandlers = new Map();
      

    }

    // start connection
    startConnection = async (userId=1) => {
      if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
        return Promise.resolve();
      }

      if (this.startPromise) {
        return this.startPromise;
      }

      this.startPromise = (async () => {
        try {
          this.connection = new signalR.HubConnectionBuilder()
            .withUrl(
              `https://expansion-neighbors-occur-pamela.trycloudflare.com/chathub?userId=${userId}`,
              {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                headers: {
                  "User-Identifier": userId,
                },
              }
            )
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

          //  event handlers
          this.setupEventHandlers();

          // start the connection
          await this.connection.start();
          console.log("SignalR Connected Successfully");

          // Reset for future connections
          this.startPromise = null;

          return true;
        } catch (error) {
          console.error('SignalR Connection Error:', error);
          this.startPromise = null;
          throw error;
        }
      })();

      return this.startPromise;
    };

    //  event handlers
    setupEventHandlers = () => {
      if (!this.connection) return;

      this.connection.on("UserTyping", (Typing) => {
        console.log(" ==UserTyping :", Typing);

        
        this.UserTypingHandlers.forEach((handler) => {
          try {
            handler(Typing);
          } catch (error) {
            console.error("Error in UserTyping handler:", error);
          }
        });
      });

            //  MarkAllMessagesAsRead
      this.connection.on("MarkFromLastMessagesAsRead", (message) => {
        console.log("New MarkAllMessagesAsRead :", message);

        this.MarkAllMessagesAsRead.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error("Error in message handler:", error);
          }
        });
      });
            // receive message
      this.connection.on("ReceivePrivateMessage", (message) => {
        console.log("New Message Received:", message);

        this.messageHandlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error("Error in message handler:", error);
          }
        });
      });

      // Message Status
      this.connection.on('MessageStatus', (statusUpdate) => {
        console.log('Message Status Updated:', statusUpdate);

        // send the update to all registered handlers
        this.statusHandlers.forEach(handler => {
          try {
            handler(statusUpdate);
          } catch (error) {
            console.error('Error in status handler:', error);
          }
        });
      });
      // ==================================================================

      // listen for user status
      this.connection.on("UserStatusChanged", (userStatus) => {
        console.log("User Status Changed:", userStatus);

        this.userStatusHandlers.forEach((handler) => {
          try {
            handler(userStatus);
          } catch (error) {
            console.error("Error in user status handler:", error);
          }
        });
      });

      // events when the connection is closed
      this.connection.onclose((error) => {
        console.log("SignalR Connection Closed", error);
      });

      this.connection.onreconnecting((error) => {
        console.log("SignalR Reconnecting...", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("SignalR Reconnected:", connectionId);
      });
    };

    // update event join to chat
    updateInvokeJoinChat = async (chatId ) => {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error('Connection is not established');
      }

      try {
        await this.connection.invoke('InvokeJoinChat',  Number(chatId));
        return true;
      } catch (error) { 
        console.error('Error updating message status:', error);
        throw error;
      }
    };
    // listener to update message status ( seen/delivered)
    updateMessageStatus = async (chatId, messageId, messageStatus ) => {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error('Connection is not established');
      }

      try {
        await this.connection.invoke('InvokeMessageStatus',  Number(chatId), Number(messageId), Number(messageStatus));
        return true;
      } catch (error) { 
        console.error('Error updating message status:', error);
        throw error;
      }
    };
    updateusertyping = async (chatId,typing ) => {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error('Connection is not established');
      }

      try {
        await this.connection.invoke('InvokeTypingStatus',  Number(chatId), Boolean(typing));
        return true;
      } catch (error) { 
        console.error('Error updating InvokeTyping Status :', error);
        throw error;
      }
    };

    onUserTyping = (handlerId, handler) => {
      this.UserTypingHandlers.set(handlerId, handler);
    };
    //  handlers
    onMessageReceived = (handlerId, handler) => {
      this.messageHandlers.set(handlerId, handler);
    };
    onMarkAllMessagesAsRead = (handlerId, handler) => {
      this.MarkAllMessagesAsRead.set(handlerId, handler);
    };

    onMessageStatusUpdated = (handlerId, handler) => {
      this.statusHandlers.set(handlerId, handler);
    };

    removeMessageHandler = (handlerId) => {
      this.messageHandlers.delete(handlerId);
    };

    removeStatusHandler = (handlerId) => {
      this.statusHandlers.delete(handlerId);
    };
    // ===================
      onUserStatusChanged = (handlerId, handler) => {
    this.userStatusHandlers.set(handlerId, handler);
  };

  removeUserStatusHandler = (handlerId) => {
    this.userStatusHandlers.delete(handlerId);
  }; 

    stopConnection = async () => {
      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
        this.startPromise = null;
        console.log('SignalR Connection Stopped');
      }
    };

    getConnectionState = () => {
      console.log('SignalR Connection State:', this.connection ? this.connection.state : 'Disconnected');
      return this.connection ? this.connection.state : 'Disconnected';
    };
  }
  
  export const signalRService = new SignalRService();