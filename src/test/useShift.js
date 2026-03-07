// hooks/useShift.js
import { useMemo } from "react";
import {
  useGetDoctorShiftsQuery,
  useAddShiftsStepToDoctorMutation,
  useUpdateShiftMutation,
} from "../api/doctor-information/ShiftsApi";
import { useDoctorLocationsManager } from "../pages/location-settings/useDoctorLocations";
/**
 * useShift - هوك ينسق البيانات ويعطيك دوال للإضافة والتحديث
 * @param {number} doctorId
 */
export default function useShift(doctorId) {
  const { data: shifts = [], isLoading, error } = useGetDoctorShiftsQuery(doctorId, {
    // enabled: !!doctorId // لو بدك تمنع الجلب بدون id
  });

  const [addShiftsStepToDoctor, addResult] = useAddShiftsStepToDoctorMutation();
  const [updateShiftMutation, updateResult] = useUpdateShiftMutation();

  // تحويل المصفوفة إلى خريطة حسب dayOfWeek (0..6) لسهولة العرض
  const shiftsByDay = useMemo(() => {
    const map = Array.from({ length: 7 }, () => []);
    if (!Array.isArray(shifts)) return map;
    shifts.forEach((s) => {
      const d = Number(s.dayOfWeek);
      if (Number.isFinite(d) && d >= 0 && d <= 6) map[d].push(s);
    });
    // يمكنك ترتيب كل يوم حسب start time أو templateId إذا احتجت
    return map;
  }, [shifts]);
    const {locations}= useDoctorLocationsManager(doctorId)


  // دالة لإضافة وردية ليوم/ايام متعددة
  async function addShifts({ shiftTemplateId, locationId, breakStartTime, breakEndTime, daysOfWeek }) {
    // Normalize times to format "HH:MM:SS" (API responses تستخدم ثواني)
    const fmt = (t) => (t && t.length === 5 ? `${t}:00` : t || "00:00:00");
    const payload = {
      doctorId,
      shiftTemplateId: Number(shiftTemplateId),
      locationId: Number(locationId),
      breakStartTime: fmt(breakStartTime),
      breakEndTime: fmt(breakEndTime),
      daysOfWeek: Array.isArray(daysOfWeek) ? daysOfWeek.map(Number) : [Number(daysOfWeek)],
    };

    // تستدعي الـ mutation
    return addShiftsStepToDoctor(payload).unwrap();
  }

  // دالة لتحديث وردية مفردة (حسب شكل الـ payload اللي اديته)
  async function updateShift({ shiftId, locationId, breakStartTime, breakEndTime }) {
    const payload = {
      doctorId,
      shiftId,
      locationId: { value: Number(locationId) },
      breakStartTime: { value: (breakStartTime) },
      breakEndTime: { value: (breakEndTime) },
    };
    console.log("=============payload", payload);
    // return;

    return updateShiftMutation(payload).unwrap();
  }

  return {
    shiftsByDay, // مصفوفة 7 عناصر، كل عنصر مصفوفة الورديات لذلك اليوم
    rawShifts: shifts,
    isLoading,
    error,
    addShifts,
    updateShift,
    addResult,
    updateResult,
    locations,
  };
}