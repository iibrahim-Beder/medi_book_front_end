import React, { useEffect, useState } from "react";
import ProgressStepper from "./steps/ProgressStepper";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2ProfessionalInfo from "./steps/Step3ProfessionalInfo";
import Step2Qualifications from "./steps/Step2Qualifications";
import Step4Experience from "./steps/Step4Experience";
import Step5Review from "./steps/Step9Review";
import SuccessMessage from "./steps/SuccessMessage";
import { useForm } from "../../hooks/Useform";
import { TOTAL_STEPS, getStepsMeta } from "../../constants/formOptions";
import "./DoctorRegistration.css";
import { useTranslation } from "react-i18next";
import { validateStep as validateStepUtil } from "./utils/validation";
import PopupMessage from "../shareds/PopupMessage";
import LocationField from "../location-settings/carts/LocationField";
import SectionTitle from "../shareds/SectionTitle";
import { CiLocationOn } from "react-icons/ci";
import ShiftsManager from "../shift-settings/ShiftsManager";
import { PiCalendarCheckLight } from "react-icons/pi";
import MakeSlotsMain from "../making-slots/MakeSlostMain";
import { CiClock1 } from "react-icons/ci";
import PaymentInsuranceStep from "./steps/Step8paymentMethods";
     
   

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {setExperiences} from "../../redux/Slices/doctor-information/experienceSlice";
import {setProfessionalInfo} from "../../redux/Slices/doctor-information/professionalInfoSlice";
import {setPersonalInfo} from "../../redux/Slices/doctor-information/personalInfoSlice";
import {setQualifications} from "../../redux/Slices/doctor-information/qualificationsSlice";
import {setLocations} from "../../redux/Slices/doctor-information/locationsSlice";

export default function DoctorRegistration() {

  
  const experiencesFromRedux = useSelector((state) => state.experience);
  const professionalInfoFromRedux = useSelector((state) => state.professionalInfo);
  const personalInfoFromRedux = useSelector((state) => state.personalInfo);
  // const qualificationsFromRedux = useSelector((state) => state.qualifications);
  const [stepData, setStepData] = useState();


  const dispatch = useDispatch();
  

  const { t } = useTranslation();
  const {
    formData,
    currentStep,
    showSuccess,
    setCurrentStep,
    setShowSuccess,
    handleInputChange,
    resetForm,
    setErrors
  } = useForm();

  const [showPopup, setShowPopup] = useState(false);
  const [btnOk, setBtnOk] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [popupErrors, setPopupErrors] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentStep === 1) {
      setStepData(personalInfoFromRedux);
    }else if (currentStep === 4) {
      setStepData(experiencesFromRedux);
    }else if (currentStep === 3) {
      setStepData(professionalInfoFromRedux);
    }

  }, [currentStep]);

useEffect(() => {
  const dataForStep = currentStep === 7
    ? { ...formData, experiences: stepData }
    : formData;
    if (currentStep === 1) {
     Object.assign(dataForStep, stepData);
    } else if (currentStep === 3) {
     Object.assign(dataForStep, stepData);
    }

  const errors = validateStepUtil(currentStep, dataForStep, t);
  setValidationErrors(errors);
}, [currentStep, formData, t, stepData]);

  const isStepValid = Object.keys(validationErrors).length === 0;
  
 const handleCheckboxChange = (e) => {
  const { name, type, checked, value } = e.target;
  handleInputChange({
    target: {
      name,
      value: type === "checkbox" ? checked : value,
    }
  });
};

  const handleCheckboxChangee = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // For checkbox inputs, we need to handle arrays of values
      const currentValues = Array.isArray(formData[name]) ? formData[name] : [];
      
      if (checked) {
        // Add the value to the array if it's checked
        handleInputChange({
          target: {
            name,
            value: [...currentValues, value]
          }
        });
      } else {
        // Remove the value from the array if it's unchecked
        handleInputChange({
          target: {
            name,
            value: currentValues.filter(item => item !== value)
          }
        });
      }
    } else {
      // For other input types, use the normal handleInputChange
      handleInputChange(e);
    }
  };
const [isSaveClicked, setIsSaveClicked] = useState(false);

  const nextStep = () => {
      setIsSaveClicked(true);

    if (isStepValid) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
      if (currentStep === 7) {
        dispatch(setExperiences(stepData));
      } else if (currentStep === 3) {
        dispatch(setProfessionalInfo(stepData));
      } else if (currentStep === 1) {
        dispatch(setPersonalInfo(stepData));
      }else if (currentStep === 2) {
        dispatch(setQualifications( formData.qualifications));
      }
      else if (currentStep === 4) {
        // console.log("Dispatching locations on step 4:", formData.locations);
        // dispatch(setLocations( formData.locations));
      }
           

      setIsSaveClicked(false);
    } else {
      setPopupErrors(Object.values(validationErrors));
      setShowPopup(true);
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const skipStep = () => {
    if (currentStep === 4 || currentStep === 5) {
setPopupErrors(t("popup.skipToStep7"));
      setShowPopup(true);
      setBtnOk(true);
    } else {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const submitForm = () => {
    // Final validation before submission
    const errors = validateStepUtil(9, formData, t);
    if (Object.keys(errors).length > 0) {
      setPopupErrors(Object.values(errors));
      setShowPopup(true);
      return;
    }
    setShowSuccess(true);
  };

  // Create a safe version of setErrors
  const handleSetErrors = (errors) => {
    if (setErrors && typeof setErrors === 'function') {
      setErrors(errors);
    } else {
      // Fallback if setErrors is not available
      setValidationErrors(errors);
    }
  };
  

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
       <Step1PersonalInfo
        initialData={stepData}
        onChange={setStepData}
        errors={validationErrors}
        forceShowError={isSaveClicked}  
      />
        );
      case 2:
        return (
            <Step2Qualifications
              formData={formData}
              handleInputChange={handleInputChange}
              errors={validationErrors}
                forceShowError={isSaveClicked}  
            />
        );
      case 3:
        return (
          <Step2ProfessionalInfo
            initialData={stepData}
            onChange={setStepData}
            errors={validationErrors}
            forceShowError={isSaveClicked}   
          />
        );
      case 4:
        return (
          <LocationField
            header={false}
            formData={formData.locations}
            // handleInputChange={handleInputChange}
            errors={validationErrors}
            ComponentProp={
              <SectionTitle
                icon={<CiLocationOn />}
                title={t("locationInfo.title")}
              />
            }
            locations={formData.locations || []}
            onSave={(updatedLocations) =>
              handleInputChange({
                target: {
                  name: "locations",
                  value: updatedLocations,
                },
              })
            }
            onAdd={(newLocations) =>
              handleInputChange({
                target: {
                  name: "locations",
                  value: newLocations,
                },
              })
            }
            onDelete={(index) => {
              const updatedLocations = [...formData.locations];
              updatedLocations.splice(index, 1);
              handleInputChange({
                target: {
                  name: "locations",
                  value: updatedLocations,
                },
              });
            }}
          />
        );
      case 5:
        return (
          <ShiftsManager
            regist={true}
            header={false}
            formData={formData}
            onShiftsChange={(updatedShifts) => handleInputChange({
              target: {
                name: 'shifts',
                value: updatedShifts
              }
            })}
            errors={validationErrors}
            ComponentProp={
              <SectionTitle
                icon={<PiCalendarCheckLight />}
                title={t("shifts.title")}
              />
            }
          />
        );
      case 6:
        return (
          <>
            <SectionTitle
              icon={<CiClock1 />}
              title={t("Management slots")}
            />
            <MakeSlotsMain
              header={false}
              formData={formData}
              onSlotsChange={(updatedSlots) => handleInputChange({
                target: {
                  name: 'slots',
                  value: updatedSlots
                }
              })}
              errors={validationErrors}
            />
          </>
        );
      case 7:
        
        return (
          <Step4Experience
             initialExperiences={stepData}
             onChange={setStepData}
             ComponentProp={<SectionTitle
                icon={<CiLocationOn />}
                title={t("Experience.title")}
              />}
             header={false}
             errors={validationErrors}
             forceShowError={isSaveClicked}  />
    
        );
      case 8:
        return (
          <PaymentInsuranceStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChangee}
            errors={validationErrors}
            setErrors={handleSetErrors}
          />
        );
      case 9:
        return (
          <Step5Review
            formData={formData}
            handleInputChange={handleCheckboxChange}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="doctor-registration">
      <div className="container" style={{maxWidth:"1150px"}}>
        <ProgressStepper
          currentStep={currentStep}
          stepsMeta={getStepsMeta(t)}
        />

        {!showSuccess ? (
          <div className="form-container">
            {renderCurrentStep()}
            <div
              className="btn-container"
              style={{
                justifyContent:
                  currentStep === 1 ? "flex-end" : "space-between",
              }}
            >
              {currentStep !== 1 && (
                <button
                  type="button"
                  className="btn prev"
                  disabled={currentStep === 1}
                  onClick={prevStep}
                >
                  {t("previous")}
                </button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  {currentStep !== 1 && (
                    <button
                      type="button"
                      className="btn skip"
                      onClick={skipStep}
                      style={{
                        background: "#eee",
                        color: "#333",
                        border: "1px solid #ccc",
                      }}
                    >
                      {t("skip")}
                    </button>
                  )}
                  <button type="button" className="dc-btn" onClick={nextStep}>
                    {t("save")} 
                  </button>
                </div>
              ) : (
                <button
                  type="submit" className="dc-btn"
                  onClick={submitForm}
                >
                  {t("confirmRegistration")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <SuccessMessage resetForm={resetForm} />
        )}
      </div>
     
      {/* Validation Popup */}
      {showPopup && (
        <PopupMessage
          type="warning"
          title={t("validationError")}
          message={popupErrors}
          buttons={[
            ...(btnOk
              ? [{
                  text: "ok",
                  variant: "primary",
                  onClick: () => {
                    setCurrentStep(7);
                    setShowPopup(false);
                    setBtnOk(false);
                  }
                }]
              : []),
            {
              text: "Cancel",
              variant: "secondary",
              onClick: () => setShowPopup(false),
            },
          ]}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}