/*
 * JA11/10/25
 * src/screens/LoadingScreen.jsx (web)
 * Giftology Relationship Radar - Loading Screen
 * Responsive + Orientation Aware Version
 * Euan Flores 
 * MODIFIED KML 11/25/2025
 */

import React, { useEffect, useState } from "react";
import giftologyLogo from "./assets/giftology.png"; // logo image

export default function LoadingScreen(props) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide loading screen
  useEffect(() => {
    const timeLimit = props.duration || 2500;
    const timer = setTimeout(() => {
      setIsVisible(false);
      props.onFinish && props.onFinish();
    }, timeLimit);

    return () => clearTimeout(timer);
  }, [props.duration, props.onFinish]);

  if (!isVisible) return null;

  return (
    <div style={styles.page}>
      {/* RESPONSIVE STYLES + ORIENTATION SUPPORT */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* ----------- ORIENTATION SUPPORT ----------- */

          /* Portrait Mode (Phone & Tablet) */
          @media (orientation: portrait) {
            .giftology-logo {
              width: 60vw !important;
              max-width: 280px !important;
            }
            .radar-title {
              font-size: 6vw !important;
            }
            .powered-by {
              font-size: 3.5vw !important;
            }
          }

          /* Landscape Mode (Phone & Tablet) */
          @media (orientation: landscape) {
            .giftology-logo {
              width: 35vw !important;
              max-width: 260px !important;
            }
            .radar-title {
              font-size: 4vw !important;
            }
            .powered-by {
              font-size: 2vw !important;
            }
          }

          /* ----------- WIDTH BREAKPOINTS ----------- */

          @media (max-width: 1024px) {
            .giftology-logo { width: 320px !important; }
            .radar-title { font-size: 32px !important; }
            .powered-by { font-size: 16px !important; }
          }

          @media (max-width: 768px) {
            .giftology-logo { width: 250px !important; }
            .radar-title { font-size: 26px !important; }
            .powered-by { font-size: 14px !important; }
          }

          @media (max-width: 480px) {
            .giftology-logo { width: 200px !important; }
            .radar-title { font-size: 22px !important; }
            .powered-by { font-size: 13px !important; }
          }
        `}
      </style>

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        <div style={styles.textArea}>
          <h1 className="radar-title" style={styles.radarTitle}>
            Relationship Radar
          </h1>
          <p className="powered-by" style={styles.poweredBy}>
            Powered by:
          </p>
        </div>

        <img
          src={giftologyLogo}
          alt="Giftology Logo"
          className="giftology-logo"
          style={styles.logo}
        />

        {/* SPINNER */}
        <div className="loading-spinner" style={styles.spinner}></div>
      </div>

      {/* DECORATIVE SHAPES */}
      <div style={{ ...styles.shape, ...styles.shapeOne }}></div>
      <div style={{ ...styles.shape, ...styles.shapeTwo }}></div>
      <div style={{ ...styles.shape, ...styles.shapeThree }}></div>
    </div>
  );
}

// ---------------- STYLES ----------------

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif",
  },

  content: {
    textAlign: "left",
    maxWidth: "650px",
    width: "90vw",
    zIndex: 10,
  },

  textArea: {
    marginBottom: 20,
    marginLeft: 10,
  },

  radarTitle: {
    fontSize: 36,
    fontWeight: 400,
    color: "#000000",
    marginBottom: 5,
    lineHeight: 1.2,
    transition: "0.3s ease",
  },

  poweredBy: {
    fontSize: 18,
    color: "#555555",
    marginBottom: 16,
    transition: "0.3s ease",
  },

  logo: {
    width: 380,
    height: "auto",
    marginLeft: 10,
    marginBottom: 36,
    objectFit: "contain",
    borderRadius: 8,
    boxShadow: "0 5px 15px rgba(0,0,0,0.18)",
    transition: "width 0.3s ease",
  },

  spinner: {
    width: 56,
    height: 56,
    border: "4px solid #f5b7b7",
    borderTopColor: "#e84b4b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },

  shape: {
    position: "absolute",
    border: "1px solid rgba(232, 75, 75, 0.1)",
    borderRadius: "50%",
    pointerEvents: "none",
    transition: "0.3s ease",
  },

  shapeOne: {
    width: "20vw",
    height: "20vw",
    top: "5%",
    right: "10%",
    minWidth: 150,
    minHeight: 150,
  },

  shapeTwo: {
    width: "28vw",
    height: "28vw",
    bottom: "8%",
    left: "8%",
    minWidth: 180,
    minHeight: 180,
  },

  shapeThree: {
    width: "40vw",
    height: "40vw",
    top: "-10%",
    left: "-10%",
    borderRadius: "20%",
    minWidth: 280,
    minHeight: 280,
  },
};
