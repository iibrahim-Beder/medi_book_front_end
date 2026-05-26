// doctorEducationApi.js
import { baseApi } from "../baseApi";

const processField = (value) => {
  if (value === undefined) return undefined;
  return value === "" ? null : value;
};

const transformDoctorEducationData = (response) => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      succeeded: false,
    };
  }

  return {
    ...response,
    data: (response.data || []).map((item) => ({
      id: item.doctorEducationId,
      doctorEducationId: item.doctorEducationId,
      institutionName: item.institutionName,
      degree: item.degree,
      degreeDisplayName: item.degreeDisplayName,
      major: item.major,
      graduationYear: item.graduationYear,
      startDate: item.startDate,
      endDate: item.endDate,
      notes: item.notes,
      isVerified: item.isVerified,
      certificateFileUrl: item.certificateFileUrl,
    })),
  };
};

export const doctorEducationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getDoctorEducations: builder.query({
      query: ({ doctorId }) => ({
        url: "/Doctors/GetDoctorEducations",
        params: { DoctorID: doctorId },
      }),
      transformResponse: (res) => transformDoctorEducationData(res),
      transformErrorResponse: (res) => ({
        data: [],
        succeeded: false,
        error: res?.data,
      }),
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorEducation", id: doctorId },
      ],
    }),

    // ADD
    addDoctorEducation: builder.mutation({
      query: ({ doctorId, educations }) => ({
        url: "/Doctors/AddDoctorEducations",
        method: "POST",
        body: {
          doctorId,
          educations: educations.map((e) => ({
            institutionName: processField(e.institutionName),
            degree: processField(e.degree),
            major: processField(e.major),
            graduationYear: e.graduationYear,
            startDate: processField(e.startDate),
            endDate: processField(e.endDate),
            notes: processField(e.notes),
            certificateFileUrl: processField(e.certificateFileUrl),
          })),
        },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const added = data?.data;
          if (!added?.length) return;

          const state = getState();
          const queries = state[baseApi.reducerPath]?.queries ?? {};

          Object.values(queries).forEach((entry) => {
            if (entry?.endpointName === "getDoctorEducations") {
              dispatch(
                doctorEducationApi.util.updateQueryData(
                  "getDoctorEducations",
                  entry.originalArgs,
                  (draft) => {
                    draft.data.unshift(...added);
                  },
                ),
              );
            }
          });
        } catch {}
      },
    }),

    addDoctorOneEducation: builder.mutation({
  query: ({ doctorId, education }) => ({
    url: "/Doctors/AddDoctorEducation",
    method: "POST",
    body: {
      doctorId,
      education: {
        institutionName: processField(education.institutionName),
        degree: processField(education.degree),
        major: processField(education.major),
        graduationYear: education.graduationYear,
        startDate: processField(education.startDate),
        endDate: processField(education.endDate),
        notes: processField(education.notes),
        certificateFileUrl: processField(
          education.certificateFileUrl
        ),
      },
    },
  }),

  async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
    try {
      const { data } = await queryFulfilled;
      const added = data?.data;
      if (!added) return;

      const state = getState();
      const queries =
        state[baseApi.reducerPath]?.queries ?? {};

      Object.values(queries).forEach((entry) => {
        if (entry?.endpointName === "getDoctorEducations") {
          dispatch(
            doctorEducationApi.util.updateQueryData(
              "getDoctorEducations",
              entry.originalArgs,
              (draft) => {
                draft.data.unshift({
                  ...added,
                  id: added.doctorEducationId,
                });
              }
            )
          );
        }
      });
    } catch {}
  },
}),

    // UPDATE
    updateDoctorEducation: builder.mutation({
      query: ({ doctorId, doctorEducationId, updates }) => ({
        url: "/Doctors/UpdateDoctorEducations",
        method: "POST",
        body: {
          doctorId,
          doctorEducationId,
          ...Object.fromEntries(
            Object.entries(updates).map(([k, v]) => [
              k,
              { value: processField(v) },
            ]),
          ),
        },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const updated = data?.data;
          if (!updated) return;

          const state = getState();
          const queries = state[baseApi.reducerPath]?.queries ?? {};

          Object.values(queries).forEach((entry) => {
            if (entry?.endpointName === "getDoctorEducations") {
              dispatch(
                doctorEducationApi.util.updateQueryData(
                  "getDoctorEducations",
                  entry.originalArgs,
                  (draft) => {
                    const idx = draft.data.findIndex(
                      (r) => r.id === updated.doctorEducationId,
                    );

                    if (idx !== -1) {
                      draft.data[idx] = {
                        ...draft.data[idx],
                        ...updated,
                        id: updated.doctorEducationId,
                      };
                    }
                  },
                ),
              );
            }
          });
        } catch {}
      },
    }),

    // DELETE
    deleteDoctorEducation: builder.mutation({
      query: ({ doctorId, doctorEducationId }) => ({
        url: "/Doctors/DeleteDoctorEducations",
        method: "DELETE",
        body: { doctorId, doctorEducationId },
      }),

      async onQueryStarted(
        { doctorEducationId },
        { dispatch, queryFulfilled, getState },
      ) {
        const state = getState();
        const queries = state[baseApi.reducerPath]?.queries ?? {};

        const patches = [];

        Object.values(queries).forEach((entry) => {
          if (entry?.endpointName === "getDoctorEducations") {
            patches.push(
              dispatch(
                doctorEducationApi.util.updateQueryData(
                  "getDoctorEducations",
                  entry.originalArgs,
                  (draft) => {
                    draft.data = draft.data.filter(
                      (item) => item.id !== doctorEducationId,
                    );
                  },
                ),
              ),
            );
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useGetDoctorEducationsQuery,
  useAddDoctorEducationMutation,
  useAddDoctorOneEducationMutation,
  useUpdateDoctorEducationMutation,
  useDeleteDoctorEducationMutation,
} = doctorEducationApi;
