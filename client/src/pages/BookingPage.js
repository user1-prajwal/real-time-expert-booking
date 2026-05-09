
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:5000';

export default function BookingPage() {
  const { id }    = useParams();
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    date:     state?.date     || '',
    timeSlot: state?.timeSlot || '',
    notes: '',
  });
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name     = 'Name is required';
    if (!form.email.trim())                      e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = 'Enter a valid email';
    if (!form.phone.trim())                      e.phone    = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(form.phone))   e.phone    = 'Enter a valid 10-digit phone';
    if (!form.date)                              e.date     = 'Date is required';
    if (!form.timeSlot)                          e.timeSlot = 'Time slot is required';
    return e;
  };

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setServerError('');
    try {
      await axios.post(`${BASE}/bookings`, { expertId: id, ...form });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────
  if (success) return (
    <div style={ss.page}>
      <div style={ss.successWrap}>
        <div style={ss.confetti}>🎉</div>
        <div style={ss.successIcon}>✓</div>
        <h2 style={ss.successTitle}>You're all set!</h2>
        <p style={ss.successSub}>Your session has been booked successfully.</p>

        <div style={ss.successDetails}>
          <div style={ss.detailRow}>
            <span style={ss.detailIcon}>👤</span>
            <span style={ss.detailText}>{state?.expertName}</span>
          </div>
          <div style={ss.detailRow}>
            <span style={ss.detailIcon}>📅</span>
            <span style={ss.detailText}>{form.date}</span>
          </div>
          <div style={ss.detailRow}>
            <span style={ss.detailIcon}>🕐</span>
            <span style={ss.detailText}>{form.timeSlot}</span>
          </div>
          <div style={ss.detailRow}>
            <span style={ss.detailIcon}>📧</span>
            <span style={ss.detailText}>{form.email}</span>
          </div>
        </div>

        <div style={ss.successBtns}>
          <button style={ss.primaryBtn} onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </button>
          <button style={ss.ghostBtn} onClick={() => navigate('/')}>
            Browse Experts
          </button>
        </div>
      </div>
    </div>
  );

  // ── Booking Form ────────────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Expert
      </button>

      <div style={styles.layout}>

        {/* LEFT — Form */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Book a Session</h1>
            <p style={styles.formSub}>Fill in your details to confirm the booking</p>
          </div>

          {serverError && (
            <div style={styles.serverError}>
              ⚠️ {serverError}
            </div>
          )}

          <div style={styles.fields}>

            {/* Name */}
            <div style={styles.field}>
              <label style={styles.label}>Full Name <span style={styles.req}>*</span></label>
              <input
                style={{ ...styles.input, ...(errors.name ? styles.inputErr : {}) }}
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              {errors.name && <span style={styles.errMsg}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address <span style={styles.req}>*</span></label>
              <input
                style={{ ...styles.input, ...(errors.email ? styles.inputErr : {}) }}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
              />
              {errors.email && <span style={styles.errMsg}>{errors.email}</span>}
            </div>

            {/* Phone */}
            <div style={styles.field}>
              <label style={styles.label}>Phone Number <span style={styles.req}>*</span></label>
              <input
                style={{ ...styles.input, ...(errors.phone ? styles.inputErr : {}) }}
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
              {errors.phone && <span style={styles.errMsg}>{errors.phone}</span>}
            </div>

            {/* Date + Time — side by side */}
            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Date <span style={styles.req}>*</span></label>
                <input
                  style={{ ...styles.input, ...(errors.date ? styles.inputErr : {}), background: '#f7fafc' }}
                  type="date"
                  value={form.date}
                  readOnly
                />
                {errors.date && <span style={styles.errMsg}>{errors.date}</span>}
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Time Slot <span style={styles.req}>*</span></label>
                <input
                  style={{ ...styles.input, background: '#f7fafc' }}
                  type="text"
                  value={form.timeSlot}
                  readOnly
                />
              </div>
            </div>

            {/* Notes */}
            <div style={styles.field}>
              <label style={styles.label}>Notes <span style={styles.optional}>(optional)</span></label>
              <textarea
                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                placeholder="Any specific topics, questions, or goals for the session..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>

            <button
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '⏳ Confirming...' : '✓ Confirm Booking'}
            </button>

          </div>
        </div>

        {/* RIGHT — Summary Card */}
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Booking Summary</h3>

          <div style={styles.summaryExpert}>
            <div style={styles.summaryAvatar}>
              {state?.expertName?.charAt(0) || 'E'}
            </div>
            <div>
              <p style={styles.summaryName}>{state?.expertName || 'Expert'}</p>
              <p style={styles.summaryRole}>Expert Session</p>
            </div>
          </div>

          <div style={styles.summaryDivider} />

          <div style={styles.summaryDetails}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryIcon}>📅</span>
              <div>
                <p style={styles.summaryLabel}>Date</p>
                <p style={styles.summaryValue}>{form.date || '—'}</p>
              </div>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryIcon}>🕐</span>
              <div>
                <p style={styles.summaryLabel}>Time</p>
                <p style={styles.summaryValue}>{form.timeSlot || '—'}</p>
              </div>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryIcon}>📋</span>
              <div>
                <p style={styles.summaryLabel}>Status</p>
                <p style={{ ...styles.summaryValue, color: '#d97706', fontWeight: '600' }}>Pending Confirmation</p>
              </div>
            </div>
          </div>

          <div style={styles.summaryDivider} />

          <div style={styles.summaryNote}>
            <p>📌 Your slot will be confirmed once you submit the form.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Success Screen Styles ───────────────────────────────────────
const ss = {
  page:         { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', padding:'16px', background:'#f0f4f8' },
  successWrap:  { background:'#fff', borderRadius:'20px', padding:'48px 40px', textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', maxWidth:'440px', width:'100%' },
  confetti:     { fontSize:'40px', marginBottom:'8px' },
  successIcon:  { width:'64px', height:'64px', background:'#c6f6d5', color:'#276749', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'700', margin:'0 auto 16px' },
  successTitle: { fontSize:'26px', fontWeight:'700', color:'#1a202c', marginBottom:'8px' },
  successSub:   { color:'#718096', marginBottom:'24px', fontSize:'15px' },
  successDetails:{ background:'#f7fafc', borderRadius:'12px', padding:'16px 20px', marginBottom:'24px', textAlign:'left' },
  detailRow:    { display:'flex', alignItems:'center', gap:'10px', padding:'6px 0' },
  detailIcon:   { fontSize:'16px', width:'24px' },
  detailText:   { color:'#4a5568', fontSize:'14px' },
  successBtns:  { display:'flex', flexDirection:'column', gap:'10px' },
  primaryBtn:   { padding:'12px', background:'#2b6cb0', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'15px', fontWeight:'600' },
  ghostBtn:     { padding:'12px', background:'#fff', color:'#4a5568', border:'1px solid #cbd5e0', borderRadius:'10px', cursor:'pointer', fontSize:'15px' },
};

// ── Form Styles ─────────────────────────────────────────────────
const styles = {
  page:         { maxWidth:'1000px', margin:'0 auto', padding:'32px 16px' },
  backBtn:      { display:'inline-flex', alignItems:'center', gap:'6px', background:'none', border:'1px solid #cbd5e0', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontSize:'14px', color:'#4a5568', marginBottom:'24px', fontWeight:'500' },
  layout:       { display:'flex', gap:'24px', alignItems:'flex-start' },

  // Form card
  formCard:     { flex:'1', background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  formHeader:   { marginBottom:'24px' },
  formTitle:    { fontSize:'24px', fontWeight:'700', color:'#1a202c', marginBottom:'6px' },
  formSub:      { color:'#718096', fontSize:'14px' },
  serverError:  { background:'#fff5f5', border:'1px solid #fc8181', color:'#c53030', padding:'12px 16px', borderRadius:'10px', marginBottom:'20px', fontSize:'14px' },
  fields:       { display:'flex', flexDirection:'column', gap:'18px' },
  field:        { display:'flex', flexDirection:'column', gap:'6px' },
  row:          { display:'flex', gap:'16px' },
  label:        { fontSize:'14px', fontWeight:'600', color:'#374151' },
  req:          { color:'#e53e3e' },
  optional:     { color:'#a0aec0', fontWeight:'400', fontSize:'13px' },
  input:        { padding:'11px 14px', borderRadius:'10px', border:'1.5px solid #e2e8f0', fontSize:'15px', outline:'none', transition:'border 0.2s', color:'#1a202c' },
  inputErr:     { border:'1.5px solid #fc8181' },
  errMsg:       { color:'#e53e3e', fontSize:'12px', marginTop:'2px' },
  submitBtn:    { padding:'14px', background:'linear-gradient(135deg, #2b6cb0, #3182ce)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'16px', fontWeight:'600', marginTop:'4px', letterSpacing:'0.3px' },

  // Summary card
  summaryCard:     { width:'300px', background:'#fff', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:'24px', flexShrink: 0 },
  summaryTitle:    { fontSize:'16px', fontWeight:'700', color:'#1a202c', marginBottom:'20px' },
  summaryExpert:   { display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' },
  summaryAvatar:   { width:'48px', height:'48px', borderRadius:'12px', background:'linear-gradient(135deg, #2b6cb0, #63b3ed)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'700', flexShrink:0 },
  summaryName:     { fontWeight:'600', color:'#1a202c', fontSize:'15px', marginBottom:'2px' },
  summaryRole:     { color:'#718096', fontSize:'13px' },
  summaryDivider:  { height:'1px', background:'#edf2f7', margin:'16px 0' },
  summaryDetails:  { display:'flex', flexDirection:'column', gap:'14px' },
  summaryRow:      { display:'flex', alignItems:'flex-start', gap:'12px' },
  summaryIcon:     { fontSize:'18px', marginTop:'2px' },
  summaryLabel:    { color:'#718096', fontSize:'12px', marginBottom:'2px' },
  summaryValue:    { color:'#1a202c', fontSize:'14px', fontWeight:'500' },
  summaryNote:     { background:'#fffbeb', borderRadius:'8px', padding:'12px', color:'#92400e', fontSize:'13px', lineHeight:'1.5' },
};