
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthorizeDeviceID } from '../utils/api';
import { setAuthCode, removeAuthCode } from '../utils/storage';
import './Verify.css';
import { getLoginCredentials } from '../utils/storage.js';

export default function Verify() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const creds = await getLoginCredentials();
      setEmail(creds.email || '');
      setPassword(creds.password || '');
      console.log('Loaded credentials:', creds.email, creds.password);
    })();
  }, []);

  const onSubmit = async () => {
    if (code.length !== 6) return;

    setLoading(true);
    try {
      // Use the user-entered 6-digit security code
      const res = await AuthorizeDeviceID({
        SecurityCode: code,
        UserName: email,
        Password: password,
        DeviceID: localStorage.getItem("DeviceID"),
        Date: localStorage.getItem("Date"),
        Key: localStorage.getItem("AuthKey")
      });

      if (res?.success) {
        // Extract the Authorization Code from the <Auth> tag in the response
        const ac = res?.parsed?.Auth || res?.parsed?.auth || res?.parsed?.AC || res?.parsed?.ac || '';
        if (ac) {
          // Store the AC in a cookie that expires in 30 days (1 month)
          await setAuthCode(ac);
        }
        navigate('/dashboard');
      } else {
        alert(res?.message || 'Verification failed');
        await removeAuthCode(); 
        navigate('/login');     
      }
    } catch (e) {
      alert(`Error: ${String(e)}`);
      await removeAuthCode();
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <div className="verify-page">
      <main className="verify-content">
        <div className="relationship-radar-section">
          <h1 className="relationship-radar-title">ROR</h1>
          <p className="powered-by">Powered by:</p>
        </div>

        <div className="logo-container">
          <div className="giftology-logo">
            GIFT·OLOGY<sup>®</sup>
          </div>
        </div>

        <div className="verify-card">
          <h2 className="verify-title">Verify</h2>
          <p className="verify-instructions">
            A security code is being texted to your phone. Enter the code below
          </p>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            className="verify-input"
            placeholder="Enter 6 digit code"
            maxLength="6"
            inputMode="numeric"
          />
          <button
            disabled={code.length !== 6 || loading}
            className={`verify-submit-button ${(code.length !== 6 || loading) ? 'disabled' : ''}`}
            onClick={onSubmit}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </main>

      <div className="bg-pattern bg-pattern-top-left"></div>
      <div className="bg-pattern bg-pattern-top-right"></div>
      <div className="bg-pattern bg-pattern-bottom-left"></div>
      <div className="bg-pattern bg-pattern-bottom-right"></div>
    </div>
  );
}
