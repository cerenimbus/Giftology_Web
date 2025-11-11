/*
 * Simple Help Screen
 * Uses the same sidebar design from Dashboard
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import giftologyLogo from "./assets/giftology.png";

// 🔹 Icon imports
import {
  DashboardIcon,
  ReportsIcon,
  CalendarIcon,
  ContactsIcon,
  HelpIcon,
  FeedbackIcon,
} from "../components/Icons";

export default function HelpScreen() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.page}>
      {/* Sidebar (same as Dashboard) */}
      {isDesktop && <Sidebar navigate={navigate} />}

      {/* Main content */}
      <main style={{ ...styles.main, marginLeft: isDesktop ? 280 : 0 }}>
        <h1 style={styles.title}>Help Screen</h1>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>
      </main>
    </div>
  );
}

/* 🧭 Sidebar Component (same as Dashboard) */
function Sidebar({ navigate }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <img src={giftologyLogo} alt="Giftology" style={styles.logoImage} />
      </div>

      <div style={styles.menuHeader}>Discover</div>

      {/* Menu Items */}
      <MenuItem icon={<DashboardIcon size={16} />} text="Dashboard" />
      <MenuItem icon={<ReportsIcon size={16} />} text="Reports" />
      <MenuItem icon={<CalendarIcon size={16} />} text="Dates & DOV" />
      <MenuItem icon={<ContactsIcon size={16} />} text="Contacts" />
      <MenuItem icon={<HelpIcon size={16} color="#e84b4b" />} text="Help" active />
      <MenuItem
        icon={<FeedbackIcon size={16} />}
        text="Feedback"
        onClick={() => navigate("/feedback")}
      />
    </aside>
  );
}

/* 📦 Sidebar item */
function MenuItem({ icon, text, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.menuItem,
        ...(active
          ? { backgroundColor: "#fdf2f2", borderLeft: "4px solid #e84b4b", color: "#e84b4b" }
          : {}),
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#fff",
  },

  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    borderRight: "1px solid #eee",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #f0f0f0",
  },

  logoImage: {
    width: 160,
    height: "auto",
  },

  menuHeader: {
    color: "#999",
    padding: "12px 20px 8px",
    fontSize: 13,
    textTransform: "uppercase",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    fontSize: 14,
    cursor: "pointer",
    color: "#333",
  },

  main: {
    flex: 1,
    padding: "40px 60px",
  },

  title: {
    fontSize: 32,
    fontWeight: 600,
    color: "#e84b4b",
    marginBottom: 24,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    color: "#333",
    lineHeight: 1.6,
  },

  section: {
    marginBottom: 32,
  },
};
