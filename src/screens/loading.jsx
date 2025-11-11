/*
 * JA11/10/25
 * src/screens/LoadingScreen.jsx (web)
 * Giftology Relationship Radar - Loading Screen
 * This screen shows a loading spinner with the Giftology logo and title.
 * The screen disappears after a few seconds.
 * Euan Flores
 */

import React, { useEffect, useState } from "react";
import giftologyLogo from "./assets/giftology.png"; // logo image

export default function LoadingScreen(props) {
  const [isVisible, setIsVisible] = useState(true);

  // This part will hide the loading screen after a short time
  useEffect(() => {
    const timeLimit = props.duration || 2500; // how long it stays visible (in milliseconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (props.onFinish) {
        props.onFinish();
      }
    }, timeLimit);

    // This cleans up the timer if the page changes before time is up
    return () => {
      clearTimeout(timer);
    };
  }, [props.duration, props.onFinish]);

  // If not visible anymore, return nothing (empty screen)
  if (isVisible === false) {
    return null;
  }

  return (
    <div style={styles.page}>
      {/* This style adds the spinning animation and responsive rules */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .giftology-logo {
              width: 240px !important;
            }
            .radar-title {
              font-size: 26px !important;
            }
            .powered-by {
              font-size: 14px !important;
            }
          }

          @media (max-width: 480px) {
            .giftology-logo {
              width: 200px !important;
            }
            .radar-title {
              font-size: 22px !important;
            }
          }
        `}
      </style>

      {/* The main content in the center */}
      <div style={styles.content}>
        <div style={styles.textArea}>
          <h1 style={styles.radarTitle}>Relationship Radar</h1>
          <p style={styles.poweredBy}>Powered by:</p>
        </div>

        <img
          src={giftologyLogo}
          alt="Giftology Logo"
          className="giftology-logo"
          style={styles.logo}
        />

        {/* The loading circle animation */}
        <div className="loading-spinner" style={styles.spinner}></div>
      </div>

      {/* Background shapes just for decoration */}
      <div style={{ ...styles.shape, ...styles.shapeOne }}></div>
      <div style={{ ...styles.shape, ...styles.shapeTwo }}></div>
      <div style={{ ...styles.shape, ...styles.shapeThree }}></div>
    </div>
  );
}

// Page styles (like CSS but written inside JavaScript)
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
  },

  poweredBy: {
    fontSize: 18,
    color: "#555555",
    marginBottom: 16,
  },

  logo: {
    width: 380,
    height: "auto",
    marginLeft: 10,
    marginBottom: 36,
    objectFit: "contain",
    borderRadius: 8,
    boxShadow: "0 5px 15px rgba(0,0,0,0.18)",
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
  },

  shapeOne: {
    width: 250,
    height: 250,
    top: "5%",
    right: "10%",
  },

  shapeTwo: {
    width: 340,
    height: 340,
    bottom: "8%",
    left: "8%",
  },

  shapeThree: {
    width: 540,
    height: 540,
    top: "-10%",
    left: "-10%",
    borderRadius: "20%",
  },
};
