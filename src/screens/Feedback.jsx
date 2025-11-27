/* JA10/31/25
 * src/screens/Feedback.jsx (web)
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Feedback() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [wantsResponse, setWantsResponse] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isValidEmail = (e) => {
    if (!e) return false;
    return /^.+@.+\..+$/.test(e);
  };

  const onSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!comment) return;
    if (email && !isValidEmail(email)) {
      window.alert('Invalid email: Must enter a validly formatted email');
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement UpdateFeedback API call
      // const res = await UpdateFeedback({ Name: name, Email: email, Phone: phone, Comment: comment, Response: wantsResponse ? 1 : 0, Update: wantsUpdates ? 1 : 0 });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      window.alert('Feedback submitted successfully!');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setComment('');
      setWantsResponse(false);
      setWantsUpdates(false);
    } catch (err) {
      window.alert('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally { 
      setLoading(false); 
    }
  };

  // All styles defined inside component to access isMobile
  const pageStyles = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    flexDirection: isMobile ? 'column' : 'row',
  };

  const sidebarStyles = isMobile ? {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'visible',
    flexShrink: 0,
    WebkitOverflowScrolling: 'touch',
  } : {
    width: 'clamp(15rem, 20vw, 18rem)',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    overflowY: 'auto',
    flexShrink: 0,
  };

  const logoStyles = {
    backgroundColor: '#e84b4b',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: isMobile ? '1rem' : '1.25rem',
    padding: isMobile ? '1rem' : '1.25rem',
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    letterSpacing: '0.06rem',
    flexShrink: 0,
    borderRight: isMobile ? '1px solid rgba(255,255,255,0.3)' : 'none',
  };

  const navHeaderStyles = {
    padding: '1rem 1.25rem 0.5rem 1.25rem',
    fontSize: '0.75rem',
    color: '#666666',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  };

  const navMenuStyles = isMobile ? {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.25rem 0.5rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    flex: 1,
    alignItems: 'center',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'thin',
  } : {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 0.75rem',
  };

  const navItemStyles = isMobile ? {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.2rem',
    padding: '0.5rem 0.65rem',
    color: '#333333',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontSize: '0.65rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  } : {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#333333',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: '0.94rem',
  };

  const navItemActive = {
    backgroundColor: '#f0f0f0',
    color: '#e84b4b',
    fontWeight: 500,
  };

  const navTextStyles = {
    fontSize: isMobile ? '0.625rem' : 'inherit',
    display: 'block',
    textAlign: isMobile ? 'center' : 'left',
  };

  const iconStyles = {
    color: 'currentColor',
    flexShrink: 0,
    width: isMobile ? '1.1rem' : '20px',
    height: isMobile ? '1.1rem' : '20px',
  };

  const contentStyles = {
    flex: 1,
    padding: isMobile ? '1rem' : 'clamp(1rem, 3vw, 2rem)',
    backgroundColor: '#fafafa',
    width: '100%',
  };

  const styles = {
    title: {
      fontSize: '2.25rem',
      color: '#e84b4b',
      fontWeight: 700,
      marginBottom: 0,
    },
    card: {
      backgroundColor: '#fff',
      padding: '0.625rem',
      marginTop: '0.625rem',
      borderRadius: '0.625rem',
      boxShadow: '0 0 0 0.0625rem #f0f0f0 inset',
    },
    input: {
      borderWidth: '0.0625rem',
      borderColor: '#e6e6e6',
      borderStyle: 'solid',
      borderRadius: '0.625rem',
      padding: '0.6875rem',
      marginTop: '0.375rem',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      fontSize: '0.8125rem',
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '0.625rem',
    },
    checkbox: {
      marginRight: '0.375rem',
      cursor: 'pointer',
    },
    label: {
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '0.8125rem',
    },
    button: {
      backgroundColor: '#e84b4b',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.625rem',
      alignItems: 'center',
      marginTop: '0.75rem',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      width: '100%',
    },
  };

  return (
    <div style={pageStyles}>
      {/* Inline CSS for scrollbar */}
      <style>{`
        .feedback-nav-menu::-webkit-scrollbar { height: 4px; }
        .feedback-nav-menu::-webkit-scrollbar-track { background: transparent; }
        .feedback-nav-menu::-webkit-scrollbar-thumb { background: rgba(232, 75, 75, 0.3); border-radius: 10px; }
        .feedback-nav-menu::-webkit-scrollbar-thumb:hover { background: rgba(232, 75, 75, 0.5); }
      `}</style>

      {/* Left Sidebar */}
      <aside style={sidebarStyles}>
        {/* Logo */}
        <div style={logoStyles}>
          GIFT·OLOGY<sup>®</sup>
        </div>

        {/* Navigation Header */}
        {!isMobile && <div style={navHeaderStyles}>Discover</div>}

        {/* Navigation Menu */}
        <nav className="feedback-nav-menu" style={navMenuStyles}>
          <Link to="/dashboard" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7L12 4L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={navTextStyles}>Dashboard</span>
          </Link>
          <Link to="/reports" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <line x1="10" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={navTextStyles}>Reports</span>
          </Link>
          <Link to="/dov" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={navTextStyles}>Dates & DOV</span>
          </Link>
          <Link to="/contacts" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 18C7 15.7909 9.23858 14 12 14C14.7614 14 17 15.7909 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={navTextStyles}>Contacts</span>
          </Link>
          <Link to="/help" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={navTextStyles}>Help</span>
          </Link>
          <Link to="/feedback" style={{...navItemStyles, ...navItemActive}}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L22 6L14 14L10 14L10 10L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={navTextStyles}>Feedback</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={contentStyles}>
        <h1 style={styles.title}>Feedback</h1>
        <div style={styles.card}>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            style={styles.input}
            placeholder="Name"
          />
          <input
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            style={styles.input}
            placeholder="Email"
            type="email"
          />
          <input
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
            style={styles.input}
            placeholder="Phone"
          />

          <div style={styles.checkboxContainer}>
            <input
              id="wantsResponse"
              type="checkbox"
              checked={wantsResponse}
              onChange={(ev) => setWantsResponse(ev.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="wantsResponse" style={styles.label}>I would like a response.</label>
          </div>
          <div style={{...styles.checkboxContainer, marginTop: '0.375rem'}}>
            <input
              id="wantsUpdates"
              type="checkbox"
              checked={wantsUpdates}
              onChange={(ev) => setWantsUpdates(ev.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="wantsUpdates" style={styles.label}>Email me about updates.</label>
          </div>

          <textarea
            value={comment}
            onChange={(ev) => setComment(ev.target.value)}
            style={{...styles.input, height: '11rem', marginTop: '0.75rem'}}
            placeholder=""
          />

          <button
            disabled={!comment || loading}
            style={{
              ...styles.button,
              ...((!comment || loading) ? {opacity: 0.6, cursor: 'not-allowed'} : {})
            }}
            onClick={onSubmit}
          >
            <span style={{color: '#fff', fontWeight: 700}}>{loading ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}