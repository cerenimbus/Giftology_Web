import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Setup() {
  const navigate = useNavigate();
  const subscriberSerial = 1; // HARDCODED VALUE

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatically run setup when component mounts
  useEffect(() => {
    runSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSetup = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Use proxy in development, direct URL in production
      const apiUrl = import.meta.env.DEV 
        ? '/api/KEAP/giftology_setup.php'
        : 'https://radar.giftologygroup.com/api/KEAP/giftology_setup.php';

      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ subscriber_serial: subscriberSerial })
        }
      );

      // Get response text first to check if it's JSON
      const responseText = await response.text();
      
      // Log the response for debugging
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('API Response Text (first 500 chars):', responseText.substring(0, 500));
      
      // Check if response is HTML (error page)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        // Try to extract error message from HTML if possible
        const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
        const errorMsg = titleMatch ? titleMatch[1] : 'Unknown error';
        throw new Error(`Server returned an HTML page instead of JSON. Page title: "${errorMsg}". The API endpoint may not exist or the proxy configuration may be incorrect.`);
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}`);
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);
        console.log('Created Tags:', data.created_tags);
      } catch (parseError) {
        throw new Error(`Invalid JSON response from server. Response: ${responseText.substring(0, 200)}`);
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err.message || "Failed to run setup. Please try again.";
      setError(errorMessage);
      console.error('Setup error:', err);
    }

    setLoading(false);
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
      padding: '1.5rem',
      marginTop: '0.625rem',
      borderRadius: '0.625rem',
      boxShadow: '0 0 0 0.0625rem #f0f0f0 inset',
    },
    button: {
      backgroundColor: '#e84b4b',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.625rem',
      alignItems: 'center',
      marginTop: '1rem',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 600,
      fontSize: '1rem',
    },
    error: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '0.5rem',
      color: '#c00',
    },
    success: {
      marginTop: '1.5rem',
      padding: '1.5rem',
      backgroundColor: '#efe',
      border: '1px solid #cfc',
      borderRadius: '0.5rem',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '1rem 0 0 0',
    },
    listItem: {
      padding: '0.75rem',
      marginBottom: '0.5rem',
      backgroundColor: '#fafafa',
      borderRadius: '0.5rem',
      border: '1px solid #eee',
    },
  };

  return (
    <div style={pageStyles}>
      {/* Inline CSS for scrollbar */}
      <style>{`
        .setup-nav-menu::-webkit-scrollbar { height: 4px; }
        .setup-nav-menu::-webkit-scrollbar-track { background: transparent; }
        .setup-nav-menu::-webkit-scrollbar-thumb { background: rgba(232, 75, 75, 0.3); border-radius: 10px; }
        .setup-nav-menu::-webkit-scrollbar-thumb:hover { background: rgba(232, 75, 75, 0.5); }
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
        <nav className="setup-nav-menu" style={navMenuStyles}>
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
          <Link to="/feedback" style={navItemStyles}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L22 6L14 14L10 14L10 10L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={navTextStyles}>Feedback</span>
          </Link>
          <Link to="/setup" style={{...navItemStyles, ...navItemActive}}>
            <svg style={iconStyles} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={navTextStyles}>Setup CRM Integration</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={contentStyles}>
        <h1 style={styles.title}>Setup CRM Integration</h1>
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Giftology KEAP Setup</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Running setup for <strong>subscriber_serial = {subscriberSerial}</strong>
          </p>
          {loading && (
            <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <strong>Processing setup...</strong>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={styles.error}>
              <strong>{error}</strong>
            </div>
          )}

          {/* SUCCESS RESULTS */}
          {result && (
            <div style={styles.success}>
              <h3 style={{ marginTop: 0, color: '#060', fontSize: '1.25rem' }}>{result.message || 'Setup completed successfully'}</h3>
              {result.created_tags && Array.isArray(result.created_tags) && result.created_tags.length > 0 ? (
                <>
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Tag Sync Results:</h4>
                  <ul style={styles.list}>
                    {result.created_tags.map((t, index) => {
                      const tagName = t.tag_name || t.tag ;
                    //   const keapId = t.keap_id;
                      return (
                        <li key={index} style={styles.listItem}>
                          <strong>{tagName}</strong>
                          {/* {keapId !== null && keapId !== undefined ? (
                            <span> — KEAP ID: {keapId}</span>
                          ) : (
                            <span> — Created (ID pending)</span>
                          )} */}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : result.created_tags && Array.isArray(result.created_tags) && result.created_tags.length === 0 ? (
                <p style={{ marginTop: '1rem', color: '#666', fontStyle: 'italic' }}>
                  No tags were created or updated.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

