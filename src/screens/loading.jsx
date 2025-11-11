import React, { useEffect, useState } from "react";
import giftologyLogo from "./assets/giftology.png"; // ✅ correct path

export default function LoadingScreen({ duration = 2500, onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div style={styles.page}>
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

      <div style={styles.content}>
        <div style={styles.textSection}>
          <h1 style={styles.radarTitle}>Relationship Radar</h1>
          <p style={styles.poweredBy}>Powered by:</p>
        </div>

        <img
          src={giftologyLogo}
          alt="Giftology Logo"
          className="giftology-logo"
          style={styles.logo}
        />

        <div className="loading-spinner" style={styles.spinner}></div>
      </div>

      {/* Subtle background shapes */}
      <div style={{ ...styles.shape, ...styles.shape1 }}></div>
      <div style={{ ...styles.shape, ...styles.shape2 }}></div>
      <div style={{ ...styles.shape, ...styles.shape3 }}></div>
    </div>
  );
}

/* 🎨 Inline CSS styles */
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
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  content: {
    textAlign: "left",
    maxWidth: "650px",
    zIndex: 10,
  },
  textSection: {
    marginBottom: "22px",
    marginLeft: "10px",
  },
  radarTitle: {
    fontSize: "36px", // 🔹 larger overall
    fontWeight: "400", // 🔹 normal weight (not bold)
    color: "#000000",
    marginBottom: "4px",
    lineHeight: "1.2",
  },
  poweredBy: {
    fontSize: "18px", // 🔹 larger but lighter
    fontWeight: "400",
    color: "#555555",
    marginBottom: "16px",
  },
  logo: {
    width: "380px", // 🔹 bigger logo for visual balance
    height: "auto",
    marginLeft: "10px",
    marginBottom: "38px",
    objectFit: "contain",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.18)", // 🔹 subtle shadow for depth
  },
  spinner: {
    width: "56px", // 🔹 slightly larger spinner
    height: "56px",
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
  shape1: {
    width: "250px",
    height: "250px",
    top: "5%",
    right: "10%",
  },
  shape2: {
    width: "340px",
    height: "340px",
    bottom: "8%",
    left: "8%",
  },
  shape3: {
    width: "540px",
    height: "540px",
    top: "-10%",
    left: "-10%",
    borderRadius: "20%",
  },
};
