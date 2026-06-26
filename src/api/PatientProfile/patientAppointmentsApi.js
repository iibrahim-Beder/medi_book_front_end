import { baseApi } from "../baseApi";

export const patientAppointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get patient appointments
    getPatientAppointments: builder.query({
      query: ({
        patientId,
        filter = {},
        pageNumber = 1,
        pageSize = 10,
      }) => {
        const params = {
          PatientId: patientId,
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize }),
          ...(filter.searchValue && {
            "Filter.SearchValue": filter.searchValue,
          }),
          ...(filter.status && {
            "Filter.Status": filter.status,
          }),
          ...(filter.appointmentType && {
            "Filter.AppointmentType": filter.appointmentType,
          }),
          ...(filter.fromDate && {
            "Filter.FromDate": filter.fromDate,
          }),
          ...(filter.toDate && {
            "Filter.ToDate": filter.toDate,
          }),
        };

        console.log("Patient Appointments API Request Params:", params);

        return {
          url: "/Bookings/GetyPatientAppointments",
          params,
          timeout: 10000,
        };
      },

      transformResponse: (response) => {
        console.log("Patient Appointments API Response:", response);
        return response;
      },

      transformErrorResponse: (response) => {
        console.error("Patient Appointments API Error:", response);
        return {
          succeeded: false,
          error: response.data,
          status: response.status,
        };
      },

      providesTags: (result, error, { patientId }) => [
        { type: "PatientAppointments", id: patientId },
      ],
    }),
  }),
});

export const { useGetPatientAppointmentsQuery } = patientAppointmentsApi;