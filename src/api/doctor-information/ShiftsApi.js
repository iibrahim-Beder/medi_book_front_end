import { baseApi } from "../baseApi";

export const doctorShiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorShifts: builder.query({
      query: (doctorId) => ({
        url: "/Doctors/GetDoctorShifts",
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, doctorId) => [
        { type: "DoctorShifts", id: doctorId },
      ],
      transformResponse: (response) => response.data,
    }),

    addShiftsStepToDoctor: builder.mutation({
      query: (payload) => ({
        url: "/Doctors/AddShiftsStepToDoctor",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(
        { doctorId, ...newShiftsData },
        { dispatch, queryFulfilled },
      ) {
        const tempShifts = newShiftsData.daysOfWeek.map((day, idx) => ({
          shiftId: `temp-${Date.now()}-${idx}`, 
          dayOfWeek: day,
          shiftTemplateId: newShiftsData.shiftTemplateId,
          shiftTemplateName: "",
          isActive: true,
          locationId: newShiftsData.locationId,
          locationName: "",
          breakStartTime: newShiftsData.breakStartTime,
          breakEndTime: newShiftsData.breakEndTime,
          isOptimistic: true,
        }));

        const patchResult = dispatch(
          doctorShiftsApi.util.updateQueryData(
            "getDoctorShifts",
            doctorId,
            (draft) => {
              draft.push(...tempShifts);
            },
          ),
        );

        try {
          await queryFulfilled;
          dispatch(
            doctorShiftsApi.util.invalidateTags([
              { type: "DoctorShifts", id: doctorId },
            ]),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "DoctorShifts", id: doctorId },
        { type: "ShiftDaysAvailability", },

      ],
    }),

    addShiftToDoctor: builder.mutation({
      query: (payload) => ({
        url: "/Doctors/AddShiftToDoctor",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(
        { doctorId, ...newShiftsData },
        { dispatch, queryFulfilled },
      ) {
        const tempShifts = newShiftsData.daysOfWeek.map((day, idx) => ({
          shiftId: `temp-${Date.now()}-${idx}`, 
          dayOfWeek: day,
          shiftTemplateId: newShiftsData.shiftTemplateId,
          shiftTemplateName: "",
          isActive: true,
          locationId: newShiftsData.locationId,
          locationName: "",
          breakStartTime: newShiftsData.breakStartTime,
          breakEndTime: newShiftsData.breakEndTime,
          isOptimistic: true,
        }));

        const patchResult = dispatch(
          doctorShiftsApi.util.updateQueryData(
            "getDoctorShifts",
            doctorId,
            (draft) => {
              draft.push(...tempShifts);
            },
          ),
        );

        try {
          await queryFulfilled;
          dispatch(
            doctorShiftsApi.util.invalidateTags([
              { type: "DoctorShifts", id: doctorId },
            ]),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "DoctorShifts", id: doctorId },
        { type: "ShiftDaysAvailability", },
      ],
    }),

    updateShift: builder.mutation({
      query: (payload) => ({
        url: "/Doctors/UpdateShift",
        method: "PUT",
        body: payload,
      }),
      async onQueryStarted(
        { doctorId, shiftId, ...updatedFields },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          doctorShiftsApi.util.updateQueryData(
            "getDoctorShifts",
            doctorId,
            (draft) => {
              const shift = draft.find((s) => s.shiftId === shiftId);
              if (shift) {
                Object.assign(shift, updatedFields);
              }
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            doctorShiftsApi.util.updateQueryData(
              "getDoctorShifts",
              doctorId,
              (draft) => {
                const index = draft.findIndex((s) => s.shiftId === shiftId);
                if (index !== -1) {
                  draft[index] = { ...draft[index], ...data.data };
                }
              },
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "DoctorShifts", id: doctorId },
      ],
    }),

    getShiftDaysAvailability: builder.query({
      query: ({ doctorId, shiftTemplateId }) => ({
        url: "/Doctors/GetShiftDaysAvailability",
        params: { DoctorID: doctorId, ShiftTemplateId: shiftTemplateId },
      }),
      providesTags: (result, error, { doctorId, shiftTemplateId }) => [
        { type: "ShiftDaysAvailability", id: `${doctorId}-${shiftTemplateId}` },
      ],
      transformResponse: (response) => response.data,
    }),

activateDoctorShift: builder.mutation({
  query: ({ shiftId }) => ({
    url: "/Doctors/ActivateShift",
    method: "GET",
    params: { ShiftId: shiftId },
  }),

  async onQueryStarted(
    { shiftId, doctorId },
    { dispatch, queryFulfilled }
  ) {

    const patchResult = dispatch(
      doctorShiftsApi.util.updateQueryData(
        "getDoctorShifts",
        doctorId,
        (draft) => {

          const shift = draft.find(
            (loc) => loc.shiftId === shiftId
          );

          if (shift) {
            shift.isActive = true;
          }

        }
      )
    );

    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }

  },
}),

deactivateDoctorShift: builder.mutation({
  query: ({ shiftId }) => ({
    url: "/Doctors/DeactivateShift",
    method: "GET",
    params: { ShiftId: shiftId },
  }),

  async onQueryStarted(
    { shiftId, doctorId },
    { dispatch, queryFulfilled }
  ) {

    const patchResult = dispatch(
      doctorShiftsApi.util.updateQueryData(
        "getDoctorShifts",
        doctorId,
        (draft) => {

          const shift = draft.find(
            (loc) => loc.shiftId === shiftId
          );

          if (shift) {
            shift.isActive = false;
          }

        }
      )
    );

    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }

  },
}),
  }),
});

export const {
  useGetDoctorShiftsQuery,
  useAddShiftsStepToDoctorMutation,
  useAddShiftToDoctorMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useGetShiftDaysAvailabilityQuery,
  useActivateDoctorShiftMutation,
  useDeactivateDoctorShiftMutation,
} = doctorShiftsApi;
