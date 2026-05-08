import { useMemo, useState, useEffect, useCallback } from "react";

import {
  useGetDoctorShiftRulesQuery,
  useAddGenerationRuleMutation,
  useUpdateGenerationRuleMutation,
  useActivateGenerationRuleMutation,
  useDeactivateGenerationRuleMutation,
  useLazyCheckRuleAvailabilityQuery,
} from "../../../api/doctor-information/generationRulesApi";

import toast from "react-hot-toast";
import { FaAppStoreIos } from "react-icons/fa";
import { useSelector } from "react-redux";
export default function useShiftRules({
  activeShift,
  activeTab,
}) {
  
  const doctorId = useSelector((state) => state.auth.doctorId);
  const {
    data: Maindata,
    isLoading,
    isFetching: isMainRulesFetching,
    isError,
    error,
    refetch,
  } = useGetDoctorShiftRulesQuery(
    {
      doctorId,
      shiftTemplateId: activeShift,
      dayOfWeek: activeTab,
    },
    {
      skip: !doctorId || !activeShift || !activeTab,
    },
  );
  // useEffect(() => {
  //   console.log("=====From  useShiftRules data", Maindata, "isError", isError);
  // }, [Maindata]);
  const [activateRule, { isLoading: isActivating }] =
    useActivateGenerationRuleMutation();

  const [deactivateRule, { isLoading: isDeactivating }] =
    useDeactivateGenerationRuleMutation();
  const [availabilityData, setAvailabilityData] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [addSlotData, setAddData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [checkAvailability, { isFetching: isFetchingAvailability }] =
    useLazyCheckRuleAvailabilityQuery();

  console.log("activeTab", activeTab, "selectedDays", selectedDays);
  const handleToggleRuleActive = useCallback(
    async (item) => {
      console.log(
        "=========ruleId",
        // indexId,
        "item",
        item,
        "isActive",
        item.isActive,
      );
      if (isActivating || isDeactivating) return;

      const loadingToast = toast.loading(
        item.isActive ? "Deactivating..." : "Activating...",
      );

      try {
        let result;

        if (item.isActive) {
          result = await deactivateRule({
            doctorId,
            ruleId: item.ruleId,
            shiftTemplateId: activeShift,
            dayOfWeek: activeTab,
          }).unwrap();
        } else {
          result = await activateRule({
            doctorId,
            ruleId: item.ruleId,
            shiftTemplateId: activeShift,
            dayOfWeek: activeTab,
          }).unwrap();
        }
        console.log("======= result after toggle", result);

        if (result?.succeeded) {
          toast.success(result.message || "Updated Successfully");

          // setRules((prev) =>
          //   prev.map((rule) =>
          //     rule.ruleId === indexId
          //       ? { ...rule, isActive: !item.isActive }
          //       : rule,
          //   ),
          // );
        }

        toast.dismiss(loadingToast);
      } catch (error) {
        console.error("Toggle rule failed", error);
        toast.error(error?.data?.message || "Failed to update rule");
        toast.dismiss(loadingToast);
      }
    },
    [
      doctorId,
      activeShift,
      activeTab,
      activateRule,
      deactivateRule,
      isActivating,
      isDeactivating,
    ],
  );
  const toggleDay = useCallback(
    (day) => {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
      );
    },
    [selectedDays],
  );
  const checkRuleAvailability = useCallback(
    async (start, end) => {
      if (!start || !end) return;

      try {
        setSelectedDays([]);
        const res = await checkAvailability({
          doctorId,
          shiftTemplateId: activeShift,
          startTime: start,
          endTime: end,
        }).unwrap();
        console.log("====availability check res", res);
        if (res?.succeeded) {
          setAvailabilityData(res.data);
          setSelectedDays(() => [activeTab]);
        }
      } catch (error) {
        console.error("availability check failed", error);
      }
    },
    [doctorId, activeShift, checkAvailability, activeTab],
  );
  const handleUpdateAddSlot = useCallback(
    (field, value) => {
      // console.log("======field", field, "value", value);

      setAddData((prev) => ({ ...prev, [field]: value }));

      if (field === "rangeTime") {
        checkRuleAvailability(value.start, value.end);
      }
    },
    [checkRuleAvailability],
  );

  const segments = useMemo(() => {
    const apiSegments = Maindata?.data?.designer?.segments || [];
    return apiSegments.map((seg, index) => {
      let type = "free";

      if (seg.type === "Rule") type = "busy";
      if (seg.type === "Break") type = "break";

      return {
        id: index + 1,
        start: seg.startTime ? timeToNumber(seg.startTime) : 0,
        end: seg.endTime ? timeToNumber(seg.endTime) : 0,
        type,
        ruleId: seg.ruleId,
        // ...seg,
        // ...(type === "busy" && { price: seg.price||0 }),
      };
    });
  }, [Maindata]);

  const [rules, setRules] = useState([]);
  const activeRules = rules?.filter((r) => r.isActive);
  const inactiveRules = rules?.filter((r) => !r.isActive);
  const [addRule, { isLoading: isAdding }] = useAddGenerationRuleMutation();
  const [updateRule, { isLoading: isUpdating }] =
    useUpdateGenerationRuleMutation();
  // =========================
  // Add Slot
  // =========================
  const applyRule = (itemToApplyed) => {
    console.log("itemToApplyed", itemToApplyed);
    setAddData({
      id: `slot-${Date.now()}`,
      SlotDurationInMinutes: itemToApplyed.SlotDurationInMinutes,
      rangeTime: {
        start: itemToApplyed.rangeTime.start,
        end: itemToApplyed.rangeTime.end,
      },
      Price: itemToApplyed.Price,
      Currency: itemToApplyed.Currency,
      AppointmentTypes: itemToApplyed.AllowedAppointmentTypes,
      isExpanded: true,
      isNew: true,
    });
    checkRuleAvailability(
      itemToApplyed.rangeTime.start,
      itemToApplyed.rangeTime.end,
    );
    setOpenModal(true);
  };
  useEffect(() => {
    // console.log("=====data", Maindata, "isError", isError, "activeShift", activeShift, "activeTab", activeTab , "the condition ",(!doctorId || !activeShift || !activeTab),"doctorId, activeShift, activeTab",doctorId, activeShift, activeTab);
    if (isError) {
      setRules([]);
      return;
    }
    const apiRules = Maindata?.data?.rules || [];
    setRules(apiRules.map(transformRuleData));
  }, [Maindata, isError, activeShift, activeTab]);
  useEffect(() => {
    setSelectedDays([]);
    setAddData({});
    setAvailabilityData([]);
  }, [activeShift, activeTab]);
  // =========================
  // Update Slot Field
  // =========================
  const handleUpdateSlot = useCallback((index, field, value) => {
    setRules((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  }, []);

  const handleUpdateActiveSlot = useCallback(
    (index, field, value) => {
      const rule = activeRules[index];
      const realIndex = rules.findIndex((r) => r.id === rule.id);

      handleUpdateSlot(realIndex, field, value);
    },
    [activeRules, rules, handleUpdateSlot],
  );

  const handleUpdateInactiveSlot = useCallback(
    (index, field, value) => {
      const rule = inactiveRules[index];
      const realIndex = rules.findIndex((r) => r.id === rule.id);

      handleUpdateSlot(realIndex, field, value);
    },
    [inactiveRules, rules, handleUpdateSlot],
  );

  // =========================
  // Save Slot (Add / Update)
  // =========================
  const handleSaveSlot = useCallback(
    async (slotId, slotData) => {
      if (isAdding || isUpdating) return;
      console.log("========slotData", slotData, "slotId", slotId, "rules", rules);
      if (!slotData) {
        toast.error("Please add a slot first");
        return;
      }
      if(!slotData.rangeTime?.start || !slotData.rangeTime?.end){
        toast.error("Please select a time range");
        return;
      }
      if(!slotData.SlotDurationInMinutes){
        toast.error("Please select a duration");
        return;
      }
      if(!slotData.Price){
        toast.error("Please select a price");
        return;
      }
      if(!slotData.AllowedAppointmentTypes?.length){
        toast.error("Please select a type");
        return;
      }
      const originalRecord = rules.find((r) => r.ruleId === slotData.ruleId);
      const payloadChanges = buildRuleUpdatePayload(originalRecord, slotData);
      if (!payloadChanges||!Object.keys(payloadChanges).length) {
        toast("no changes detected");
                setRules((prev) =>
            prev.map((slot) =>
              slot.ruleId === slotData.ruleId ? {...slot,  isExpanded: false } : slot,
            ),
          );
        
        return;
      }
      

      const loadingToast = toast.loading("Saving...");

      try {
        let success = false;
        
        // ===== UPDATE =====
        const payload =
        {
          ruleId: slotData.id,
          doctorId,
          shiftTemplateId: activeShift,
          dayOfWeek: activeTab,
          ...payloadChanges
        };
        console.log("=======payload", payload);
        // return;
        const result = await updateRule(payload).unwrap();
        console.log("=======result", result);

        if (result?.succeeded) {
          toast.success(result.message || "Updated Successfully");

          // setRules((prev) =>
          //   prev.map((slot) =>
          //     slot.id === slotId ? { ...slotData, isExpanded: false } : slot,
          //   ),
          // );

          success = true;
        }

        toast.dismiss(loadingToast);
        return success;
      } catch (error) {
        console.error("======== Failed to save slot", error);
        toast.error(error?.data?.message || "Error saving slot");
        toast.dismiss(loadingToast);
        return false;
      }
    },
    [
      doctorId,
      activeShift,
      activeTab,
      addRule,
      updateRule,
      isAdding,
      isUpdating,
      setRules,
      rules
    ],
  );

  const handleSaveNewSlots = useCallback(async () => {
    if (isAdding || isUpdating) return;
    console.log("======addSlotData", addSlotData, "selectedDays", selectedDays);
    if (!addSlotData) {
      toast.error("Please add a slot first");
      return;
    }
    if (
      !addSlotData.rangeTime ||
      !addSlotData.rangeTime.start ||
      !addSlotData.rangeTime.end
    ) {
      toast.error("Please add a start and end time for the slot");
      return;
    }
    if (!selectedDays || selectedDays.length === 0) {
      toast.error("Please add days for the slot");
      return;
    }
    if (!addSlotData.SlotDurationInMinutes) {
      toast.error("Please add a duration for the slot");
      return;
    }
    if (!addSlotData.Price) {
      toast.error("Please add a price for the slot");
      return;
    }
    if (
      !addSlotData.AppointmentTypes ||
      addSlotData.AppointmentTypes.length === 0
    ) {
      toast.error("Please add allowed appointment types for the slot");
      return;
    }

    const loadingToast = toast.loading("Saving...");

    try {
      let success = false;

      // ===== ADD =====
      const payload = {
        doctorId,
        shiftTemplateId: activeShift,
        dayOfWeek: activeTab,

        daysOfWeek: selectedDays,

        slotDurationInMinutes: Number(addSlotData.SlotDurationInMinutes),
        startTime: addSlotData.rangeTime.start,
        endTime: addSlotData.rangeTime.end,
        overrideAmount: Number(addSlotData.Price),
        allowedAppointmentTypes: "InPerson",
      };
      console.log("=======payload", payload);
      // return;

      const result = await addRule(payload).unwrap();
      console.log("=======result", result);

      if (result?.succeeded) {
        toast.success(result.message || "Added Successfully");

        success = true;
        setOpenModal(false);
      }

      toast.dismiss(loadingToast);
      return success;
    } catch (error) {
      console.log("=======Failed to save slot", error);
      toast.error(error?.data?.message || "Error saving slot");
      toast.dismiss(loadingToast);
      return false;
    }
  }, [
    doctorId,
    activeShift,
    activeTab,
    addRule,
    updateRule,
    isAdding,
    isUpdating,
    setRules,
    addSlotData,
    setAddData,
    selectedDays,
    setSelectedDays,
  ]);

  return {
    isLoading,
    isMainRulesFetching,
    applyRule,
    handleUpdateSlot,
    handleSaveSlot,
    segments,
    handleToggleRuleActive,
    rules,
    availabilityData,
    selectedDays,
    toggleDay,
    isFetchingAvailability,
    handleUpdateAddSlot,
    addSlotData,
    handleSaveNewSlots,
    activeRules,
    inactiveRules,
    handleUpdateActiveSlot,
    handleUpdateInactiveSlot,
    openModal,
    setOpenModal,
  };
}
// =======================================================================================================
export const transformRuleData = (rule) => {
  return {
    id: rule.generationRuleID || `rule-${Date.now()}`,
    ruleId: rule.generationRuleID,

    SlotDurationInMinutes: rule.slotDurationInMinutes,

    rangeTime: {
      start: rule.startTime?.slice(0, 5),
      end: rule.endTime?.slice(0, 5),
    },

    Price: rule.price,
    Currency: rule.currency,

    AllowedAppointmentTypes: rule.allowedAppointmentTypes
      ? rule.allowedAppointmentTypes.split(",")
      : [],

    isActive: rule.isActive,

    isNew: false,
    isExpanded: false,
  };
};

const timeToNumber = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

export const buildRuleUpdatePayload = (original, updated) => {
  const payload = {};

  console.log("======original", original, "updated", updated);

  // Price (حول String → Number عشان المقارنة)
  if (Number(original.Price) !== Number(updated.Price)) {
    payload.overrideAmount = Number(updated.Price);
  }
  // Slot Duration
  if (
    Number(original.SlotDurationInMinutes) !==
    Number(updated.SlotDurationInMinutes)
  ) {
    payload.SlotDurationInMinutes = Number(updated.SlotDurationInMinutes) || null;
  }

  // Appointment Types (array compare)
  const originalTypes = original.AllowedAppointmentTypes || [];
  const updatedTypes = updated.AllowedAppointmentTypes || [];

  if (
    originalTypes.length !== updatedTypes.length ||
    originalTypes.some((t, i) => t !== updatedTypes[i])
  ) {
    payload.AllowedAppointmentTypes = updatedTypes || null;
  }

  // Range Time
  if (
    original.rangeTime?.start !== updated.rangeTime?.start ||
    original.rangeTime?.end !== updated.rangeTime?.end
  ) {
    payload.startTime = updated.rangeTime.start || null;
    payload.endTime = updated.rangeTime.end || null;
  }
  
  return payload;
};