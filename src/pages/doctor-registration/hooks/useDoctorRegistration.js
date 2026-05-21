import { useEffect, useRef, useState } from "react";
import { useGetDoctorCurrentStepQuery, useUpdateCurrentDoctorStepMutation } from "../../../api/doctor-information/doctorBasicInfoApi";
import { useSelector } from "react-redux";

export function useDoctorRegistration() {
  const doctorId = useSelector((state) => state.auth.doctorId);

  const {
    data: currentStepData,
    isLoading: isCurrentStepLoading,
    error: currentStepError,
    isError: isCurrentStepError,
    refetch: refetchCurrentStep,
    isFetching
  } = useGetDoctorCurrentStepQuery(doctorId, {
    skip: !doctorId,
  });
  const [updateCurrentDoctorStep, { isLoading }] =
  useUpdateCurrentDoctorStepMutation();

  // NEW
  const doctorCurrentStep = currentStepData?.data || null;
  // const doctorCurrentStep = "Locations";

  const DoctorRegistrationStep = {
    BasicInfo: 1 ,
    ProfileAndSpecialties: 2,
    Education: 3,
    Experience: 4,
    Locations: 5,
    Shifts: 6,
    all: 7
  };

  const doctorCurrentStepNumber =
    DoctorRegistrationStep[doctorCurrentStep] || 1;

  const completedStepsPercent = Math.round(
    ((doctorCurrentStepNumber - 1) /
      Object.keys(DoctorRegistrationStep).length) *
      100,
  );
  const stepCompleted = {
    BasicInfo: doctorCurrentStepNumber > DoctorRegistrationStep.BasicInfo,
    ProfileAndSpecialties:
      doctorCurrentStepNumber > DoctorRegistrationStep.ProfileAndSpecialties,
    Education: doctorCurrentStepNumber > DoctorRegistrationStep.Education,
    Experience: doctorCurrentStepNumber > DoctorRegistrationStep.Experience,
    Locations: doctorCurrentStepNumber > DoctorRegistrationStep.Locations,
    // dont forget to fix this issue =============================================================================== dont forget to fix this issue
    Shifts: doctorCurrentStepNumber > DoctorRegistrationStep.Shifts - 1,
    All: doctorCurrentStepNumber > Object.keys(DoctorRegistrationStep).length - 2,
  };

  const [currentStep, setCurrentStep] = useState(doctorCurrentStepNumber);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (doctorCurrentStepNumber) {
      setCurrentStep(doctorCurrentStepNumber);

      setCompletedSteps(
        Array.from({ length: doctorCurrentStepNumber - 1 }, (_, i) => i + 1),
      );
    }
  }, [doctorCurrentStepNumber]);
  const stepRef = useRef(null);


  async function handleSave() {
    if (!stepRef.current?.submit) return;

    const isSuccess = await stepRef.current.submit();

    if (isSuccess) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep],
      );
      if (currentStep >= doctorCurrentStepNumber){refetchCurrentStep();};

      setCurrentStep((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }
const handleNextStep = async () => {
  console.log("Response currentStep", currentStep, "doctorCurrentStepNumber", doctorCurrentStepNumber);
  setCurrentStep((prev) => prev + 1);
  if (currentStep >= doctorCurrentStepNumber) {
    try {
      const response = await updateCurrentDoctorStep(doctorId).unwrap();

      console.log("Update Current Doctor Step Response:", response);

      await refetchCurrentStep();
    } catch (error) {
      console.error(error);
    }
  }
};

  return {
    currentStep,
    completedSteps,
    stepRef,
    handleSave,
    handlePrevious,
    setCurrentStep,
    doctorCurrentStep,
    isCurrentStepLoading,
    currentStepError,
    isCurrentStepError,
    doctorCurrentStepNumber,
    completedStepsPercent,
    refetchCurrentStep,
    isFetching,
    stepCompleted,
    DoctorRegistrationStep,
    handleNextStep
  };
}
