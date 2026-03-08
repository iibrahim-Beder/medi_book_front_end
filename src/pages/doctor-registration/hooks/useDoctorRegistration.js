
import {  useRef, useState } from "react"


export function useDoctorRegistration() {
  const [currentStep, setCurrentStep] = useState(5)
  const [completedSteps, setCompletedSteps] = useState([1,3,4])
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
