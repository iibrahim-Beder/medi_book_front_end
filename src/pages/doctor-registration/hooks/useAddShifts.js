import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  useGetShiftDaysAvailabilityQuery,
  useAddShiftsStepToDoctorMutation,
  useAddShiftToDoctorMutation,
} from '../../../api/doctor-information/ShiftsApi';
import { useDoctorLocationsManager } from '../../location-settings/useDoctorLocations';
import { useSelector } from 'react-redux';
import { getErrorMessage } from '../../utils/api-errors';



const useAddShifts = (New) => {

  const doctorId = useSelector((state) => state.auth.doctorId);

  const { t } = useTranslation();

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [breakTimes, setBreakTimes] = useState({ start: '', end: '' });
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [errors, setErrors] = useState({});
  
  const {locations ,isLoading:isLoadingLocations}= useDoctorLocationsManager(doctorId)

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
  const templates = [
    { templateId: 0, name: "Select time template", startTime: "", endTime: ""  },
    { templateId: 7, name: "Morning 08:00 AM - 12:00 PM", startTime: "08:00", endTime: "12:00" },
    { templateId: 8, name: "Afternoon 12:00 PM - 04:00 PM", startTime: "12:00", endTime: "16:00" },
    { templateId: 9, name: "Evening 04:00 PM - 08:00 PM", startTime: "16:00", endTime: "20:00" },
    { templateId: 11, name: "Night 08:00 PM - 11:59 PM", startTime: "20:00", endTime: "23:59" },
  ];

  const [addShifts, { isLoading: isAdding }] = useAddShiftsStepToDoctorMutation();
  const [addShift, { isLoading: isAddingShift }] = useAddShiftToDoctorMutation();

  useEffect(() => {
    setSelectedDays([]);
    setBreakTimes({ start: '', end: '' });
    setErrors((prev) => ({ ...prev, selectedTemplateId: null }));
  }, [selectedTemplateId]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, selectedLocationId: null }));
  }, [selectedLocationId]);


  const toggleDay = (dayOfWeek) => {
    setErrors((prev) => ({ ...prev, selectedDays: null }));
    setSelectedDays((prev) =>
      prev.includes(dayOfWeek)
        ? prev.filter((d) => d !== dayOfWeek)
        : [...prev, dayOfWeek]
    );
  };

  const handleSave = async () => {
    if(isAddingShift || isAdding) return;

    const SelectedTemplate = templates.find(
  (template) => template.templateId === Number(selectedTemplateId));  
    
     if (!validateForm()) {
      toast.error("fill all the required fields");
      return false;
    }

   
    if((breakTimes.start !== SelectedTemplate.startTime) && (breakTimes.end  || breakTimes.start)){
      if (breakTimes.start  < SelectedTemplate.startTime) {
        toast.error("Break start time must be greater than shift start time");
        return false;
      }
      if (breakTimes.end > SelectedTemplate.endTime) {
        toast.error("Break end time must be less than shift end time");
        return false;
      }
    if(breakTimes.start  >= breakTimes.end){
      toast.error("Break start time must be less than break end time");
      return false ;
    }
    }


    const loader = toast.loading(t("loading"));
    try {
      console.log("selectedTemplateId",selectedTemplateId,"selectedLocationId",selectedLocationId,"selectedDays",selectedDays,"breakTimes",breakTimes.start || null,breakTimes.end || null);
      if(New){
        await addShifts({
            doctorId,
            locationId: selectedLocationId,
            shiftTemplateId: selectedTemplateId,
            daysOfWeek: selectedDays,
            breakStartTime: breakTimes.start || null,
            breakEndTime: breakTimes.end || null,
          }).unwrap();
          
        }else{
        await addShift({
            doctorId,
            locationId: selectedLocationId,
            shiftTemplateId: selectedTemplateId,
            daysOfWeek: selectedDays,
            breakStartTime: breakTimes.start,
            breakEndTime: breakTimes.end,
          }).unwrap();
      }

      toast.success(t('Shift added successfully'));
      setSelectedDays([]);
      setBreakTimes({ start: '', end: '' });
      // refetchAvailability();
      return true;
    } catch (err) {
      console.error("====err ",err);
      toast.error(getErrorMessage(err));
    }finally {
      toast.dismiss(loader);
    }
  };
   const validateForm = () => {
    const newErrors = {};

    if (!selectedTemplateId)
      newErrors.selectedTemplateId = t("Selec Template required");

    if (!selectedLocationId || selectedLocationId === "empty")
      newErrors.selectedLocationId = t("Selec Location required");

    if (selectedDays.length === 0)
      newErrors.selectedDays = t("Selec Days of week required");

    setErrors(newErrors);
    console.log("errors",errors);
    return Object.keys(newErrors).length === 0;
  };
  
  const selectedTemplate = templates.find(
  (tmpl) => tmpl.templateId === Number(selectedTemplateId)
);

  return {
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplateId,
    selectedLocationId,
    setSelectedLocationId,
    breakTimes,
    setBreakTimes,
    selectedDays,
    toggleDay,
    availabilityData,
    loadingAvailability,
    availabilityError,
    handleSave,
    isAdding,
    locations,
    isFetchingAvailability,
    templates,
    isLoadingLocations,
    errors,
  };
};

export default useAddShifts;