/*
 * 
 * src/screens/HelpScreen.jsx (web)
 * Giftology Relationship Radar - Help Screen
 * The layout is simple, with a Giftology logo and sample text paragraphs.
 * EF 11/12/25
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import { getMenuItems } from '../utils/menuConfig.jsx';
import { removeAuthCode } from '../utils/storage';

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
  const location = useLocation();

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

  const handleLogout = async () => {
    await removeAuthCode();
    navigate('/login');
  };

  const handleMenuClick = (item) => {
    if (item.key === 'logout') {
      handleLogout();
    } else {
      navigate(item.path);
    }
  };

  return (
    <div style={styles.page}>
      {/* Mobile/header (fixed) */}
      {!isDesktop && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top, 12px) + 10px) 16px 10px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'fixed', left: 0, right: 0, top: 0, zIndex: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700, color: '#e84b4b' }}>GIFT·OLOGY</div>
            <div style={{ color: '#999' }}>ROR</div>
          </div>
          <div>
            <HamburgerMenu 
              menuItems={getMenuItems()}
              onItemClick={handleMenuClick}
              isDesktop={isDesktop}
              currentPath={location.pathname}
            />
          </div>
        </header>
      )}

      {/* Show sidebar only if screen is big */}
      {isDesktop && (
        <Sidebar 
          onItemClick={handleMenuClick}
          currentPath={location.pathname}
        />
      )}

      {/* Main content on the right side */}
      <main style={{...styles.main, paddingTop: !isDesktop ? 'calc(env(safe-area-inset-top, 12px) + 72px)' : styles.main.paddingTop}}>
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
