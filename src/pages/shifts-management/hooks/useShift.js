import { useEffect, useMemo, useState } from "react";
import {
  useGetDoctorShiftsQuery,
  useUpdateShiftMutation,
  useActivateDoctorShiftMutation,
  useDeactivateDoctorShiftMutation,
  useGetShiftDaysAvailabilityQuery,
} from "../../../api/doctor-information/ShiftsApi";
import { useDoctorLocationsManager } from "../../location-settings/useDoctorLocations";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/api-errors";

export default function useShift() {
  const doctorId = useSelector((state) => state.auth.doctorId);

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);


  const { data: shifts = [], isLoading, error } = useGetDoctorShiftsQuery(doctorId, {
    skip: !doctorId
  });
  const [updateShiftMutation, updateResult] = useUpdateShiftMutation();

    const {
      data: availabilityData,
      isLoading: loadingAvailability,
      error: availabilityError,
      isError: isAvailabilityError,
      isFetching: isFetchingAvailability,
      refetch: refetchAvailability,
    } = useGetShiftDaysAvailabilityQuery(
      { doctorId, shiftTemplateId: selectedTemplateId },
      { skip: !doctorId || !selectedTemplateId }
    );
    useEffect(() => {
      setSelectedDays([]);
    }, [selectedTemplateId]);
      const toggleDay = (dayOfWeek) => {
    // setErrors((prev) => ({ ...prev, selectedDays: null }));
    setSelectedDays((prev) =>
      prev.includes(dayOfWeek)
        ? prev.filter((d) => d !== dayOfWeek)
        : [...prev, dayOfWeek]
    );
  };

  const shiftsByDay = useMemo(() => {
    const map = Array.from({ length: 7 }, () => []);
    if (!Array.isArray(shifts)) return map;
    shifts.forEach((s) => {
      const d = Number(s.dayOfWeek);
      if (Number.isFinite(d) && d >= 0 && d <= 6) map[d].push(s);
    });
    return map;
  }, [shifts]);
  console.log("shiftsByDay", shiftsByDay);
  
    const {locations}= useDoctorLocationsManager()

     const [ activateShift] =    useActivateDoctorShiftMutation();  
      const [deactivateShift] = useDeactivateDoctorShiftMutation();


  async function updateShift({ shiftId, locationId, breakStartTime, breakEndTime }) {
    const payload = {
      doctorId,
      shiftId,
      locationId: { value: Number(locationId) },
      breakStartTime: { value: (breakStartTime) },
      breakEndTime: { value: (breakEndTime) },
    };
    console.log("payload", payload);
    const shift = shifts.find((s) => s.shiftId === shiftId)
    const templateTime = templates.find((s) => s.templateId === shift.shiftTemplateId)
    console.log("=============payload", payload, "shift", shift,"templateTime",templateTime);
    if (!shiftId)
      return false ;
    if (!locationId){
      toast.error("Location is required");
      return false ;}
         
          if((breakStartTime !== templateTime.startTime) && (breakEndTime  || breakStartTime)){
            if (breakStartTime  < templateTime.startTime) {
              toast.error("Break start time must be greater than shift start time");
              return false;
            }
            if (breakEndTime > templateTime.endTime) {
              toast.error("Break end time must be less than shift end time");
              return false;
            }
          if(breakStartTime  >= breakEndTime){
            toast.error("Break start time must be less than break end time");
            return false ;
          }
          }
   
    return updateShiftMutation(payload).unwrap();
  }
const toggleActiveStatus = async (shiftIds, newActiveState) => {
  console.log("shiftIds", shiftIds, "newActiveState", newActiveState);

  if (!doctorId) return;

  const loader = toast.loading("loading");
 
  try {
    
    let result ;
    if (newActiveState) {
    result =  await activateShift({ shiftIds, doctorId }).unwrap();
    } else {
   result =   await deactivateShift({ shiftIds, doctorId }).unwrap();
    }

    console.log("=====result", result);
    if (result.succeeded) {
      toast.success("Status Updated");
    }

  } catch (error) {
    console.log("error", error);
    toast.error(getErrorMessage(error));
  } finally {
    toast.dismiss(loader);
  }
};
  
    const templates = [
    { templateId: 0, name: "Select time template", startTime: "", endTime: "" },
    { templateId: 7, name: "Morning", startTime: "08:00", endTime: "12:00" },
    { templateId: 8, name: "Afternoon", startTime: "12:00", endTime: "16:00" },
    { templateId: 9, name: "Evening", startTime: "16:00", endTime: "20:00" },
    { templateId: 10, name: "Night", startTime: "20:00", endTime: "23:59" },
  ];

  return {
    shiftsByDay, 
    rawShifts: shifts,
    isLoading,
    error,
    updateShift,
    updateResult,
    locations,
    templates,
    toggleActiveStatus,
    availabilityData,
    loadingAvailability,
    availabilityError,
    isAvailabilityError,
    isFetchingAvailability,
    refetchAvailability,
    setSelectedTemplateId,
    selectedDays,
    toggleDay,
    setSelectedDays,
  };
}