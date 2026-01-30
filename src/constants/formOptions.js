// constants/formOptions.js
import React from "react";
import { FaCheckCircle} from "react-icons/fa";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { LuUserCog } from "react-icons/lu";
import { PiCalendarCheckLight } from "react-icons/pi";
import { CiClock1 } from "react-icons/ci";
import { PiMoneyWavyLight } from "react-icons/pi";
import { MdCastForEducation } from "react-icons/md";
import { PiCertificateThin } from "react-icons/pi";
import { FaUserMd } from "react-icons/fa";


export const TOTAL_STEPS = 8;


const specialtyKeys = [
  { value: "", key: "specialty.select" },
  { value: "cardiology", key: "specialty.cardiology" },
  { value: "neurology", key: "specialty.neurology" },
  { value: "pediatrics", key: "specialty.pediatrics" },
  { value: "surgery", key: "specialty.surgery" },
  { value: "internal", key: "specialty.internal" },
  { value: "orthopedics", key: "specialty.orthopedics" },
  { value: "ophthalmology", key: "specialty.ophthalmology" },
  { value: "dermatology", key: "specialty.dermatology" },
];

const qualificationKeys = [
  { value: "", key: "qualification.select" },
  { value: "mbbs", key: "qualification.mbbs" },
  { value: "master", key: "qualification.master" },
  { value: "phd", key: "qualification.phd" },
  { value: "board", key: "qualification.board" },
  { value: "other", key: "qualification.other" },
];

const stepsKeys = [
  { key: "steps.personalInfo", icon: <PiUserCircle /> },
  { key: "steps.education", icon: <PiCertificateThin /> },
  { key: "steps.profileAndSpecialty", icon: <MdOutlineFolderSpecial /> },
  { key: "steps.location", icon: <CiLocationOn /> },
  { key: "steps.shift", icon: <PiCalendarCheckLight /> },
  // { key: "steps.makeSlots", icon: <CiClock1 /> },
  { key: "steps.experience", icon: <LuUserCog /> },
  // { key: "steps.PaymentInsurance", icon: <PiMoneyWavyLight /> }, 
];

// this function returns the specialty options for the select input
export const getSpecialtyOptions = (t) =>
  specialtyKeys.map((o) => ({ value: o.value, label: t(o.key) }));

export const getQualificationOptions = (t) =>
  qualificationKeys.map((o) => ({ value: o.value, label: t(o.key) }));

export const getStepsMeta = (t) =>
  stepsKeys.map((s) => ({ label: t(s.key), icon: s.icon }));
