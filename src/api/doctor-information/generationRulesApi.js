import { baseApi } from "../baseApi";

export const generationRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // GET SHIFT RULES
    // =========================
    getDoctorShiftRules: builder.query({
      query: ({ doctorId, shiftTemplateId, dayOfWeek }) => ({
        url: "/GenerationRule/GetDoctorShiftRules",
        params: {
          DoctorId: doctorId,
          ShiftTemplateId: shiftTemplateId,
          DayOfWeek: dayOfWeek,
        },
      }),
      providesTags: (
      ) => [
        {
          type: "ShiftRules",
        },
      ],
      transformResponse: (response, meta, arg) => {
        console.log('=====From  Get Doctor Shift Rules Response:', response);
        return response;
      },

      transformErrorResponse: (response, meta, arg) => {
        console.log('=====From  Get Doctor Shift Rules Error Response:', response);
        response.status = 400;
        return response;
      },
    }),

    // =========================
    // ADD RULE
    // =========================
    addGenerationRule: builder.mutation({
      query: (body) => ({
        url: "/GenerationRule/AddGenerationRule",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { doctorId, shiftTemplateId, dayOfWeek }) => [
        {
          type: "ShiftRules",
        },
      ],
    }),

    // =========================
    // UPDATE RULE
    // =========================
    updateGenerationRule: builder.mutation({
      query: (body) => ({
        url: "/GenerationRule/UpdateGenerationRule",
        method: "PUT",
        body,
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const realData = response.data;

          dispatch(
            generationRulesApi.util.updateQueryData(
              "getDoctorShiftRules",
              {
                doctorId: args.doctorId,
                shiftTemplateId: args.shiftTemplateId,
                dayOfWeek: args.dayOfWeek,
              },
              (draft) => {
                if (!draft?.data) return;

                draft.data.rules = realData.rules;

                if (draft.data.designer) {
                  draft.data.designer.segments = realData.designer.segments;
                }
              },
            ),
          );
        } catch (error) {
          console.error("UpdateGenerationRule failed", error);
        }
      },
    }),
    // =========================
    // ACTIVATE RULE
    // =========================
    activateGenerationRule: builder.mutation({
      query: ({ doctorId, ruleId }) => ({
        url: "/GenerationRule/ActivateGenerationRule",
        method: "PUT",
        params: {
          DoctorId: doctorId,
          RuleId: ruleId,
        },
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const realData = response.data;

          dispatch(
            generationRulesApi.util.updateQueryData(
              "getDoctorShiftRules",
              {
                doctorId: args.doctorId,
                shiftTemplateId: args.shiftTemplateId,
                dayOfWeek: args.dayOfWeek,
              },
              (draft) => {
                if (!draft?.data) return;

                draft.data.rules = realData.rules;

                if (draft.data.designer) {
                  draft.data.designer.segments = realData.designer.segments;
                }
              },
            ),
          );
        } catch (error) {
          console.error("ActivateGenerationRule failed", error);
        }
      },
    }),

    // =========================
    // DEACTIVATE RULE
    // =========================
    deactivateGenerationRule: builder.mutation({
      query: ({ doctorId, ruleId }) => ({
        url: "/GenerationRule/DeactivateGenerationRule",
        method: "PUT",
        params: {
          DoctorId: doctorId,
          RuleId: ruleId,
        },
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const realData = response.data;

          dispatch(
            generationRulesApi.util.updateQueryData(
              "getDoctorShiftRules",
              {
                doctorId: args.doctorId,
                shiftTemplateId: args.shiftTemplateId,
                dayOfWeek: args.dayOfWeek,
              },
              (draft) => {
                if (!draft?.data) return;

                draft.data.rules = realData.rules;

                if (draft.data.designer) {
                  draft.data.designer.segments = realData.designer.segments;
                }
              },
            ),
          );
        } catch (error) {
          console.error("DeactivateGenerationRule failed", error);
        }
      },
    }),
      // =========================
  // CHECK RULE AVAILABILITY
  // =========================
  checkRuleAvailability: builder.query({
    query: ({ doctorId, shiftTemplateId, startTime, endTime }) => ({
      url: "/GenerationRule/CheckRuleAvailability",
      params: {
        DoctorId: doctorId,
        ShiftTemplateId: shiftTemplateId,
        StartTime: startTime,
        EndTime: endTime,
      },
    }),
  }),
  }),
});

export const {
  useGetDoctorShiftRulesQuery,
  useAddGenerationRuleMutation,
  useUpdateGenerationRuleMutation,
  useActivateGenerationRuleMutation,
  useDeactivateGenerationRuleMutation,
  useCheckRuleAvailabilityQuery,
  useLazyCheckRuleAvailabilityQuery
} = generationRulesApi;
