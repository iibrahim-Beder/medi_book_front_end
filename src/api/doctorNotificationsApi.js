// doctorNotificationsApi.js
import { baseApi } from './baseApi';

// Transform related entity type
const transformEntityTypeToAPI = (entityType) => {
  const entityTypeMap = {
    'System': 0,
    'Appointment': 1,
    'Message': 2,
    'Payment': 3,
    'Medical': 4
  };
  return entityTypeMap[entityType] ?? null;
};

const transformEntityTypeToUI = (entityType) => {
  const entityTypeMap = {
    0: 'System',
    1: 'Appointment',
    2: 'Message', 
    3: 'Payment',
    4: 'Medical'
  };
  return entityTypeMap[entityType] ?? 'System';
};

// Transform notification type (if exists in API)
const transformNotificationTypeToAPI = (notificationType) => {
  const notificationTypeMap = {
    'Info': 1,
    'Warning': 2,
    'Alert': 3,
    'Reminder': 4
  };
  return notificationTypeMap[notificationType] ?? null;
};

const transformDoctorNotificationsData = (response) => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: []
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    notificationId: item.id,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    relatedEntityId: item.relatedEntityId,
    relatedEntityType: item.type,
    relatedEntityTypeValue: item.relatedEntityType,
    createdAt: item.createdAt,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData
  };
};

export const doctorNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorNotifications: builder.query({
      query: ({ 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          ...(filter.isRead !== undefined && { 'filter.IsRead': filter.isRead }),
          ...(filter.type && { 'filter.Type': transformNotificationTypeToAPI(filter.type) }),
          ...(filter.relatedEntityType && { 'filter.RelatedEntityType': transformEntityTypeToAPI(filter.relatedEntityType) }),
          ...(filter.fromDate && { 'filter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'filter.ToDate': filter.toDate }),
          ...(orderBy?.orderBy && { 'orderBy.OrderBy': orderBy.orderBy }),
          ...(orderBy?.isAscending !== undefined && { 'orderBy.IsAscending': orderBy.isAscending }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Doctor Notifications API Request Params:', params);

        return {
          url: '/Notification/GetNotification',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Doctor Notifications API Response:', response);
        return transformDoctorNotificationsData(response);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Doctor Notifications API Error:', response);
        return transformDoctorNotificationsData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }
        );
      },
      providesTags: ['DoctorNotifications'],
    }),
    
    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => (console.log('notificationId', notificationId)
      ,
      {
        url: `/Notifications/MarkNotificationAsRead?NotificationId=${notificationId}`,
        method: 'POST'
      }),
      invalidatesTags: ['DoctorNotifications'],
    }),
    // Mark notification as read
    markNotificationAsReadwithoutInvalidate: builder.mutation({
      query: (notificationId) => (console.log('notificationId', notificationId)
      ,
      {
        url: `/Notifications/MarkNotificationAsRead?NotificationId=${notificationId}`,
        method: 'POST'
      }),
      invalidatesTags: [''],
    }),
    
    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `/Notifications/MarkAllNotificationsAsRead`,
        method: 'POST'
      }),
      invalidatesTags: ['DoctorNotifications'],
    }),
    markAllNotificationsAsReadwithoutInvalidate: builder.mutation({
      query: () => ({
        url: `/Notifications/MarkAllNotificationsAsRead`,
        method: 'POST'
      }),
      invalidatesTags: [''],
    }),
    transformResponse: (response, meta, args) => {
      console.log('Doctor Notifications API Response:', response);
    },
    transformErrorResponse: (response, meta, args) => {
      console.error('Doctor Notifications API Error:', response);

    },
    
    // Delete notification
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/DoctorNotification/DeleteNotification/${notificationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['DoctorNotifications'],
    })
  }),
});

export const {
  useGetDoctorNotificationsQuery,
  useLazyGetDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsReadwithoutInvalidateMutation,
  useMarkAllNotificationsAsReadMutation,
  useMarkAllNotificationsAsReadwithoutInvalidateMutation,
  useDeleteNotificationMutation,
} = doctorNotificationsApi;