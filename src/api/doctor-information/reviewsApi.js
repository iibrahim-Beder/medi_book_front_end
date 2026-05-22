import { baseApi } from '../baseApi';

const transformAppointmentTypeToAPI = (appointmentType) => {
  const appointmentTypeMap = {
    'Consultation': 0,
    'FollowUp': 1,
    'Emergency': 2
    // Add other appointment types as needed
  };
  return appointmentTypeMap[appointmentType] ?? null;
};

const transformAppointmentTypeToUI = (appointmentType) => {
  const appointmentTypeMap = {
    0: 'Consultation',
    1: 'FollowUp', 
    2: 'Emergency'
  };
  return appointmentTypeMap[appointmentType] ?? 'Consultation';
};

const transformReviewsData = (response, searchTerm = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      averageRating: 0,
      searchTerm: searchTerm,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchTerm: searchTerm
  };

  const transformedData = response.data.map(item => ({
    id: item.reviewID,
    reviewID: item.reviewID,
    bookingId: item.bookingId,
    bookingType: transformAppointmentTypeToUI(item.bookingType),
    bookingTypeValue: item.bookingType,
    rating: item.rating,
    comment: item.comment,
    createdAt: item.createdAt,
    patientName: item.patientName,
    patientId: item.patientID,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.reviewID)
  }));

  return {
    ...response,
    data: transformedData,
    averageRating: response.meta?.averageRating || 0,
    searchTerm: searchTerm
  };
};

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get ALL reviews (for all patients)
    getReviews: builder.query({
      query: ({ 
        doctorId=1,
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          DoctorId: doctorId,
          ...(filter.minRating !== undefined && { 'Filters.MinRating': filter.minRating }),
          ...(filter.maxRating !== undefined && { 'Filters.MaxRating': filter.maxRating }),
          ...(filter.appointmentType !== undefined && { 'Filters.AppointmentType': transformAppointmentTypeToAPI(filter.appointmentType) }),
          ...(filter.fromDate && { 'Filters.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'Filters.ToDate': filter.toDate }),
          ...(orderBy?.orderBy && { 'OrderBy.OrderBy': orderBy.orderBy }),
          ...(orderBy?.isAscending !== undefined && { 'OrderBy.IsAscending': orderBy.isAscending }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('All Reviews API Request Params:', params); 

        return {
          url: '/Reviews/GetReviews',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('All Reviews API Response:', response); 
        return transformReviewsData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('All Reviews API Error:', response); 
        return transformReviewsData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: ['AllReviews'],
    }),

    // Add a new Review
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: '/Reviews/AddReview',
        method: 'POST',
        body: reviewData
      }),
      invalidatesTags: ['AllReviews'],
    }),

    // Update Review
    updateReview: builder.mutation({
      query: ({ reviewId, updates }) => ({
        url: `/Reviews/UpdateReview/${reviewId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: ['AllReviews'],
    }),

    // Delete Review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/Reviews/DeleteReview/${reviewId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AllReviews'],
    })
  }),
});

export const {
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;