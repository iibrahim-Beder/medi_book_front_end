import { useMemo } from "react";
import {
  useGetDoctorShiftsQuery,
  useUpdateShiftMutation,
  useActivateDoctorShiftMutation,
  useDeactivateDoctorShiftMutation,
} from "../../../api/doctor-information/ShiftsApi";
import { useDoctorLocationsManager } from "../../location-settings/useDoctorLocations";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function useShift() {
  const doctorId = useSelector((state) => state.auth.doctorId);

  const { data: shifts = [], isLoading, error } = useGetDoctorShiftsQuery(doctorId, {
    skip: !doctorId
  });
  const [updateShiftMutation, updateResult] = useUpdateShiftMutation();


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
const toggleActiveStatus = async (shiftId, newActiveState) => {
  console.log("shiftId", shiftId, "newActiveState", newActiveState);

  if (!doctorId) return;

  const loader = toast.loading("loading");
 
  try {
    
    let result ;
    if (newActiveState) {
    result =  await activateShift({ shiftId, doctorId }).unwrap();
    } else {
   result =   await deactivateShift({ shiftId, doctorId }).unwrap();
    }

    console.log("=====result", result);
    if (result.succeeded) {
      toast.success("Status Updated");
    }

  } catch (error) {
    toast.error("Error updating status");
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
    toggleActiveStatus
  };
}