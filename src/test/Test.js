import React from "react";
import {
  Check,
  Lock,
  Calendar,
  MessageSquare,
  Users,
  DollarSign,
  Star,
  Bell,
  ArrowRight,
  User,
  GraduationCap,
  Stethoscope,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { id: 1, title: "Personal Information", icon: User, status: "completed" },
  { id: 2, title: "Education", icon: GraduationCap, status: "incomplete" },
  { id: 3, title: "Profile & Specialty", icon: Stethoscope, status: "incomplete" },
  { id: 4, title: "Location", icon: MapPin, status: "incomplete" },
  { id: 5, title: "Shift", icon: Clock, status: "incomplete" },
  { id: 6, title: "Experience", icon: Briefcase, status: "completed" },
];

const features = [
  { id: "appointments", title: "Appointments", description: "Manage your schedule", icon: Calendar, locked: false,link:"/appointments" },
  { id: "messages", title: "Messages", description: "Chat with patients", icon: MessageSquare, locked: true ,link:"/messages" },
  { id: "patients", title: "Patients", description: "View patient records", icon: Users, locked: false ,link:"/patients" },
  { id: "financial", title: "Financial", description: "Track your earnings", icon: DollarSign, locked: true },
  { id: "reviews", title: "Reviews", description: "See patient feedback", icon: Star, locked: true,link:"/reviews" },
  { id: "notifications", title: "Notifications", description: "Stay up to date", icon: Bell, locked: false,link:"/notifications" },
];

const colors = {
  primary: "#3fabf3",
  primaryLight: "rgba(63,171,243,0.08)",
  primaryBorder: "rgba(63,171,243,0.25)",
  bg: "#f5f6fa",
  card: "#ffffff",
  border: "#eee",
  text: "#1a2332",
  muted: "#7b8794",
  track: "#eef0f4",
  accent: "#247CFF",
};

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
    color: colors.text,
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  card: {
    background: "var(--cardcolor)",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
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
    color: colors.text,
  },
  progressPct: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.primary,
  },
  trackOuter: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    marginBottom: 24,
  },
  trackInner: (pct) => ({
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.primary,
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
    border: `1px solid ${done ? colors.primaryBorder : colors.border}`,
    backgroundColor: done ? colors.primaryLight : '',
    transition: "all 0.2s",
  }),
  stepCircle: (done) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: done ? colors.primary : colors.track,
    color: done ? "#fff" : colors.muted,
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
    color: colors.text,
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
    border: `1px solid ${colors.border}`,
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
    backgroundColor: locked ? colors.track : colors.primaryLight,
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
export const Progress = ({setOpenStepRegister}) => {
    const completed = steps.filter((st) => st.status === "completed").length;
  const percentage = Math.round((completed / steps.length) * 100);
  return (
        <div  className=" p-2 progress-card-container">

          <div style={s.progressRow}>
            <span style={s.progressLabel} className="text-suptext">
              {completed} of {steps.length} steps completed
            </span>
            <span style={s.progressPct}>{percentage}%</span>
          </div>
          <div style={s.trackOuter} className="mb-1">
            <div style={s.trackInner(percentage)} />
          </div>
          <span className="text-center-small-bold" >complete your profile to unlock all features</span>

          <button className="add-btn" onClick={() => setOpenStepRegister(true)}>
                   Complete
                 </button>
        </div>
  )
};

export default function DoctorDashboard({setOpenStepRegister}) {
  const completed = steps.filter((st) => st.status === "completed").length;
  const percentage = Math.round((completed / steps.length) * 100);

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={s.h1}>Welcome back, dr. John </h1>
          <p style={s.subtitle}>Complete your profile to unlock all features</p>
        </div>
        {/* Progress */}
        <div style={s.card}>
          <div style={s.progressRow}>
            <span style={s.progressLabel}>
              {completed} of {steps.length} steps completed
            </span>
            <span style={s.progressPct}>{percentage}%</span>
          </div>
          <div style={s.trackOuter}>
            <div style={s.trackInner(percentage)} />
          </div>
          <div style={s.stepsGrid}>
            {steps.map((step) => {
              const Icon = step.icon;
              const done = step.status === "completed";
              return (
                <div key={step.id} style={s.stepCard(done)}>
                  <div style={s.stepCircle(done)}>
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span style={s.stepTitle}>{step.title}</span>
                  <span className={done?"completed":"text-suptext completed" } >{done ? "Completed" : "un Completed"}</span>
                  {/* <button
                    style={s.stepBtn(done)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = done
                        ? "rgba(63,171,243,0.1)"
                        : "rgba(36,124,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => setOpenStepRegister(step.id)}
                  >
                    {done ? "Edit" : "Continue"}
                  </button> */}
                </div>
              );
            })}
          </div>
        {/* CTA */}
        <button
          className="dc-btn mt-4"
          onClick={() => setOpenStepRegister(true)}
        >
          Continue Registration
          <ArrowRight size={16} />
        </button>
        </div>


        {/* Features */}
        <h2 style={s.sectionTitle}>Features</h2>
        <div style={s.featuresGrid}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.id} style={s.featureCard(f.locked)}>
                {f.locked ? (
                  <div style={s.featureLock}>
                    <Lock size={14} color={colors.muted} />
                  </div>
                ):(
                  <Link to={f.link} >
                <button
                  style={s.featureLock}>
                     
                      <span style={{color:"#3c83f6"}}>View</span></button>
                     </Link>
                  )}
                <div style={s.featureIcon(f.locked)}>
                  <Icon size={20} color={f.locked ? colors.muted : colors.primary} />
                </div>
                <div style={s.featureTitle}>{f.title}</div>
                <div style={s.featureDesc}>
                  {f.locked ? "Complete profile to unlock" : f.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
