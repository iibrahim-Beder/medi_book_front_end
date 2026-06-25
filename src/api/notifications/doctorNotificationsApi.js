// doctorNotificationsApi.js
import { baseApi } from '../baseApi';

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
        console.log('Get filter notifications Params:', { filter });
        const params = {
          ...(filter.isRead !== undefined && { 'filter.IsRead': filter.isRead }),
          ...(filter.type && { 'filter.Type': filter.type}),
          ...(filter.relatedEntityType && { 'filter.RelatedEntityType': filter.relatedEntityType }),
          ...(filter.fromDate && { 'filter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'filter.ToDate': filter.toDate }),
          ...(orderBy?.orderBy && { 'orderBy.OrderBy': orderBy.orderBy }),
          ...(orderBy?.isAscending !== undefined && { 'orderBy.IsAscending': orderBy.isAscending }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Doctor Notifications API Request Params:', params);

        return {
          url: '/Notifications/GetNotification',
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