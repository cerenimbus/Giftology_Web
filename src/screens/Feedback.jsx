/* JA10/31/25
 * src/screens/Feedback.jsx (web)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { UpdateFeedback } from '../api';
// import { log } from '../utils/debug';
// import {
//   DashboardIcon,
//   ReportsIcon,
//   CalendarIcon,
//   ContactsIcon,
//   HelpIcon,
//   FeedbackIcon,
// } from '../components/Icons';

export default function Feedback() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [wantsResponse, setWantsResponse] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Sidebar */}
      {isDesktop && (
        <aside
          style={{
            width: '17.5rem',
            backgroundColor: '#fff',
            borderRight: '0.0625rem solid #eee',
            height: '100vh',
            position: 'fixed',
          }}
        >
          <div
            style={{
              backgroundColor: '#e84b4b',
              padding: '0.5rem',
              margin: '1rem',
              borderRadius: '0.1875rem',
            }}
          >
            <div
              style={{
                border: '0.1rem solid #fff',
                borderRadius: '0.125rem',
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '1.375rem',
              }}
            >
              GIFT·OLOGY<sub style={{ fontSize: '0.5rem', verticalAlign: '0.01em' }}>®</sub>
            </div>
          </div>

          <div style={{ color: '#999', padding: '0 1rem 0.5rem', fontSize: '0.8125rem' }}>Discover</div>

          <div
            style={sideItem}
            onClick={() => navigate('/dashboard')}
          >
            {/* {<DashboardIcon size={16} color="#333" /> */} 
            <span style={{ fontSize: '0.875rem' }}>Dashboard</span>
          </div>
          <div style={sideItem}>
            {/* <ReportsIcon size={16} color="#333" /> */}
            <span style={{ fontSize: '0.875rem' }}>Reports</span>
          </div>
          <div style={sideItem}>
            {/* <CalendarIcon size={16} color="#333" /> */}
            <span style={{ fontSize: '0.875rem' }}>Dates & DOV</span>
          </div>
          <div style={sideItem}>
            {/* <ContactsIcon size={16} color="#333" /> */}
            <span style={{ fontSize: '0.875rem' }}>Contacts</span>
          </div>
          <div style={sideItem}>
            {/* <HelpIcon size={16} color="#333" /> */}
            <span style={{ fontSize: '0.875rem' }}>Help</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.625rem 1rem',
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
              color: '#333',
              gap: '0.5rem',
            }}
          >
            {/* <FeedbackIcon size={16} color="#333" /> */}
            <span style={{ fontSize: '0.875rem' }}>Feedback</span>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          marginLeft: isDesktop ? '17.5rem' : 0,
          width: '100%',
        }}
      >
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

const sideItem = {
  padding: '0.625rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
};

