import { baseApi } from "../baseApi";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create doctor (basic info step)
    addDoctorBasicInfo: builder.mutation({
      query: (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (key === "Photo") return;

          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        if (data.Photo instanceof File) {
          formData.append("Photo", data.Photo);
        }

        return {
          url: "/Doctors/AddDoctorBasicInfo",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: [{ type: "Doctor" }],

      transformResponse: (response) => {
        console.log("Add Doctor Basic Info Response:", response);
        return response;
      },

      transformErrorResponse: (response) => {
        console.log("Add Doctor Basic Info Error Response:", response);
        return response;
      },
    }),

    // Get doctor basic info
    getDoctorBasicInfo: builder.query({
      query: (doctorId) => ({
        url: "/Doctors/GetDoctorBasicInfo",
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, id) => [{ type: "Doctor", id }],
    }),
    getDoctorCurrentStep: builder.query({
      query: (doctorId) => ({
        url: "/Doctors/GetDoctorCurrentStep",
        method: "GET",
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, id) => [{ type: "Doctor" }],
      transformResponse: (response) => {
        console.log("Get Doctor Current Step Response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.log("Get Doctor Current Step Error:", response);
        return response;
      },
    }),

    // Update doctor basic info
    updateDoctorBasicInfo: builder.mutation({
      query: ({ doctorId, ...data }) => {
        const formData = new FormData();

        formData.append("DoctorId", doctorId);

        Object.entries(data).forEach(([key, value]) => {
          formData.append(`${key}.IsSet`, "true");

          if (value !== null && value !== undefined) {
            if (key === "Photo") return;

            formData.append(`${key}.Value`, value);
          }
        });
        if (data.Photo instanceof File) {
          formData.append("Photo", data.Photo);
        }

        return {
          url: "/Doctors/UpdateDoctorBasicInfo",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "Doctor", id: doctorId },
      ],
    }),

    // Update current doctor step
    updateCurrentDoctorStep: builder.mutation({
      query: (doctorId) => ({
        url: "/Doctors/UpdateCurrentDoctorStep",
        method: "PUT",
        body: { doctorId },
      }),
      invalidatesTags: (result, error, doctorId) => [
        { type: "Doctor", id: doctorId },
      ],
      transformResponse: (response) => {
        console.log("Update Current Doctor Step Response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.log("Update Current Doctor Step Error:", response);
        return response;
      },
    }),
  }),
});

export const {
  useAddDoctorBasicInfoMutation,
  useLazyGetDoctorBasicInfoQuery,
  useGetDoctorBasicInfoQuery,
  useUpdateDoctorBasicInfoMutation,
  useGetDoctorCurrentStepQuery,
  useLazyGetDoctorCurrentStepQuery,
  useUpdateCurrentDoctorStepMutation,
} = doctorApi;
