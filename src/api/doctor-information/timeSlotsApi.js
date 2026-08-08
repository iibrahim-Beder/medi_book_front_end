import { baseApi } from "../baseApi";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   getTimeSlotsForWeb: builder.query({
  query: ({ doctorId, date, filter = "All" }) => ({
    url: "/Bookings/GetTimeSlotsForWep",
    method: "GET",
    params: {
      DoctorId: doctorId,
      Date: date,
      Filter: filter,
    },
  }),

  providesTags: ["TimeSlots"],

  transformResponse: (response) => {
    console.log("Get Time Slots Response:", response);
    return response?.data || [];
  },

  transformErrorResponse: (response) => {
    console.log("Get Time Slots Error:", response);
    return response;
  },
}),


getTimeSlotDetailsForWeb: builder.query({
  query: (timeSlotId) => ({
    url: "/Bookings/GetTimeSlotDetailsForWeb",
    method: "GET",
    params: {
      TimeSlotId: timeSlotId,
    },
  }),

  providesTags: ["TimeSlotDetails"],

  transformResponse: (response) => {
    console.log("Get Time Slot Details Response:", response);
    return response?.data;
  },

  transformErrorResponse: (response) => {
    console.log("Get Time Slot Details Error:", response);
    return response;
  },
}),
GetBookingOverviewForWeb: builder.query({
  query: (bookingId) => ({
    url: "/Bookings/GetBookingOverviewForWeb",
    method: "GET",
    params: {
      BookingId: bookingId,
    },
  }),

  providesTags: ["BookingOverview"],

  transformResponse: (response) => {
    console.log("Get booking overview Response:", response);
    return response?.data;
  },

  transformErrorResponse: (response) => {
    console.log("Get booking overview Error:", response);
    return response;
  },
}),

  }),
});

export const {
  useGetTimeSlotsForWebQuery,
  useLazyGetTimeSlotsForWebQuery,
  useGetTimeSlotDetailsForWebQuery,
  useGetBookingOverviewForWebQuery
} = doctorApi;