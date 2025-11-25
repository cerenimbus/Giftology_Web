/*
 * JA11/11/25
 * src/screens/HelpScreen.jsx (web)
 * Giftology Relationship Radar - Help Screen
 * The layout is simple, with a Giftology logo and sample text paragraphs.
 * Euan Flores
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import giftologyLogo from "./assets/giftology.png";

// Icons for sidebar
// import {
//   DashboardIcon,
//   ReportsIcon,
//   CalendarIcon,
//   ContactsIcon,
//   HelpIcon,
//   FeedbackIcon,
// } from "../components/Icons";

// This is the main function for the Help Screen
export default function HelpScreen() {
  const navigate = useNavigate();

  // Check if the screen is wide enough to show the sidebar
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // This runs when the window size changes
  useEffect(() => {
    function checkWindowSize() {
      if (window.innerWidth >= 1024) {
        setIsDesktop(true);
      } else {
        setIsDesktop(false);
      }
    }

    window.addEventListener("resize", checkWindowSize);
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  return (
    <div style={styles.page}>
      {/* Show sidebar only if screen is big */}
      {isDesktop && <Sidebar navigate={navigate} />}

      {/* Main content on the right side */}
      <main style={{ ...styles.main, marginLeft: isDesktop ? 280 : 0 }}>
        <h1 style={styles.title}>Help Screen</h1>

        {/* Section 1 */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere.
          </p>
        </div>

        {/* Section 2 */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum.
          </p>
        </div>

        {/* Section 3 */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere.
          </p>
        </div>

        {/* Section 4 */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Lorem ipsum dolor</h3>
          <p style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere.
          </p>
        </div>
      </main>
    </div>
  );
}

// Sidebar on the left side
function Sidebar({ navigate }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo at the top */}
      <div style={styles.logoContainer}>
        <img src={giftologyLogo} alt="Giftology Logo" style={styles.logoImage} />
      </div>

      {/* Menu section title */}
      <div style={styles.menuHeader}>Discover</div>

      {/* Menu items list */}
      <MenuItem text="Dashboard" />
      <MenuItem text="Reports" />
      <MenuItem text="Dates & DOV" />
      <MenuItem text="Contacts" />
      <MenuItem text="Help" active={true} />
      <MenuItem
        
        text="Feedback"
        onClick={() => navigate("/feedback")}
      />
    </aside>
  );
}

// Each menu button in the sidebar
function MenuItem({ icon, text, onClick, active }) {
  let itemStyle = { ...styles.menuItem };

  // If the item is active (selected), change the style color
  if (active === true) {
    itemStyle.backgroundColor = "#fdf2f2";
    itemStyle.borderLeft = "4px solid #e84b4b";
    itemStyle.color = "#e84b4b";
  }

  return (
    <div onClick={onClick} style={itemStyle}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

// Page styles (like CSS but inside JavaScript)
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },

  sidebar: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRight: "1px solid #eeeeee",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    borderBottom: "1px solid #f0f0f0",
  },

  logoImage: {
    width: 160,
    height: "auto",
  },

  menuHeader: {
    color: "#999999",
    paddingTop: 12,
    paddingLeft: 20,
    paddingBottom: 8,
    fontSize: 13,
    textTransform: "uppercase",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    fontSize: 14,
    cursor: "pointer",
    color: "#333333",
  },

  main: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 60,
    paddingRight: 60,
    overflowY: "auto",
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
    color: "#333333",
    lineHeight: 1.6,
  },

  section: {
    marginBottom: 32,
  },
};
