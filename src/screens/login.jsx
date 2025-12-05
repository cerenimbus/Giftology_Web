/*
 * JA10/31/25 (Updated for Responsiveness)
 * src/screens/Login.jsx (web)
 * FINAL: Giftology Relationship Radar login layout
 * - Logo perfected (® aligned)
 * - Email & Password fields fully blank
 * - "Log in" title fontWeight 400
 * - ADDED: Mobile Responsiveness (Screen Cap < 480px)
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthorizeUser } from '../utils/api';
import { getAuthCode } from '../utils/storage.js';

/** ✅ Giftology logo */
function GiftologyLogo({ width }) {
  // calculate height based on aspect ratio to prevent layout shifts
  const height = Math.round(width * 0.34);
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1000 340"
      role="img"
      aria-label="GIFT·OLOGY"
      style={{ display: 'block', marginTop: 8 }}
    >
      <rect x="0" y="0" width="1000" height="340" fill="#ef1f16" />
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

export default function Login() {
  const navigate = useNavigate();
  
  // --- RESPONSIVE STATE ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track screen resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the "Cap" (Breakpoint)
  const isMobile = windowWidth < 480;

  // Dynamic calculations based on screen size
  // If screen is smaller than 380px, the logo shrinks to fit the screen minus padding
  const cardMaxWidth = 340;
  const logoWidth = Math.min(cardMaxWidth, windowWidth - 40); 

  // ------------------------

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const code = await getAuthCode();
      if (code) navigate('/dashboard', { replace: true });
    })();
  }, [navigate]);

  const onSignIn = async () => {
    if (!termsChecked) return;
    setLoading(true);
    try {
      const res = await AuthorizeUser({
        UserName: email,
        Password: password,
        GiftologyVersion: 1,
        Language: 'EN',
      });
      if (res?.success) {
        // AuthorizeUser doesn't return an AC - that comes from AuthorizeDeviceID
        // Just navigate to verify screen where user will enter security code
        navigate('/verify');
      } else {
        window.alert(`Sign in failed: ${res?.message || 'Unable to authorize employee'}`);
      }
    } catch (e) {
      window.alert(`Error: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  // Merge dynamic styles with base styles
  const currentStyles = {
    ...styles,
    // Adjust header width to match the dynamic logo width
    headerWrap: {
      ...styles.headerWrap,
      width: '100%', 
      maxWidth: cardMaxWidth
    },
    // Card becomes fluid (100%) but stops growing at 340px
    card: {
      ...styles.card,
      width: '100%',
      maxWidth: cardMaxWidth,
      padding: isMobile ? 20 : 30, // Reduce padding on small screens
    },
    title: {
      ...styles.title,
      fontSize: isMobile ? 20 : 22, // Slightly smaller title on mobile
    },
    // Inputs stay 100%, so they will naturally shrink with the card
    button: {
      ...styles.button,
      fontSize: isMobile ? 14 : 15, // Adjust button text size
    }
  };

  return (
    <div style={currentStyles.page}>
      {/* Header */}
      <div style={currentStyles.headerWrap}>
        <div style={styles.headerTop}>
          <div style={styles.relationTitle}>Relationship Radar</div>
          <div style={styles.powered}>Powered by:</div>
        </div>
        {/* Pass dynamic width to logo */}
        <GiftologyLogo width={logoWidth} />
      </div>

      {/* Card */}
      <div style={currentStyles.card}>
        <div style={currentStyles.title}>Log in</div>

        {/* Email */}
        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        {/* Password */}
        <label style={styles.label}>Password</label>
        <div style={styles.passwordWrap}>
          <input
            style={{ ...styles.input, paddingRight: 70 }}
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            style={styles.passwordToggle}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        <label style={styles.label}>By logging into the system you agree to receive multi-factor-authentication by text message, data and message rates may apply.</label>
        
        {/* Checkbox and Terms */}
        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={termsChecked}
            onChange={(e) => setTermsChecked(e.target.checked)}
            style={styles.nativeCheckbox}
          />
          {/* <span style={styles.small}>
            Accept{' '}
            <a
              href="https://radar.giftologygroup.com/privacypolicy.html"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Terms and Privacy Policy
            </a>
          </span> */}

          <span style={styles.small}>
            Accept{' '}
            <a
              href="https://radar.giftologygroup.com/terms.html"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href="https://radar.giftologygroup.com/privacypolicy.html"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Privacy Policy
            </a>
          </span>
        </div>

        {/* Login button */}
        <button
          disabled={!termsChecked || loading}
          style={{ ...currentStyles.button, opacity: !termsChecked || loading ? 0.6 : 1 }}
          onClick={onSignIn}
        >
          {loading ? 'Signing in...' : 'Log in'}
        </button>

        

        {/* Reset password */}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Link to="/forgot" style={styles.reset}>
            Reset Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    padding: 20, // Keep outer padding so card doesn't touch screen edge
  },
  headerWrap: {
    textAlign: 'left',
    marginBottom: 10,
    // width handled dynamically now
  },
  headerTop: { marginBottom: 8 },
  relationTitle: { fontSize: 18, color: '#111', fontWeight: 500 },
  powered: { fontSize: 13, color: '#555' },

  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 10,
    // padding, width, and maxWidth handled dynamically in Render
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    textAlign: 'left',
  },
  title: {
    // fontSize handled dynamically
    fontWeight: 400,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: '0.3px',
  },
  label: {
    fontSize: 14,
    color: '#333',
    display: 'block',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: '100%', // This allows it to shrink when the parent card shrinks
    height: 40,
    padding: '0 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: 14,
  },
  passwordWrap: { position: 'relative' },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#777',
    fontSize: 13,
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    backgroundColor: '#ef1f16',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '12px 0',
    fontWeight: 600,
    // fontSize handled dynamically
    marginTop: 20,
    cursor: 'pointer',
  },
  checkboxRow: { display: 'flex', alignItems: 'center', marginTop: 16 },
  nativeCheckbox: { marginRight: 6 },
  small: { fontSize: 13, color: '#222' },
  link: { color: '#000', textDecoration: 'underline', fontWeight: 500 },
  reset: { color: '#000', textDecoration: 'none', fontSize: 13 },
};