// doctorExperienceApi.js
import { baseApi } from "../baseApi";

const processField = (value) => {
  if (value === undefined) return undefined;
  return value === "" ? null : value;
};

const transformDoctorExperienceData = (response) => {
  if (!response || !response.succeeded) {
    return { data: [], succeeded: false };
  }

  return {
    ...response,
    data: (response.data || []).map((item) => ({
      id: item.doctorExperienceId,
      doctorExperienceId: item.doctorExperienceId,
      workplace: item.workplace,
      jobTitle: item.jobTitle,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
    })),
  };
};

export const doctorExperienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getDoctorExperiences: builder.query({
      query: ({ doctorId }) => ({
        url: "/Doctors/GetDoctorExperiences",
        params: { DoctorID: doctorId },
      }),
      transformResponse: transformDoctorExperienceData,
      transformErrorResponse: (res) => ({
        data: [],
        succeeded: false,
        error: res?.data,
      }),
      providesTags: (r, e, { doctorId }) => [
        { type: "DoctorExperience", id: doctorId },
      ],
    }),

    // ADD
    addDoctorExperience: builder.mutation({
      query: ({ doctorId, experiences }) => ({
        url: "/Doctors/AddDoctorExperiences",
        method: "POST",
        body: {
          doctorId,
          experiences: experiences.map((e) => ({
            workplace: processField(e.workplace),
            jobTitle: processField(e.jobTitle),
            startDate: processField(e.startDate),
            endDate: processField(e.endDate),
            description: processField(e.description),
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
            if (entry?.endpointName === "getDoctorExperiences") {
              dispatch(
                doctorExperienceApi.util.updateQueryData(
                  "getDoctorExperiences",
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

    // UPDATE
    updateDoctorExperience: builder.mutation({
      query: ({ doctorId, doctorExperienceId, updates }) => ({
        url: "/Doctors/UpdateDoctorExperiences",
        method: "PUT",
        body: {
          doctorId,
          doctorExperienceId,
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
            if (entry?.endpointName === "getDoctorExperiences") {
              dispatch(
                doctorExperienceApi.util.updateQueryData(
                  "getDoctorExperiences",
                  entry.originalArgs,
                  (draft) => {
                    const idx = draft.data.findIndex(
                      (r) => r.id === updated.doctorExperienceId,
                    );

                    if (idx !== -1) {
                      draft.data[idx] = {
                        ...draft.data[idx],
                        ...updated,
                        id: updated.doctorExperienceId,
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
    deleteDoctorExperience: builder.mutation({
      query: ({ doctorId, doctorExperienceId }) => ({
        url: "/Doctors/DeleteDoctorExperiences",
        method: "DELETE",
        body: { doctorId, doctorExperienceId },
      }),

      async onQueryStarted(
        { doctorExperienceId },
        { dispatch, queryFulfilled, getState },
      ) {
        const state = getState();
        const queries = state[baseApi.reducerPath]?.queries ?? {};

        const patches = [];

        Object.values(queries).forEach((entry) => {
          if (entry?.endpointName === "getDoctorExperiences") {
            patches.push(
              dispatch(
                doctorExperienceApi.util.updateQueryData(
                  "getDoctorExperiences",
                  entry.originalArgs,
                  (draft) => {
                    draft.data = draft.data.filter(
                      (item) => item.id !== doctorExperienceId,
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
  useGetDoctorExperiencesQuery,
  useAddDoctorExperienceMutation,
  useUpdateDoctorExperienceMutation,
  useDeleteDoctorExperienceMutation,
} = doctorExperienceApi;
