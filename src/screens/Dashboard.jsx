/*
 * JA10/31/25
 * src/screens/Dashboard.jsx (web)
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  ReportsIcon,
  CalendarIcon,
  ContactsIcon,
  HelpIcon,
  FeedbackIcon,
} from "../components/Icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // mock data (same as design)
  const d = {
    bestReferralPartners: [
      { name: "Jack Miller", amount: "$36,000" },
      { name: "Jhon de rosa", amount: "$22,425" },
      { name: "Martin Mayers", amount: "$17,089" },
      { name: "Kent Mayers", amount: "$11,298" },
    ],
    currentRunawayRelationships: [
      { name: "Lucas Mendoza", phone: "(225) 555-0118" },
      { name: "Ava Torres", phone: "(225) 555-0118" },
      { name: "Ethan Brooks", phone: "(225) 555-0118" },
      { name: "Sophia Ramirez", phone: "(225) 555-0118" },
    ],
    tasks: [
      { name: "James", type: "Introduction", date: "Sep 9" },
      { name: "kharl", type: "Clarity Conversation", date: "Sep 14" },
      { name: "Jimmy", type: "Gift", date: "Sep 24" },
      { name: "Loren", type: "DOV", date: "Sep 26" },
      { name: "Kent", type: "Activity", date: "Sep 26" },
    ],
    datesDov: {
      harmlessStarters: 2001,
      greenlightQuestions: 1873,
      clarityConvos: 1212,
      handwrittenNotes: 1847,
      gifting: 2873,
      videos: 847,
      other: 900,
      totalDov: 89087,
    },
    recentlyIdentifiedPartners: [
      { name: "Charly Oman", phone: "(225) 555-0118" },
      { name: "Jhon de rosa", phone: "(225) 555-0118" },
      { name: "Martin Mayers", phone: "(225) 555-0118" },
      { name: "Kent Mayers", phone: "(225) 555-0118" },
    ],
    outcomes: {
      introductions: 3671,
      referrals: 4471,
      referralPartners: 1011,
    },
    referralRevenue: 105000,
  };

  const safe = (v) => (v !== undefined && v !== null ? v : 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Sidebar */}
      {isDesktop && (
        <aside
          style={{
            width: 280,
            backgroundColor: "#fff",
            borderRight: "1px solid #eee",
            height: "100vh",
            position: "fixed",
          }}
        >
          <div
            style={{
              backgroundColor: "#e84b4b",
              padding: 8,
              margin: 16,
              borderRadius: 3,
            }}
          >
            <div
              style={{
                border: "1.6px solid #fff",
                borderRadius: 2,
                padding: 12,
                textAlign: "center",
                fontWeight: 700,
                color: "#fff",
                fontSize: 22,
              }}
            >
              GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub>
            </div>
          </div>

          <div style={{ color: "#999", padding: "0 16px 8px", fontSize: 13 }}>Discover</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "#fdf2f2",
              borderLeft: "4px solid #e84b4b",
              fontWeight: 600,
              color: "#e84b4b",
              gap: 8,
            }}
          >
            <DashboardIcon size={16} color="#e84b4b" />
            <span style={{ fontSize: 14 }}>Dashboard</span>
          </div>
          <div style={sideItem}>
            <ReportsIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Reports</span>
          </div>
          <div style={sideItem}>
            <CalendarIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Dates & DOV</span>
          </div>
          <div style={sideItem}>
            <ContactsIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Contacts</span>
          </div>
          <div style={sideItem}>
            <HelpIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Help</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/feedback')}>
            <FeedbackIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Feedback</span>
          </div>
        </aside>
      )}

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: 40,
          marginLeft: isDesktop ? 280 : 0,
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: 36, color: "#e84b4b", fontWeight: 700 }}>Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {/* Cards */}
          <Card title="Best Referral Partners">
            {d.bestReferralPartners.map((x, i) => (
              <Row key={i} left={x.name} right={x.amount} />
            ))}
          </Card>

          <Card title="Current Runaway Relationships">
            {d.currentRunawayRelationships.map((x, i) => (
              <Row key={i} left={x.name} right={x.phone} rightColor="#999" />
            ))}
          </Card>

          <Card title="Task">
            {d.tasks.map((t, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "center" }}
              >
                <input type="checkbox" />
                <span>
                  {t.name} {t.type}
                </span>
                <span style={{ marginLeft: "auto", color: "#999" }}>{t.date}</span>
              </div>
            ))}
          </Card>

          {/* Dates & DOV */}
          <Card title="Dates & DOV" span={2}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div />
              <select
                style={{
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                  padding: "8px 32px 8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#333",
                  fontSize: 14,
                  fontFamily: "inherit",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  outline: "none",
                }}
              >
                <option>Months</option>
                <option>Weeks</option>
                <option>Days</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20, marginTop: 12 }}>
              <Pill label="Harmless Starters" value={d.datesDov.harmlessStarters} />
              <Pill label="Greenlight Questions" value={d.datesDov.greenlightQuestions} />
              <Pill label="Clarity Convos" value={d.datesDov.clarityConvos} />
            </div>

            <Row left="Handwritten Notes" right={safe(d.datesDov.handwrittenNotes).toLocaleString()} />
            <Row left="Gifting" right={safe(d.datesDov.gifting).toLocaleString()} />
            <Row left="Videos" right={safe(d.datesDov.videos).toLocaleString()} />
            <Row left="Other" right={safe(d.datesDov.other).toLocaleString()} />

            <div
              style={{
                backgroundColor: "#fafafa",
                marginTop: 10,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Total DOV Activities</div>
                  <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ display: "block", minHeight: "120px" }}>
                    {/* Simple red line - exact up/down pattern */}
                    <path
                      d="M 0 105 C 8 102, 15 98, 22 100 C 29 102, 35 99, 42 101 C 55 105, 68 90, 85 70 C 95 55, 105 45, 115 50 C 125 55, 135 65, 145 70 C 155 75, 165 80, 175 88 C 185 96, 192 105, 200 110 C 208 115, 215 112, 225 105 C 235 98, 242 85, 250 70 C 258 55, 262 45, 265 35 C 268 25, 270 20, 275 25 C 280 30, 285 40, 290 50 C 293 56, 296 60, 298 55 C 300 50, 303 40, 308 30 C 313 23, 318 20, 325 22 C 332 24, 340 25, 350 25 C 360 25, 370 25, 380 25 C 390 25, 400 25, 400 25"
                      fill="none"
                      stroke="#e84b4b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div style={{ fontSize: 36, color: "#999", fontWeight: 700, whiteSpace: "nowrap", marginTop: 16 }}>
                  {safe(d.datesDov.totalDov).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Recently Identified Potential Partners">
            {d.recentlyIdentifiedPartners.map((x, i) => (
              <Row key={i} left={x.name} right={x.phone} rightColor="#999" />
            ))}
          </Card>

          <Card title="Outcomes" span={3}>
            <div style={{ display: "flex", gap: 12 }}>
              <Mini title="Introductions" value={d.outcomes.introductions} />
              <Mini title="Referrals" value={d.outcomes.referrals} />
              <Mini title="Referral Partners" value={d.outcomes.referralPartners} />
            </div>
            <h3 style={{ marginTop: 30, marginBottom: 16 }}>Referral Revenue Generated</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ display: "block", minHeight: "120px" }}>
                  {/* Simple red line - exact up/down pattern */}
                  <path
                    d="M 0 105 C 8 102, 15 98, 22 100 C 29 102, 35 99, 42 101 C 55 105, 68 90, 85 70 C 95 55, 105 45, 115 50 C 125 55, 135 65, 145 70 C 155 75, 165 80, 175 88 C 185 96, 192 105, 200 110 C 208 115, 215 112, 225 105 C 235 98, 242 85, 250 70 C 258 55, 262 45, 265 35 C 268 25, 270 20, 275 25 C 280 30, 285 40, 290 50 C 293 56, 296 60, 298 55 C 300 50, 303 40, 308 30 C 313 23, 318 20, 325 22 C 332 24, 340 25, 350 25 C 360 25, 370 25, 380 25 C 390 25, 400 25, 400 25"
                    fill="none"
                    stroke="#e84b4b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ fontSize: 36, color: "#999", fontWeight: 700, whiteSpace: "nowrap", marginTop: 16 }}>
                ${safe(d.referralRevenue).toLocaleString()}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

/* ---------- Reusable helpers ---------- */
function Card({ title, children, span = 1 }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        gridColumn: `span ${span}`,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ left, right, rightColor = "#333" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <span>{left}</span>
      <span style={{ color: rightColor, fontWeight: 600 }}>{right}</span>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#fdeaea",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: "#333" }}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function Mini({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#fafafa",
        borderRadius: 10,
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span>{title}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: "#333" }}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}

const sideItem = {
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};
