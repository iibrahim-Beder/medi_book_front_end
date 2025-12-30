<<<<<<< HEAD
import { useEffect, useRef, useCallback } from 'react';
=======
import { useEffect, useRef, useCallback,useState } from 'react';
>>>>>>> Messages-ui
import { signalRService } from './ChatSignalRService';

export const useSignalR = (userId) => {
  const componentId = useRef(`component_${Date.now()}_${Math.random()}`);
<<<<<<< HEAD

  // start connection
  useEffect(() => {
    if (!userId) return;
=======
  const [isConnected, setIsConnected] = useState(false);

  // start connection
  useEffect(() => {
    // if (!userId) return;
>>>>>>> Messages-ui

    const connect = async () => {
      try {
        await signalRService.startConnection(userId);
<<<<<<< HEAD
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
=======
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        setIsConnected(false);
>>>>>>> Messages-ui
      }
    };

    connect();

    //clean up unmount
    return () => {
<<<<<<< HEAD
=======
      setIsConnected(false);
>>>>>>> Messages-ui
      signalRService.removeMessageHandler(componentId.current);
      signalRService.removeStatusHandler(componentId.current);
      signalRService.removeUserStatusHandler(componentId.current);

    };
  }, [userId]);

  // handler new message
  const onMessageReceived = useCallback((handler) => {
    signalRService.onMessageReceived(componentId.current, handler);
  }, []);

  // handler on User Typing
  const onUserTyping = useCallback((handler) => {
    signalRService.onUserTyping(componentId.current, handler);
  }, []);
  // handler on User Typing
  const onMessageStatusUpdated = useCallback((handler) => {
    signalRService.onMessageStatusUpdated(componentId.current, handler);
  }, []);


  //  invoke join chat
  const updateInvokeJoinChat = useCallback(async (chatId) => {
    return await signalRService.updateInvokeJoinChat(chatId);
  }, []);
  // update message status
  const updateMessageStatus = useCallback(async (chatId, messageId, messageStatus) => {
    return await signalRService.updateMessageStatus(chatId, messageId, messageStatus);
  }, []);
  const InvokeMarkFromLastMessagesAsRead = useCallback(async (chatId, messageId) => {
    return await signalRService.InvokeMarkFromLastMessagesAsRead(chatId, messageId);
  }, []);
  // update message status
  const updateusertyping = useCallback(async (chatId, messageStatus) => {
    return await signalRService.updateusertyping(chatId, messageStatus);
  }, []);

  // stop connection
  const stopConnection = useCallback(async () => {
    await signalRService.stopConnection();
  }, []);

  const getConnectionState = useCallback(() => {
    console.log('getConnectionState', signalRService.getConnectionState());
    return signalRService.getConnectionState();
  }, []);
  // handler on User Typing
  const onUserStatusChanged = useCallback((handler) => {
    signalRService.onUserStatusChanged(componentId.current, handler);
  }, []);
  const onMarkAllMessagesAsRead = useCallback((handler) => {
    signalRService.onMarkAllMessagesAsRead(componentId.current, handler);
  }, []);

  return {
    isConnected,
    onMessageReceived,
    onMessageStatusUpdated,
    onUserStatusChanged, 
    updateMessageStatus,
    InvokeMarkFromLastMessagesAsRead,
    onMarkAllMessagesAsRead,
    updateInvokeJoinChat,
    updateusertyping,
    stopConnection,
    getConnectionState,
    onUserTyping,
  };
};