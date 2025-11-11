/*
 * JA10/31/25
 * src/screens/Login.jsx (web)
 * FINAL: Giftology Relationship Radar login layout
 * - Logo perfected (® aligned)
 * - Email & Password fields fully blank (no placeholder)
 * - "Log in" title is now not bold (fontWeight 400)
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthorizeUser } from '../api/index.js';
import { setAuthCode, getAuthCode } from '../utils/storage.js';
import { log } from '../utils/debug.js';

/** ✅ Giftology logo — perfected version (® baseline-aligned beside Y) */
function GiftologyLogo({ width = 340 }) {
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

      {/* ® — slightly larger and closer to Y */}
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
  const [email, setEmail] = useState(''); // blank
  const [password, setPassword] = useState(''); // blank
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const code = await getAuthCode();
      if (code) navigate('/main', { replace: true });
    })();
  }, [navigate]);

  const onSignIn = async () => {
    if (!termsChecked) return;
    setLoading(true);
    try {
      log('Login: sign-in pressed', { email, termsChecked });
      const res = await AuthorizeUser({
        UserName: email,
        Password: password,
        GiftologyVersion: 1,
        Language: 'EN',
      });
      if (res?.success) {
        const ac = res?.parsed?.Auth || res?.parsed?.auth || '';
        if (ac) await setAuthCode(ac);
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

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerWrap}>
        <div style={styles.headerTop}>
          <div style={styles.relationTitle}>Relationship Radar</div>
          <div style={styles.powered}>Powered by:</div>
        </div>
        <GiftologyLogo width={340} />
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.title}>Log in</div>

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

        {/* Login button */}
        <button
          disabled={!termsChecked || loading}
          style={{ ...styles.button, opacity: !termsChecked || loading ? 0.6 : 1 }}
          onClick={onSignIn}
        >
          {loading ? 'Signing in...' : 'Log in'}
        </button>

        {/* Checkbox and Terms */}
        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={termsChecked}
            onChange={(e) => setTermsChecked(e.target.checked)}
            style={styles.nativeCheckbox}
          />
          <span style={styles.small}>
            Accept{' '}
            <a
              href="https://radar.giftologygroup.com/privacypolicy.html"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              terms and Privacy Policy
            </a>
          </span>
        </div>

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
    padding: 20,
  },
  headerWrap: {
    textAlign: 'left',
    marginBottom: 10,
    width: 340,
  },
  headerTop: { marginBottom: 8 },
  relationTitle: { fontSize: 18, color: '#111', fontWeight: 500 },
  powered: { fontSize: 13, color: '#555' },

  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 30,
    width: 340,
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    textAlign: 'left',
  },
  title: {
    fontSize: 22,
    fontWeight: 400, // ✅ changed to remove bold
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
    width: '100%',
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
    fontSize: 15,
    marginTop: 20,
    cursor: 'pointer',
  },
  checkboxRow: { display: 'flex', alignItems: 'center', marginTop: 16 },
  nativeCheckbox: { marginRight: 6 },
  small: { fontSize: 13, color: '#222' },
  link: { color: '#000', textDecoration: 'none', fontWeight: 500 },
  reset: { color: '#000', textDecoration: 'none', fontSize: 13 },
};
