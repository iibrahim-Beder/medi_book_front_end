import { useTranslation } from "react-i18next";
import { useDoctorRegistration } from "./hooks/useDoctorRegistration";
import ProgressStepper from "./steps/ProgressStepper";
import { getStepsMeta } from "../../constants/formOptions";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import StepLocation from "./steps/StepLocation";
import ShiftStep from "./steps/ShiftStep";
import ButtonPrevious from "../ui/form-fields/ButtonPrevious";
import SuccessMessage from "./steps/SuccessMessage";
import "./DoctorRegistration.css";
import Step3ProfessionalInfo from "./steps/Step3ProfessionalInfo";
import AcademicQualifications from "../profile-settings/Profile-card/Education";
import DoctorExperience from "../profile-settings/Profile-card/Experience";

export default function DoctorRegistration({ openStepRegister ,setOpenStepRegister}) {
  const { t } = useTranslation();
  const {
    currentStep,
    completedSteps,
    stepRef,
    handleSave,
    handlePrevious,
    setCurrentStep,
    handleNextStep,
    doctorCurrentStepNumber
  } = useDoctorRegistration();

  console.log("currentStep", currentStep);
  return (
    <div className="doctor-registration">
      <div
        className="container"
        style={{ maxWidth: "1150px", overflow: "visible" }}
      >
        <ProgressStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          doctorCurrentStepNumber={doctorCurrentStepNumber}
          stepsMeta={getStepsMeta(t)}
        />
        {currentStep <= 6 ? (
          <div className="form-container">
            {currentStep === 1 && (
              <Step1PersonalInfo
                ref={stepRef}
                isNew={!completedSteps.includes(1)}
              />
            )}
            {currentStep === 2 && (
              <Step3ProfessionalInfo
                ref={stepRef}
                isNew={!completedSteps.includes(2)}
              />
            )}
            {currentStep === 3 && (
              <AcademicQualifications
                ref={stepRef}
                isNew={!completedSteps.includes(3)}
                register={true}
              />
            )}
            {currentStep === 4 && (
              <DoctorExperience
                ref={stepRef}
                isNew={!completedSteps.includes(4)}
                register={true}
              />
            )}
            {currentStep === 5 && (
              <StepLocation ref={stepRef} isNew={!completedSteps.includes(5)} register={true} />
            )}
            {currentStep === 6 && (
              <ShiftStep ref={stepRef} isNew={!completedSteps.includes(6)} MainHint={"You can also delete or add more than one work shift from inside."} />
            )}
            <div
              className="btn-container"
              style={{
                justifyContent:
                  currentStep === 1 ? "flex-end" : "space-between",
              }}
            >
              {currentStep !== 1 && <ButtonPrevious onClick={handlePrevious} />}

              {currentStep < 7 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  {((completedSteps.includes(currentStep)) || (currentStep ===3 || currentStep ===4)) && (
                    <button
                      type="button"
                      className="btn skip"
                      onClick={handleNextStep}
                      style={{
                        background: "#eee",
                        color: "#333",
                        border: "1px solid #ccc",
                      }}
                    >
                      {t("skip")}
                    </button>
                  )}
         { !((completedSteps.includes(currentStep)) && (currentStep ===3 || currentStep ===4)) &&        <button
                    type="button"
                    className="second-btn"
                    onClick={handleSave}
                  >
                    {t("save")}
                  </button>}
                </div>
              ) : (
                <button
                  type="submit"
                  className="dc-btn"
                  // onClick={handleSave}
                >
                  {t("confirmRegistration")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <SuccessMessage
          setOpenStepRegister={setOpenStepRegister}
          />
        )}
      </div>
    </div>
  );
}
