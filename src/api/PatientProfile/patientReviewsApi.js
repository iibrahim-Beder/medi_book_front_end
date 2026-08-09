import { baseApi } from '../baseApi';


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
    bookingType: item.bookingType,
    bookingTypeValue: item.bookingType,
    rating: item.rating,
    comment: item.comment,
    createdAt: item.createdAt,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.reviewID)
  }));

  return {
    ...response,
    data: transformedData,
    averageRating: response.meta?.averageRating || 0,
    searchTerm: searchTerm
  };
};

export const patientReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientReviews: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          doctorId: 1,
          ...(filter.minRating && { 'Filters.MinRating': filter.minRating }),
          ...(filter.maxRating && { 'Filters.MaxRating': filter.maxRating }),
          ...(filter.appointmentType !== undefined && { 'Filters.AppointmentType': filter.appointmentType }),
          ...(filter.fromDate && { 'Filters.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'Filters.ToDate': filter.toDate }),
          ...(filter.searchValue && { 'Filters.SearchValue': filter.searchValue }),
          ...(orderBy?.orderBy && { 'OrderBy.OrderBy': orderBy.orderBy }),
          ...(orderBy?.isAscending !== undefined && { 'OrderBy.IsAscending': orderBy.isAscending }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Reviews API Request Params:', params); 

        return {
          url: '/Reviews/GetPatientReviews',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Reviews API Response:', response); 
        return transformReviewsData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Reviews API Error:', response); 
        return transformReviewsData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientReviews', id: patientId }
      ],
    }),

    // Add a new Review
    addPatientReview: builder.mutation({
      query: ({ patientId, reviewData }) => ({
        url: '/Reviews/AddPatientReview',
        method: 'POST',
        body: {
          patientId,
          ...reviewData
        }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientReviews', id: patientId }
      ],
    }),

    // Update Review
    updatePatientReview: builder.mutation({
      query: ({ reviewId, updates }) => ({
        url: `/Reviews/UpdatePatientReview/${reviewId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientReviews', id: patientId }
      ],
    }),

    // Delete Review
    deletePatientReview: builder.mutation({
      query: (reviewId) => ({
        url: `/Reviews/DeletePatientReview/${reviewId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientReviews', id: patientId }
      ],
    })
  }),
});

export const {
  useGetPatientReviewsQuery,
  useLazyGetPatientReviewsQuery,
  useAddPatientReviewMutation,
  useUpdatePatientReviewMutation,
  useDeletePatientReviewMutation,
} = patientReviewsApi;