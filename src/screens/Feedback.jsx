/* JA10/31/25
 * src/screens/Feedback.jsx (web)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateFeedback } from '../api';
import { log } from '../utils/debug';
import {
  DashboardIcon,
  ReportsIcon,
  CalendarIcon,
  ContactsIcon,
  HelpIcon,
  FeedbackIcon,
} from '../components/Icons';

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
      log('Feedback: submitting', { name, email: email ? email.replace(/(.{2}).+(@.+)/,'$1***$2') : '', phone, wantsResponse, wantsUpdates });
      const res = await UpdateFeedback({ Name: name, Email: email, Phone: phone, Comment: comment, Response: wantsResponse ? 1 : 0, Update: wantsUpdates ? 1 : 0 });
      log('Feedback: response', res);
      if (res?.requestUrl) { try { log('Feedback: UpdateFeedback URL (masked):', res.requestUrl.replace(/([&?]AC=)[^&]*/,'$1***')); log('Feedback: UpdateFeedback URL (full):', res.requestUrl); } catch(err){} }
      if (res?.success) {
        window.alert('Feedback submitted successfully!');
        navigate('/dashboard');
      } else {
        window.alert(res?.message || 'Failed to submit feedback');
      }
    } catch (err) {
      log('Feedback exception', err && err.stack ? err.stack : err);
      window.alert(String(err));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Sidebar */}
      {isDesktop && (
        <aside
          style={{
            width: 280,
            backgroundColor: '#fff',
            borderRight: '1px solid #eee',
            height: '100vh',
            position: 'fixed',
          }}
        >
          <div
            style={{
              backgroundColor: '#e84b4b',
              padding: 8,
              margin: 16,
              borderRadius: 3,
            }}
          >
            <div
              style={{
                border: '1.6px solid #fff',
                borderRadius: 2,
                padding: 12,
                textAlign: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: 22,
              }}
            >
              GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub>
            </div>
          </div>

          <div style={{ color: '#999', padding: '0 16px 8px', fontSize: 13 }}>Discover</div>

          <div
            style={sideItem}
            onClick={() => navigate('/dashboard')}
          >
            <DashboardIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Dashboard</span>
          </div>
          <div style={sideItem}>
            <ReportsIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Reports</span>
          </div>
          <div style={sideItem}>
            <CalendarIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Dates & DOV</span>
          </div>
          <div style={sideItem}>
            <ContactsIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Contacts</span>
          </div>
          <div style={sideItem}>
            <HelpIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Help</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
              color: '#333',
              gap: 8,
            }}
          >
            <FeedbackIcon size={16} color="#333" />
            <span style={{ fontSize: 14 }}>Feedback</span>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: 32,
          marginLeft: isDesktop ? 280 : 0,
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
          <div style={{...styles.checkboxContainer, marginTop: 6}}>
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
            style={{...styles.input, height: 176, marginTop: 12}}
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
    fontSize: 36,
    color: '#e84b4b',
    fontWeight: 700,
    marginBottom: 0,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    boxShadow: '0 0 0 1px #f0f0f0 inset',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 11,
    marginTop: 6,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: 13,
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 6,
    cursor: 'pointer',
  },
  label: {
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#e84b4b',
    padding: 12,
    border: 'none',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    width: '100%',
  },
};

const sideItem = {
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
};

