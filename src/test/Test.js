import { getStepsMeta } from "../constants/formOptions";
import ProgressStepper from "../pages/doctor-registration/steps/ProgressStepper";
import { useTranslation } from "react-i18next";
import ButtonPrevious from "../pages/ui/form-fields/ButtonPrevious";
import Step1PersonalInfo from "../pages/doctor-registration/steps/Step1PersonalInfo";
import { useDoctorRegistration } from "./useDoctorRegistration";
import SuccessMessage from "../pages/doctor-registration/steps/SuccessMessage";
import Step2ProfessionalInfo from "./Step2ProfessionalInfo";
import StepLocation from "./StepLocation";

export default function DoctorRegistration() {
  const { t } = useTranslation();
  const {
    currentStep,
    completedSteps,
    stepRef,
    handleSave,
    handlePrevious,
    setCurrentStep,
  } = useDoctorRegistration();
  console.log("currentStep", currentStep);
  return (
    <div className="doctor-registration">
      <div className="container" style={{ maxWidth: "1150px" }}>
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
                doctorId={103}
                isNew={!completedSteps.includes(1)}
              />
            )}
            {currentStep === 3 && (
              <Step2ProfessionalInfo
                ref={stepRef}
                doctorId={103}
                isNew={!completedSteps.includes(3)}
              />
            )}
            {currentStep === 4 && (
              <StepLocation
                ref={stepRef}
                doctorId={103}
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
