import { useTranslation } from "react-i18next";
import { useDoctorRegistration } from "./hooks/useDoctorRegistration";
import ProgressStepper from "./steps/ProgressStepper";
import { getStepsMeta } from "../../constants/formOptions";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import StepLocation from "./steps/StepLocation";
import ShiftStep from "./steps/ShiftStep";
import ButtonPrevious from "../ui/form-fields/ButtonPrevious";
import SuccessMessage from "./steps/SuccessMessage";
import './DoctorRegistration.css';
import Step3ProfessionalInfo from "./steps/Step3ProfessionalInfo";
import AcademicQualifications from "../profile-settings/Profile-card/Education";
import DoctorExperience from "../profile-settings/Profile-card/Experience";
import { useSelector } from "react-redux";

export default function DoctorRegistration({currentStepFromParent=null}) {
  const { t } = useTranslation();
  const {
    currentStep,
    completedSteps,
    stepRef,
    handleSave,
    handlePrevious,
    setCurrentStep,
  } = useDoctorRegistration(currentStepFromParent);
const doctorId = useSelector((state) => state.auth.doctorId);
console.log("================doctorId", doctorId);

  console.log("currentStep", currentStep);
  return (
    <div className="doctor-registration">
      <div className="container" style={{ maxWidth: "1150px", overflow: "visible" }}>
        <ProgressStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          stepsMeta={getStepsMeta(t)}
        />
        {true ? (
          <div className="form-container">
            {/* {renderCurrentStep()} */}
            {currentStep === 1 && (
              <Step1PersonalInfo
                ref={stepRef}
                isNew={!completedSteps.includes(1)}
              />
            )}
            {currentStep === 2 && (
              <AcademicQualifications
                ref={stepRef}
                isNew={!completedSteps.includes(1)}
              />
            )}
            {currentStep === 3 && (
              <Step3ProfessionalInfo
                ref={stepRef}
                isNew={!completedSteps.includes(3)}
              />
            )}
            {currentStep === 4 && (
              <StepLocation
                ref={stepRef}
                isNew={!completedSteps.includes(4)}
              />
            )}
            {currentStep === 5 && (
              <ShiftStep
                ref={stepRef}
                isNew={!completedSteps.includes(4)}
              />
            )}
            {currentStep === 6 && (
              <DoctorExperience
                ref={stepRef}
                isNew={!completedSteps.includes(4)}
              />
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
                  {(currentStep !== 1 || completedSteps.includes(currentStep))&& (
                    <button
                      type="button"
                      className="btn skip"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      style={{
                        background: "#eee",
                        color: "#333",
                        border: "1px solid #ccc",
                      }}
                    >
                      {t("skip")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="second-btn"
                    onClick={handleSave}
                  >
                    {t("save")}
                  </button>
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
          // resetForm={resetForm}
          />
        )}
      </div>
    </div>
  );
}
