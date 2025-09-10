import i18n from "i18next";

export const validateEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const re = /^0[1-9]\d{8}$/;
  return re.test(phone);
};

export const validateNationalId = (id) => {
  return id && id.length >= 10 && /^\d+$/.test(id);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateStep = (step, formData) => {
  const errors = {};
  const thisYear = new Date().getFullYear();

if (step === 1) {
    if (!formData.fullName?.trim())
      errors.fullName = i18n.t("validation.step1.fullName");

    if (!validateEmail(formData.email))
      errors.email = i18n.t("validation.step1.email");

    if (!validatePhone(formData.phone))
      errors.phone = i18n.t("validation.step1.phone");

    if (!validateNationalId(formData.nationalId))
      errors.nationalId = i18n.t("validation.step1.nationalId");

    if (!validatePassword(formData.password))
      errors.password = i18n.t("validation.step1.password");

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = i18n.t("validation.step1.confirmPassword");
  }

if (step === 2) {
  if (!formData.qualifications || formData.qualifications.length === 0) {
    errors.qualifications = i18n.t("validation.step2.atLeastOne");
  } else {
    formData.qualifications.forEach((q, index) => {
      if (!q.qualification) {
        errors[`qualification_${index}`] = i18n.t("validation.step2.qualification");
      }
      if (!q.university?.trim()) {
        errors[`university_${index}`] = i18n.t("validation.step2.university");
      }
      
      const year = Number(q.graduationYear || 0);
      const thisYear = new Date().getFullYear();
      
      if (!q.graduationYear) {
        errors[`graduationYear_${index}`] = i18n.t("validation.step2.graduationYearRequired");
      } else if (!(year >= 1950 && year <= thisYear)) {
        errors[`graduationYear_${index}`] = i18n.t("validation.step2.graduationYear", {
          year: thisYear,
        });
      }
    });
  }
}

if (step === 3) {
  if (!formData.specialty) {
    errors.specialty = i18n.t("validation.step3.specialty");
  }
  if (!formData.licenseNumber?.trim()) {
    errors.licenseNumber = i18n.t("validation.step3.licenseNumber");
  }
  // if (!formData.bio?.trim()) {
  //   errors.bio = i18n.t("validation.step3.Bio");
  // }
  if (!formData.licenseFile) {
    errors.licenseFile = i18n.t("validation.step3.licenseFile");
  }
  if (!formData.yearsOfExperience) {
    errors.yearsOfExperience = i18n.t("validation.step3.yearsOfExperience");
  } else if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
    errors.yearsOfExperience = i18n.t("validation.step3.invalidYearsOfExperience");
  }

  // if (!formData.languages || formData.languages.length === 0) {
  //   errors.languages = i18n.t("validation.step3.languages");
  // }
}

  if (step === 4) { 
    // Validate if locations exist
    if (!formData.locations || formData.locations.length === 0) {
      errors.locations = i18n.t("validation.step4.locationsRequired");
    } else {
      // Validate each location
      formData.locations.forEach((location, index) => {
        if (!location.displayName?.trim()) {
          errors[`location_${index}_displayName`] = i18n.t("validation.step4.locationNameRequired");
        }
        if (!location.officialName?.trim()) {
          errors[`location_${index}_officialName`] = i18n.t("validation.step4.officialAddressRequired");
        }
        // Validate coordinates
        if (!location.lat || !location.lng || 
            isNaN(location.lat) || isNaN(location.lng) ||
            location.lat < -90 || location.lat > 90 ||
            location.lng < -180 || location.lng > 180) {
          errors[`location_${index}_coordinates`] = i18n.t("validation.step4.invalidCoordinates");
        }
      });
    }
  }

if (step === 5) {
  // Validate if shifts exist
  if (!formData.shifts || formData.shifts.length === 0) {
    errors.shifts = i18n.t("validation.step5.shiftsRequired");
  } else {
    // Validate each shift
    formData.shifts.forEach((shift, index) => {
      if (!shift.clinic?.trim()) {
        errors[`shift_${index}_clinic`] = i18n.t("validation.step5.clinicRequired");
      }
      if (!shift.day?.trim()) {
        errors[`shift_${index}_day`] = i18n.t("validation.step5.dayRequired");
      }
      if (!shift.shiftType?.trim()) {
        errors[`shift_${index}_shiftType`] = i18n.t("validation.step5.shiftTypeRequired");
      }

      // If shift type is "custom", validate times
      if ((shift.shiftType || "").toLowerCase() === "custom") {
        const from = shift.customFrom?.trim() || "";
        const to = shift.customTo?.trim() || "";

        if (!from) {
          errors[`shift_${index}_customFrom`] = i18n.t("validation.step5.customFromRequired");
        }
        if (!to) {
          errors[`shift_${index}_customTo`] = i18n.t("validation.step5.customToRequired");
        }

        if (from && to) {
          const fromTime = new Date(`2000-01-01T${from}`);
          const toTime = new Date(`2000-01-01T${to}`);
          if (fromTime >= toTime) {
            errors[`shift_${index}_timeRange`] = i18n.t("validation.step5.invalidTimeRange");
          }
        }
      }

      // Validate breaks if they exist
      if (shift.breaks && shift.breaks.length > 0) {
        shift.breaks.forEach((breakItem, breakIndex) => {
          if (!breakItem.from?.trim()) {
            errors[`shift_${index}_break_${breakIndex}_from`] = i18n.t("validation.step5.breakFromRequired");
          }
          if (!breakItem.to?.trim()) {
            errors[`shift_${index}_break_${breakIndex}_to`] = i18n.t("validation.step5.breakToRequired");
          }

          // Validate that break end time is after start time
          if (breakItem.from && breakItem.to) {
            const breakFrom = new Date(`2000-01-01T${breakItem.from}`);
            const breakTo = new Date(`2000-01-01T${breakItem.to}`);
            if (breakFrom >= breakTo) {
              errors[`shift_${index}_break_${breakIndex}_timeRange`] = i18n.t("validation.step5.invalidBreakTimeRange");
            }
          }
        });
      }
    });
  }
}

if (step === 6) {
  // Validate that slots exist (at least one Slot is required)
  if (
    !formData.slots || 
    Object.keys(formData.slots).every(day => formData.slots[day].length === 0)
  ) {
    errors.slots = i18n.t("validation.step6.slotsRequired");
  } else {
    // Validate each day
    Object.keys(formData.slots).forEach(day => {
      // Validate each slot in the day
      formData.slots[day].forEach((slot, slotIndex) => {
        if (!slot.clinic) {
          errors[`slot_${day}_${slotIndex}_clinic`] = i18n.t("validation.step6.clinicRequired");
        }

        if (!slot.startTime) {
          errors[`slot_${day}_${slotIndex}_startTime`] = i18n.t("validation.step6.startTimeRequired");
        }

        if (!slot.endTime) {
          errors[`slot_${day}_${slotIndex}_endTime`] = i18n.t("validation.step6.endTimeRequired");
        }

       const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

if (slot.startTime && slot.endTime) {
  const start = toMinutes(slot.startTime);
  const end = toMinutes(slot.endTime);

  if (start >= end) {
    errors[`slot_${day}_${slotIndex}_timeRange`] = i18n.t("validation.step6.invalidTimeRange");
  }
}

        if (!slot.SlotDurationInMinutes || slot.SlotDurationInMinutes < 15 || slot.SlotDurationInMinutes > 120) {
          errors[`slot_${day}_${slotIndex}_duration`] = i18n.t("validation.step6.invalidDuration");
        }

        if (!slot.DaysInAdvance || slot.DaysInAdvance < 1 || slot.DaysInAdvance > 365) {
          errors[`slot_${day}_${slotIndex}_daysInAdvance`] = i18n.t("validation.step6.invalidDaysInAdvance");
        }

        if (!slot.Price || slot.Price < 0) {
          errors[`slot_${day}_${slotIndex}_price`] = i18n.t("validation.step6.invalidPrice");
        }

        if (!slot.Currency) {
          errors[`slot_${day}_${slotIndex}_currency`] = i18n.t("validation.step6.currencyRequired");
        }

        if (!slot.AllowedAppointmentTypes || slot.AllowedAppointmentTypes.length === 0) {
          errors[`slot_${day}_${slotIndex}_appointmentTypes`] = i18n.t("validation.step6.appointmentTypesRequired");
        }
      });
    });
  }
}
add
  if (step === 7) {
    if (!formData.experiences || formData.experiences.length === 0) {
      errors.experiences = i18n.t("validation.step7.experiences");
    } else {
      formData.experiences.forEach((exp, index) => {
        if (!exp.companyTitle) {
          errors[`experience_${index}_companyTitle`] =
            i18n.t("validation.step7.companyTitle");
        }
        if (!exp.startingDate) {
          errors[`experience_${index}_startDate`] =
            i18n.t("validation.step7.startingDate");
        } else if (
          parseInt(exp.startingDate, 10) > thisYear ||
          parseInt(exp.startingDate, 10) < 1900
        ) {
          errors[`experience_${index}_startDate`] =
            i18n.t("validation.step7.invalidDate");
        }
        if (exp.endingDate && exp.endingDate < exp.startingDate) {
          errors[`experience_${index}_endDate`] =
            i18n.t("validation.step7.invalidEndDate");
        }
        if (!exp.jobTitle) {
          errors[`experience_${index}_jobTitle`] =
            i18n.t("validation.step7.jobTitle");
        }
        if (!exp.description) {
          errors[`experience_${index}_jobDescription`] =
            i18n.t("validation.step7.jobDescription");
        }
     
      });
    }
  }


 if (step === 8) {
    if (!formData.paymentMethods || formData.paymentMethods.length === 0) {
      errors.paymentMethods = i18n.t("validation.step8.paymentMethodsRequired");
    }

    if (formData.paymentMethods?.includes("insurance")) {
      if (!formData.insuranceCompanies || formData.insuranceCompanies.length === 0) {
        errors.insuranceCompanies = i18n.t("validation.step8.insuranceCompaniesRequired");
      }
    }
  }

if (step === 9) {
  if (!formData.terms) {
    errors.terms = i18n.t("validation.step9.terms");
  }
}
  return errors;
};
