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

// Transform notification type
const transformNotificationTypeToAPI = (notificationType) => {
  const notificationTypeMap = {
    'Info': 1,
    'Warning': 2,
    'Alert': 3,
    'Reminder': 4
  };
  return notificationTypeMap[notificationType] ?? null;
};

const transformNotificationTypeToUI = (notificationType) => {
  const notificationTypeMap = {
    1: 'Info',
    2: 'Warning', 
    3: 'Alert',
    4: 'Reminder'
  };
  return notificationTypeMap[notificationType] ?? 'Info';
};

const transformDoctorNotificationsData = (response, searchText = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchText: searchText,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchText: searchText
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    notificationId: item.id,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    relatedEntityId: item.relatedEntityId,
    relatedEntityType: transformEntityTypeToUI(item.relatedEntityType),
    relatedEntityTypeValue: item.relatedEntityType,
    notificationType: transformNotificationTypeToUI(item.type),
    notificationTypeValue: item.type,
    createdAt: item.createdAt,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData,
    searchText: searchText
  };
};

export const doctorNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientDoctorNotifications: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
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
          url: '/DoctorNotification/GetPatientDoctorNotification',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Doctor Notifications API Response:', response);
        return transformDoctorNotificationsData(response, args.filter?.searchText);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Doctor Notifications API Error:', response);
        return transformDoctorNotificationsData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchText
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotifications', id: patientId }
      ],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/DoctorNotification/MarkAsRead/${notificationId}`,
        method: 'PUT'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotifications', id: patientId }
      ],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: (patientId) => ({
        url: `/DoctorNotification/MarkAllAsRead`,
        method: 'PUT',
        body: { patientId }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotifications', id: patientId }
      ],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/DoctorNotification/DeleteNotification/${notificationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotifications', id: patientId }
      ],
    })
  }),
});

export const {
  useGetPatientDoctorNotificationsQuery,
  useLazyGetPatientDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = doctorNotificationsApi;