/*
 * FINAL Loading Screen (Web)
 * Matches exact layout from screenshot
 * KML responsive loading screen update 11/25/25
 * new update 11/26/25
 */

import React, { useEffect, useState } from "react";

/* ------------------ Giftology SVG Logo Component ------------------ */
function GiftologyLogo({ width = 350 }) {
  const height = Math.round(width * 0.34);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1000 340"
      role="img"
      aria-label="GIFT·OLOGY"
      style={{ display: "block" }}
    >
      {/* Brand red background */}
      <rect x="0" y="0" width="1000" height="340" fill="#ef1f16" />

      {/* White border */}
      <rect
        x="45"
        y="45"
        width="910"
        height="250"
        rx="10"
        ry="10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
      />

      {/* Wordmark */}
      <text
        x="500"
        y="195"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        fontWeight="700"
        fontSize="130"
        letterSpacing="8"
      >
        GIFT·OLOGY
      </text>

      {/* Registered ® symbol */}
      <text
        x="890"
        y="225"
        fill="#ffffff"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        fontWeight="700"
        fontSize="35"
      >
        ®
      </text>
    </svg>
  );
}

/* ------------------ MAIN LOADING SCREEN ------------------ */
export default function LoadingScreen({ duration = 2500, onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish && onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!isVisible) return null;

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* CENTER CONTAINER */}
      <div style={styles.centerBox}>

        {/* Left-aligned Text */}
        <div style={styles.textBlock}>
          <div style={styles.relationTitle}>Relationship Radar</div>
          <div style={styles.powered}>Powered by:</div>
        </div>

        {/* Giftology Logo */}
        <GiftologyLogo width={350} />

        {/* Spinner */}
        <div style={styles.spinner} />
      </div>

      {/* Decorative Shapes */}
      <div style={{ ...styles.shape, ...styles.shapeOne }}></div>
      <div style={{ ...styles.shape, ...styles.shapeTwo }}></div>
      <div style={{ ...styles.shape, ...styles.shapeThree }}></div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // keeps logo centered
    zIndex: 10,
  },

  textBlock: {
    width: "350px", // matches logo width
    textAlign: "left",
    marginBottom: 10,
  },

  relationTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: "#111",
    marginBottom: 4,
  },

  powered: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },

  spinner: {
    width: 56,
    height: 56,
    border: "4px solid #f5b7b7",
    borderTopColor: "#e84b4b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginTop: 30,
  },

  /* Decorative background circles */
  shape: {
    position: "absolute",
    border: "1px solid rgba(232, 75, 75, 0.12)",
    borderRadius: "50%",
    pointerEvents: "none",
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
