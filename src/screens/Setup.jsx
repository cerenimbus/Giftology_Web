// RHCM: 12/19/2025
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetUserInfo } from '../utils/api';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import { getMenuItems } from '../utils/menuConfig.jsx';
import { removeAuthCode } from '../utils/storage';

export default function Setup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const loadUserInfo = async () => {
      const r = await GetUserInfo();
      if (r.success) {
        setUserInfo(r.data);
      }
    };
    loadUserInfo();
  }, []);

  // Automatically run setup when component mounts
  useEffect(() => {
    if (userInfo) {
      runSetup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const runSetup = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

  //   try {
  //     // Use proxy in development, direct URL in production
  //     const apiUrl = import.meta.env.DEV 
  //       ? '/api/KEAP/giftology_setup.php'
  //       : 'https://radar.giftologygroup.com/api/KEAP/giftology_setup.php';

  //     const response = await fetch(
  //       apiUrl,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ subscriber_serial: userInfo?.subscriber, useremail: userInfo?.email })
  //       }
  //     );
      
  //     console.log('API URL:', apiUrl);
  //     console.log('API Body:', { subscriber_serial: userInfo?.subscriber, useremail: userInfo?.email });
  //     console.log('API Response:', response);

  //     // Get response text first to check if it's JSON
  //     const responseText = await response.text();
      
  //     // Log the response for debugging
  //     console.log('API Response Status:', response.status);
  //     console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
  //     console.log('API Response Text (first 500 chars):', responseText.substring(0, 500));
      
  //     // Check if response is HTML (error page)
  //     if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
  //       // Try to extract error message from HTML if possible
  //       const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
  //       const errorMsg = titleMatch ? titleMatch[1] : 'Unknown error';
  //       throw new Error(`Server returned an HTML page instead of JSON. Page title: "${errorMsg}". The API endpoint may not exist or the proxy configuration may be incorrect.`);
  //     }

  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}`);
  //     }

  //     // Try to parse as JSON
  //     let data;
  //     try {
  //       data = JSON.parse(responseText);
  //       console.log('Parsed API Response:', data);
  //       console.log('Created Tags:', data.created_tags);
  //     } catch (parseError) {
  //       throw new Error(`Invalid JSON response from server. Response: ${responseText.substring(0, 200)}`);
  //     }

  //     setResult(data);
  //   } catch (err) {
  //     const errorMessage = err.message || "Failed to run setup. Please try again.";
  //     setError(errorMessage);
  //     console.error('Setup error:', err);
  //   }

  //   setLoading(false);
  // };

  // try {
  //   const apiUrl = import.meta.env.DEV 
  //     ? '/api/KEAP/giftology_setup.php'
  //     : 'https://radar.giftologygroup.com/api/KEAP/giftology_setup.php';
  
  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       subscriber_serial: userInfo?.subscriber,
  //       useremail: userInfo?.email
  //     })
  //   });
  
  //   // Read raw text first
  //   const responseText = await response.text();
  
  //   // Detect HTML error pages
  //   if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
  //     const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
  //     const errorMsg = titleMatch ? titleMatch[1] : "Unknown HTML error";
  //     throw new Error(`Server returned HTML. Page title: "${errorMsg}".`);
  //   }
  
  //   // Parse JSON
  //   let data;
  //   try {
  //     data = JSON.parse(responseText);
  //   } catch {
  //     throw new Error("Invalid JSON from server: " + responseText.substring(0, 300));
  //   }
  
  //   console.log("Parsed API Response:", data);
  
  //   // ⭐ Handle 401 redirects exactly like your earlier .then() version
  //   if (response.status === 401 && data.authorize_url) {
  //     console.log("Redirecting to authorize_url:", data.authorize_url);
  //     window.location.href = data.authorize_url;
  //     return; // stop execution
  //   }
  
  //   // Handle other HTTP errors
  //   if (!response.ok) {
  //     throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${responseText}`);
  //   }
  
  //   console.log("Setup result:", data);
  
  //   // Save data
  //   setResult(data);
  
  // } catch (err) {
  //   setError(err.message || "Failed to run setup. Please try again.");
  //   console.error("Setup error:", err);
  // }
  
  // setLoading(false);
  try {
    const apiUrl = import.meta.env.DEV 
      ? '/api/KEAP/giftology_setup.php'
      : 'https://radar.giftologygroup.com/api/KEAP/giftology_setup.php';
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriber_serial: userInfo?.subscriber,
        useremail: userInfo?.email
      })
    });
  console.log('API Body:', { subscriber_serial: userInfo?.subscriber, useremail: userInfo?.email });
  console.log('API Response:', response);
  
    const responseText = await response.text();
  
    // Detect HTML error pages
    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
      const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
      const errorMsg = titleMatch ? titleMatch[1] : "Unknown HTML error";
      throw new Error(`Server returned HTML. Page title: "${errorMsg}".`);
    }
  
    // Parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON from server: " + responseText.substring(0, 300));
    }
  
    console.log("Parsed API Response:", data);
  
    // ⭐ Handle 401 + authorize_url with 2 second delay
    if (response.status === 401 && data.authorize_url) {
      console.error("Authorization required. Redirecting in 2 seconds...");
  
      // show error in your UI
      setError(data.message || "Authorization required");
  
      setTimeout(() => {
        window.location.href = data.authorize_url;
      }, 2000); // 2 seconds
  
      return; // stop further code
    }
  
    // Other errors
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${responseText}`);
    }
  
    console.log("Setup result:", data);
    setResult(data);
  
  } catch (err) {
    setError(err.message || "Failed to run setup. Please try again.");
    console.error("Setup error:", err);
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
      <main style={{
        ...contentStyles,
        paddingTop: !isDesktop ? 'calc(env(safe-area-inset-top, 12px) + 72px)' : 40,
        paddingLeft: isDesktop ? 40 : 16,
        paddingRight: isDesktop ? 40 : 16,
        paddingBottom: 40,
        marginLeft: isDesktop ? 280 : 0,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={styles.title}>Setup CRM Integration</h1>
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Giftology KEAP Setup</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Running setup for <strong>subscriber_serial = {userInfo?.subscriber}</strong>
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

