import { useCallback } from "react";
import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { initialForm } from "../constants/initialForm";

// custom hook to manage form state and persistence using local storage
export const useForm = () => {
  const [formData, setFormData] = useLocalStorage("dr.form", initialForm);
  const [currentStep, setCurrentStep] = useLocalStorage("dr.step", 1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
  if (type === 'checkbox') {
    setFormData(prev => {
      const currentArray = prev[name] || [];
      
      if (checked) {      
        return {
          ...prev,
          [name]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [name]: currentArray.filter(item => item !== value)
        };
      }
    });
  }


    
    if (type === "file") {
      if (name === "licenseFile") {
        setFormData(prev => ({ ...prev, licenseFile: files[0] ?? null }));
      } else if (name === "certFiles") {
        setFormData(prev => ({ ...prev, certFiles: Array.from(files || []) }));
      }
      return;
    }
  setFormData(prev => {
    
    if (JSON.stringify(prev[name]) === JSON.stringify(value)) {
      return prev; 
    }
    return {
      ...prev,
      [name]: value,
    };
  });
}, [setFormData]);

  const updateExperiences = useCallback((index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.experiences];
      updated[index][field] = value;
      return { ...prev, experiences: updated };
    });
  }, [setFormData]);

  const addExperience = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { companyName: "", startDate: "", endDate: "", stillWorking: false },
      ],
    }));
  }, [setFormData]);

  const removeExperience = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialForm);
    setCurrentStep(1);
    setShowSuccess(false);
    localStorage.removeItem("dr.form");
    localStorage.removeItem("dr.step");
  }, [setFormData, setCurrentStep]);

  return {
    formData,
    currentStep,
    showSuccess,
    setCurrentStep,
    setShowSuccess,
    handleInputChange,
    updateExperiences,
    addExperience,
    removeExperience,
    resetForm
  };
};