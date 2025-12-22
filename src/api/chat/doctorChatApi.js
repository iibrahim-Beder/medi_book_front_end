// doctorChatApi.js
import { formatTime } from '../../pages/shared/utils';
import { baseApi } from '../baseApi';

const transformChatsData = (response) => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      succeeded: false
    };
  }

  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }

  const transformedData = response.data.map(chat => ({
    chatId: chat.chatId,
    patientId: chat.patientId,
    patientName: chat.patientName,
    imageUrl: chat.imageUrl,
    isOnline: chat.isOnline,
    lastSeen: chat.lastSeenUtc,
    lastMessage: chat.lastMessageContent,
    lastMessageTime: chat.lastMessageSentAtUtc,
    lastMessageIsMine: chat.lastMessageIsMine,
    unreadCount: chat.unreadCount,
    isNew: chat.isNew,
    relativeTime: formatTime(chat.lastMessageSentAtUtc)
  }));

  return {
    ...response,
    data: transformedData
  };
};

const transformMessagesData = (response,personId=1) => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      hasPreviousPage: false,
      hasNextPage: false,
      succeeded: false
    };
  }

  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }

  const transformedData = response.data.map(message => ({
    id: message.messageId,
    chatId: message.chatId,
    content: message.content,
    sentAt: message.sentAt,
    sentAtFormatted: formatTime(message.sentAt),
    status: message.messageStatus,
    isMine: message.senderId === personId,
    isDelivered: message.isDelivered,
    senderId: message.senderId || null,
  }));

  return {
    ...response,
    data: transformedData
  };
};

export const doctorChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorChats: builder.query({
      query: ({ 
        pageNumber = 1, 
        pageSize = 10,
        search = '',
        showUnreadOnly = false
      }) => {
        const params = new URLSearchParams();
        
        params.append('PageNumber', pageNumber);
        params.append('PageSize', pageSize);
        
        if (search) {
          params.append('SearchTerm', search);
        }
        
        if (showUnreadOnly) {
          params.append('UnreadOnly', true);
        }

        console.log('Get Doctor Chats Params:', Object.fromEntries(params));

        return {
          url: '/Chats/GetDoctorChats',
          params,
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Doctor Chats API Response:', response);
        return transformChatsData(response);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Doctor Chats API Error:', response);
        return transformChatsData({
          succeeded: false,
          error: response.data,
          status: response.status
        });
      },
      providesTags: ['DoctorChats'],
    }),
// getChatMessages endpoints
    getChatMessages: builder.query({
      query: ({ 
        chatId, 
        personId, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = new URLSearchParams();
        
        params.append('ChatId', chatId);
        params.append('PersonId', 1);
        params.append('PageNumber', pageNumber);
        params.append('PageSize', pageSize);

        console.log('Get Chat Messages Params:', Object.fromEntries(params));

        return {
          url: '/Chats/GetChatMessages',
          params,
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Chat Messages API Response:', response);
        return transformMessagesData(response);
      },
      transformErrorResponse: (response, meta, args,personId) => {
        console.error('Chat Messages API Error:', response);
        return transformMessagesData({
          succeeded: false,
          error: response.data,
          status: response.status
        });
      },
    
  serializeQueryArgs: ({ endpointName, queryArgs }) =>
    `${endpointName}-${queryArgs.chatId}`,


  merge: (currentCache, newCache, { arg }) => {
    if (arg.pageNumber === 1) {
      return newCache; // 🔥 reset
    }

    currentCache.data.push(...newCache.data);
    currentCache.currentPage = newCache.currentPage;
    currentCache.hasNextPage = newCache.hasNextPage;
  },

  forceRefetch({ currentArg, previousArg }) {
    return (
      currentArg?.pageNumber !== previousArg?.pageNumber ||
      currentArg?.chatId !== previousArg?.chatId
    );
  },

  providesTags: (r, e, { chatId }) => [
    { type: 'ChatMessages', id: chatId },
  ],
}),

    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/Chats/SendMessage',
        method: 'POST',
        body: messageData,
      }),
    }),

    markMessagesAsRead: builder.mutation({
      query: ({ chatId, messageIds }) => ({
        url: '/Chats/MarkAsRead',
        method: 'POST',
        body: { chatId, messageIds },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        'DoctorChats',
        { type: 'ChatMessages', id: chatId },
      ],
    }),

  }),
});

export const {
  useGetDoctorChatsQuery,
  useLazyGetDoctorChatsQuery,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} = doctorChatApi;