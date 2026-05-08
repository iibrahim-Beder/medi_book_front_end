
import { useState } from 'react';
import React from "react";
import "./dashboard.css";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  ShieldCheck,
  ChevronRight,
  Check,
  FileText,
  CalendarClock,
  User,
  Stethoscope,
  Calendar,
  MessageSquare,
  Video,
  BarChart3,
  FileSearch,
  CreditCard,
  Lock,
} from "lucide-react";
import { useStep1PersonalInfo } from '../doctor-registration/hooks/useStep1BasicInfo';
import { useSelector } from 'react-redux';

const links2 = [
  {
    icon: BookOpen,
    title: "Verification guide",
    description: "Accepted documents and requirements.",
    content: "You can upload your documents here and our team will verify them.",
  },
  {
    icon: LifeBuoy,
    title: "Contact support",
    description: "Our team replies within one hour.",
    content: "Reach us via live chat or email support@company.com. Available 24/7.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & compliance",
    description: "How we protect your patient data.",
    content: "We follow HIPAA and GDPR standards to ensure your data is encrypted and secure.",
  },
];

export function SupportStrip2() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <aside className="dc-card dc-aside">
      <div className="dc-card__header dc-card__header--simple">
        <h3 className="dc-card__title">Resources</h3>
        
        <p className="dc-card__sub">Help and documentation for new practitioners.</p>
      </div>

      <ul className="dc-links">
        {links2.map((item, index) => {
          const Icon = item.icon;
          const isOpen = activeIndex === index;

          return (
            <li key={item.title}>
              <button className="dc-link" onClick={() => toggle(index)}>
                <span className="dc-link__icon">
                  <Icon size={16} />
                </span>

                <span className="dc-link__body">
                  <span className="dc-link__title">{item.title}</span>
                  <span className="dc-link__desc">{item.description}</span>
                </span>

                <ChevronRight
                  size={16}
                  className={`dc-link__chev ${isOpen ? "open" : ""}`}
                />
              </button>

              <div className={`dc-link__expand ${isOpen ? "open" : ""}`}>
                <p>{item.content}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}













/* ---------- Verification Alert ---------- */
const VerificationAlert = ({setOpenStepRegister}) => (
  <div className="dc-alert">
    <div className="dc-alert__left">
      <div className="dc-alert__icon">
        <AlertCircle size={20} strokeWidth={2.25} />
      </div>
      <div>
        <div className="dc-alert__titlewrap">
          <h2 className="dc-alert__title">Account verification required</h2>
          <span className="dc-badge dc-badge--accent">Pending</span>
        </div>
        <p className="dc-alert__desc">
          Your profile is not yet visible to patients. Please complete the
          remaining steps below to finalize verification.
        </p>
      </div>
    </div>
    <button onClick={() => setOpenStepRegister(true)} type="button" className="dc-btn dc-btn-bg">
      Complete registration
      <ArrowRight size={16} style={{ marginLeft: 6 }} />
    </button>
  </div>
);

/* ---------- Setup Progress ---------- */
const steps = [
  { icon: User, label: "Basic Information", meta: "Personal details and contact", done: true },
  { icon: Stethoscope, label: "Medical Specialty", meta: "Primary field and sub-specialties", done: true },
  { icon: FileText, label: "Upload Documents", meta: "Medical license, ID, insurance certificate", done: false, current: true },
  { icon: CalendarClock, label: "Set Availability", meta: "Weekly schedule and consultation types", done: false },
];

export const SetupProgress = ({setOpenStepRegister}) => {
  const {completedStepsPercent,doctorCurrentStepNumber } = useStep1PersonalInfo();

  return (
    <section className="dc-card">
      <div className="dc-card__header">
        <div>
          <h3 className="dc-card__title">Profile completion</h3>
          <p className="dc-card__sub">
            {doctorCurrentStepNumber} of {6} steps completed
          </p>
        </div>
        <div className="dc-percent">
          {completedStepsPercent}
          <span className="dc-percent__sign">%</span>
        </div>
      </div>

      <div className="dc-progress-wrap">
        <div className="dc-progress">
          <div className="dc-progress__bar" style={{ width: `${completedStepsPercent}%` }} />
        </div>
      </div>

      <ul className="dc-steps">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              className={`dc-step ${step.current ? "dc-step--current" : ""}`}
            >
              <span
                className={`dc-step__icon ${
                  step.done
                    ? "dc-step__icon--done"
                    : step.current
                    ? "dc-step__icon--current"
                    : "dc-step__icon--idle"
                }`}
              >
                {step.done ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </span>

              <div className="dc-step__body">
                <div className="dc-step__titlerow">
                  <span
                    className={`dc-step__label ${
                      step.done ? "dc-step__label--muted" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.current && (
                    <span className="dc-pill dc-pill--primary">In progress</span>
                  )}
                  {step.done && <span className="dc-step__verified">Verified</span>}
                </div>
                <p className="dc-step__meta">{step.meta}</p>
              </div>

              {!step.done && <ChevronRight size={16} className="dc-step__chev" />}
            </li>
          );
        })}
      </ul>

      <div className="dc-card__footer">
        <p className="dc-card__footnote">
          Estimated time to finish: <strong>4 minutes</strong>
        </p>
        <button onClick={() => setOpenStepRegister(true)} type="button" className="dc-btn dc-btn-bg">
          Continue setup
          <ChevronRight size={16} style={{ marginLeft: 4 }} />
        </button>
      </div>
    </section>
  );
};
/* ---------- Feature List ---------- */
const features = [
  { icon: Calendar, title: "Appointment Scheduling", description: "Manage availability, bookings and reminders." },
  { icon: MessageSquare, title: "Secure Messaging", description: "HIPAA-compliant patient communication." },
  { icon: Video, title: "Video Consultations", description: "Conduct remote visits from any device." },
  { icon: FileSearch, title: "Patient Records", description: "Centralized medical history and notes." },
  { icon: CreditCard, title: "Billing & Payments", description: "Integrated invoicing and reimbursements." },
  { icon: BarChart3, title: "Practice Analytics", description: "Performance metrics and patient insights." },
];

const FeatureList = () => (
  <section className="dc-card">
    <div className="dc-card__header">
      <div>
        <h3 className="dc-card__title">Features available after activation</h3>
        <p className="dc-card__sub">
          These tools will unlock once your account is verified.
        </p>
      </div>
      <div className="dc-locked">
        <Lock size={12} />
        Locked
      </div>
    </div>

    <div className="dc-features">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <div key={feature.title} className="dc-feature" data-index={i}>
            <div className="dc-feature__icon">
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <h4 className="dc-feature__title">{feature.title}</h4>
              <p className="dc-feature__desc">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
const s = {
  page: {
    minHeight: "100vh",
    // fontFamily: "'Inter', 'Cairo', sans-serif",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 20px",
  },
  h1: {
    fontSize: 24,
    fontWeight: 600,
    // color: colors.text,
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    // color: colors.muted,
    marginTop: 4,
  },
  card: {
    background: "var(--cardcolor)",
    borderRadius: 12,
    // border: `1px solid ${colors.border}`,
    padding: 24,
    marginBottom: 24,
    textAlign: "right",
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 500,
    // color: colors.text,
  },
  progressPct: {
    fontSize: 14,
    fontWeight: 600,
    // color: colors.primary,
  },
  trackOuter: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    // backgroundColor: colors.track,
    marginBottom: 24,
  },
  trackInner: (pct) => ({
    height: "100%",
    borderRadius: 4,
    // backgroundColor: colors.primary,
    width: `${pct}%`,
    transition: "width 0.5s ease",
  }),
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 12,
  },
  stepCard: (done) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 14,
    textAlign: "center",
    // border: `1px solid ${done ? colors.primaryBorder : colors.border}`,
    // backgroundColor: done ? colors.primaryLight : '',
    transition: "all 0.2s",
  }),
  stepCircle: (done) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: done ? colors.primary : colors.track,
    // color: done ? "#fff" : colors.muted,
  }),
  stepTitle: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  // stepBtn: (done) => ({
  //   fontSize: 12,
  //   fontWeight: 500,
  //   padding: "0px 12px",
  //   borderRadius: 12,
  //   border: "none",
  //   cursor: "pointer",
  //   backgroundColor: "transparent",
  //   color: done ? colors.primary : colors.accent,
  //   transition: "background 0.2s",
  // }),
  // ctaBtn: {
  //   width: "100%",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: 8,
  //   backgroundColor: colors.primary,
  //   color: "#fff",
  //   fontWeight: 500,
  //   fontSize: 14,
  //   padding: "14px 0",
  //   borderRadius: 12,
  //   border: "none",
  //   cursor: "pointer",
  //   marginBottom: 32,
  //   transition: "opacity 0.2s",
  // },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    // color: colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  },
  featureCard: (locked) => ({
    position: "relative",
    borderRadius: 12,
    // border: `1px solid ${colors.border}`,
    padding: 20,
    backgroundColor: "var(--cardcolor)",
    opacity: locked ? 0.5 : 1,
    cursor: locked ? "not-allowed" : "pointer",
    transition: "all 0.2s",
  }),
  featureLock: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  featureIcon: (locked) => ({
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  }),
  featureTitle: {
    fontSize: 14,
    fontWeight: 500,
    // color: colors.text,
  },
  featureDesc: {
    fontSize: 12,
    color: "var(--text-sub)",
    marginTop: 2,
  },
};
export const ProgressSide = ({setOpenStepRegister}) => {
    const {completedStepsPercent,doctorCurrentStepNumber } = useStep1PersonalInfo();

  return (
        <div  className=" p-2 progress-card-container">

          <div  className='progressRow'>
            <span  className="progressLabel text-suptext">
              {doctorCurrentStepNumber} of {6} steps completed
            </span>
            <span className='progressPct'>{completedStepsPercent}%</span>
          </div>
          <div className="trackOuter mb-1">
            <div style={s.trackInner(completedStepsPercent)} />
          </div>
          <span className="text-center-small-bold" >complete your profile to unlock all features</span>

          <button className="add-btn" onClick={() => setOpenStepRegister(true)}>
                   Complete
                 </button>
        </div>
  )
};

/* ---------- Page ---------- */
export default function DashboardUnCompleteRegistration({setOpenStepRegister}) {  
  const doctorId = useSelector((state) => state.auth.doctorId);
      const {
        formData,
        isLoading,
      } = useStep1PersonalInfo(false  , doctorId); 
  return (
    <main className="p-3">
      <div className="dc-heading">
        <p className="dc-eyebrow">Dashboard</p>
        <h1 className="dc-h1">Welcome, Dr. {isLoading ? "Loading..." :( formData.firstName + " " + formData.lastName )|| "doctor"}</h1>
        <p className="dc-lead">
          Complete the remaining verification steps to activate your professional
          account and start receiving patient bookings.
        </p>
      </div>

      <div className="dc-stack">
        <VerificationAlert setOpenStepRegister={setOpenStepRegister} />

        <div className="dc-grid">
          <div className="dc-grid__main">
            <SetupProgress setOpenStepRegister={setOpenStepRegister} />
          </div>
          <div className="dc-grid__side">
            {/* <SupportStrip /> */}
            <SupportStrip2/>
          </div>
        </div>

        <FeatureList />
      </div>
    </main>
  );
};
