/* JA10/31/25
 * src/screens/Feedback.jsx (web)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import { getMenuItems } from '../utils/menuConfig.jsx';
import { removeAuthCode } from '../utils/storage';

export default function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [wantsResponse, setWantsResponse] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsDesktop(window.innerWidth >= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

      {/* Left Sidebar */}
      {isDesktop && (
        <Sidebar 
          onItemClick={handleMenuClick}
          currentPath={location.pathname}
        />
      )}

      {/* Main Content */}
      <main style={{...contentStyles, paddingTop: !isDesktop ? 'calc(env(safe-area-inset-top, 12px) + 72px)' : undefined}}>
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