import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  useGetShiftDaysAvailabilityQuery,
  useAddShiftsStepToDoctorMutation,
} from '../../../api/doctor-information/ShiftsApi';
import { useDoctorLocationsManager } from '../../location-settings/useDoctorLocations';



const useAddShifts = (doctorId) => {
  const { t } = useTranslation();

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [breakTimes, setBreakTimes] = useState({ start: '', end: '' });
  const [selectedDays, setSelectedDays] = useState([]);
  const {locations}= useDoctorLocationsManager(doctorId)
  console.log("locations",locations);
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
    { templateId: 0, name: "Select time template", startTime: "", endTime: "" },
    { templateId: 7, name: "Morning", startTime: "08:00", endTime: "12:00" },
    { templateId: 8, name: "Afternoon", startTime: "12:00", endTime: "16:00" },
    { templateId: 9, name: "Evening", startTime: "16:00", endTidme: "20:00" },
    { templateId: 11, name: "Night", startTime: "20:00", endTime: "23:59" },
  ];

  const [addShifts, { isLoading: isAdding }] = useAddShiftsStepToDoctorMutation();

  useEffect(() => {
    setSelectedDays([]);
    setBreakTimes({ start: '', end: '' });
  }, [selectedTemplateId]);

  useEffect(() => {
    setSelectedDays([]);
  }, [selectedLocationId]);

  const toggleDay = (dayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(dayOfWeek)
        ? prev.filter((d) => d !== dayOfWeek)
        : [...prev, dayOfWeek]
    );
  };

  const handleSave = async () => {
const SelectedTemplate = templates.find(
  (template) => template.templateId === Number(selectedTemplateId));    // const templateTime = { startTime: SelectedTemplate.startTime, endTime: SelectedTemplate.endTime };
    console.log("templates",templates,"selectedTemplateId",selectedTemplateId,"selectedLocationId",selectedLocationId,"selectedDays",selectedDays,"breakTimes",breakTimes,"templateTime",SelectedTemplate);
    
    if (!selectedTemplateId) {
      toast.error(t('shift.selectTemplate'));
      return;
    }
    if (!selectedLocationId) {
      toast.error(t('shift.selectLocation'));
      return;
    }
    if (selectedDays.length === 0) {
      toast.error(t('shift.selectAtLeastOneDay'));
      return;
    }
         if (!breakTimes.end) {}
         if (!breakTimes.start) {
          toast.error("Break start time is required");
          return false ;}
          if (breakTimes.start  < SelectedTemplate.startTime) {
            toast.error("Break start time must be greater than shift start time");
            return false;
          }
          if (breakTimes.end > SelectedTemplate.endTime) {
            toast.error("Break end time must be less than shift end time");
            return false;
          }
          if (!breakTimes.end){
          toast.error("Break end time is required");return false };
        if(breakTimes.start  >= breakTimes.end){
          toast.error("Break start time must be less than break end time");
          return false ;
        }
    // if (!breakTimes.start || !breakTimes.end) {
    //   toast.error(t('shift.setBreakTimes'));
    //   return;
    // }

    const loader = toast.loading(t("loading"));
    try {
      console.log("selectedTemplateId",selectedTemplateId,"selectedLocationId",selectedLocationId,"selectedDays",selectedDays,"breakTimes",breakTimes);
      const result = await addShifts({
        doctorId,
        locationId: selectedLocationId,
        shiftTemplateId: selectedTemplateId,
        daysOfWeek: selectedDays,
        breakStartTime: breakTimes.start,
        breakEndTime: breakTimes.end,
      }).unwrap();

      console.log("====result",result);
      toast.success(t('shift.addedSuccess'));
      setSelectedDays([]);
      setBreakTimes({ start: '', end: '' });
      // refetchAvailability();
      return result;
    } catch (err) {
      toast.error(err?.data?.message || t('common.error'));
      throw err;
    }finally {
      toast.dismiss(loader);
    }
  };

  console.log("availabilityData",availabilityData);
  return {
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
    templates
  };
};

export default useAddShifts;