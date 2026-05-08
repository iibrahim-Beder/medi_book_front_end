
import {  useEffect, useRef, useState } from "react"
import { useStep1PersonalInfo } from "./useStep1BasicInfo";


export function useDoctorRegistration() {

  const {doctorCurrentStepNumber} =useStep1PersonalInfo();

const [currentStep, setCurrentStep] = useState(doctorCurrentStepNumber)
const [completedSteps, setCompletedSteps] = useState([]);

useEffect(() => {
  if (doctorCurrentStepNumber) {
    setCurrentStep(doctorCurrentStepNumber);

    setCompletedSteps(
      Array.from(
        { length: doctorCurrentStepNumber - 1 },
        (_, i) => i + 1
      )
    );
  }
}, [doctorCurrentStepNumber]);
  const stepRef = useRef(null)

//   useEffect(() => {
//     async function fetchRegistration() {
//     //   const res: RegistrationMeta = await fakeFetch()
//     //   setCurrentStep(res.currentStep)
//     //   setCompletedSteps(res.completedSteps)
//     }

//     fetchRegistration()
//   }, [])

  async function handleSave() {
    if (!stepRef.current?.submit) return

    const isSuccess = await stepRef.current.submit()

    if (isSuccess) {
      setCompletedSteps(prev =>
        prev.includes(currentStep)
          ? prev
          : [...prev, currentStep]
      )

      setCurrentStep(prev => prev + 1)
    }
  }

  function handlePrevious() {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return {
    currentStep,
    completedSteps,
    stepRef,
    handleSave,
    handlePrevious,
    setCurrentStep
  }
}
