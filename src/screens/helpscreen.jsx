/*
 * 
 * src/screens/HelpScreen.jsx (web)
 * Giftology Relationship Radar - Help Screen
 * The layout is simple, with a Giftology logo and sample text paragraphs.
 * EF 11/12/25
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
      <main style={styles.main}>
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
    itemStyle.borderLeft = "0.25rem solid #e84b4b";
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
    width: "17.5rem",
    backgroundColor: "#ffffff",
    borderRight: "0.0625rem solid #eeeeee",
    minHeight: "100vh",
    position: "relative",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
    borderBottom: "0.0625rem solid #f0f0f0",
  },

  logoImage: {
    width: "10rem",
    height: "auto",
  },

  menuHeader: {
    color: "#999999",
    paddingTop: "0.75rem",
    paddingLeft: "1.25rem",
    paddingBottom: "0.5rem",
    fontSize: "0.8125rem",
    textTransform: "uppercase",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    paddingLeft: "1.25rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    color: "#333333",
  },

  main: {
    flex: 1,
    paddingTop: "2.5rem",
    paddingLeft: "3.75rem",
    paddingRight: "3.75rem",
    overflowY: "auto",
  },

  title: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#e84b4b",
    marginBottom: "1.5rem",
  },

  subTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },

  text: {
    fontSize: "0.9375rem",
    color: "#333333",
    lineHeight: 1.6,
  },

  section: {
    marginBottom: "2rem",
  },
};
