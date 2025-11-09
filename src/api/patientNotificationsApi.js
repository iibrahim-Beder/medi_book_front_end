// services/patientNotificationsApi.js
import { baseApi } from './baseApi';

const transformNotificationTypeToUI = (type) => {
  const typeMap = {
    1: 'Appointment Booked',
    2: 'Cancelled by Doctor', 
    3: 'Cancelled by You',
    4: 'Appointment Rescheduled',
    5: '24h Reminder',
    6: '1h Reminder',
    7: 'Payment Successful'
  };
  return typeMap[type] ?? 'Notification';
};

const transformNotificationsData = (response) => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      succeeded: false,
      message: response?.message || 'Failed to fetch notifications'
    };
  }

  if (!response.data) return {
    ...response,
    data: []
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    type: item.type,
    typeLabel: transformNotificationTypeToUI(item.type),
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    readAt: item.readAt,
    createdAt: item.createdAt,
    svgUrl: item.svgUrl,
    // Add time ago for display
    timeAgo: getTimeAgo(item.createdAt)
  }));

  return {
    ...response,
    data: transformedData
  };
};

// Helper function to calculate time ago
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

export const patientNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientNotifications: builder.query({
      query: (patientId) => {
        const params = {
          PatientId: patientId
        };

        console.log('Notifications API Request Params:', params);

        return {
          url: '/Notifications/GetPatientNotifications',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Notifications API Response:', response);
        return transformNotificationsData(response);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Notifications API Error:', response);
        return transformNotificationsData({
          succeeded: false,
          error: response.data,
          status: response.status
        });
      },
      providesTags: (result, error, patientId) => [
        { type: 'Notifications', id: patientId }
      ],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: ({ notificationId, patientId }) => ({
        url: `/Notifications/MarkAsRead/${notificationId}`,
        method: 'PUT',
        body: { patientId }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Notifications', id: patientId }
      ],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: (patientId) => ({
        url: '/Notifications/MarkAllAsRead',
        method: 'PUT',
        body: { patientId }
      }),
      invalidatesTags: (result, error, patientId) => [
        { type: 'Notifications', id: patientId }
      ],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: ({ notificationId, patientId }) => ({
        url: `/Notifications/DeleteNotification/${notificationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Notifications', id: patientId }
      ],
    })
  }),
});

export const {
  useGetPatientNotificationsQuery,
  useLazyGetPatientNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = patientNotificationsApi;