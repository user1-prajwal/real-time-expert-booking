
import React, { useState } from 'react';
import axios from 'axios';

const BASE = 'https://expert-booking-api-cnpe.onrender.com';

const STATUS_CONFIG = {
  Pending:   { bg:'#fffbeb', color:'#92400e', dot:'#f59e0b', label:'Pending'   },
  Confirmed: { bg:'#f0fdf4', color:'#166534', dot:'#22c55e', label:'Confirmed' },
  Completed: { bg:'#eff6ff', color:'#1e40af', dot:'#3b82f6', label:'Completed' },
};

export default function MyBookings() {
  const [email,    setEmail]    = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address'); return;
    }
    setLoading(true); setError(''); setSearched(false);
    try {
      const res = await axios.get(`${BASE}/bookings`, { params: { email } });
      setBookings(res.data.data);
      setSearched(true);
    } catch {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`${BASE}/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
    } catch {
      alert('Failed to update status. Try again.');
    }
  };

  const pending   = bookings.filter(b => b.status === 'Pending');
  const confirmed = bookings.filter(b => b.status === 'Confirmed');
  const completed = bookings.filter(b => b.status === 'Completed');

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>My Bookings</h1>
        <p style={s.subtitle}>Track and manage all your expert sessions</p>
      </div>

      {/* Search Box */}
      <div style={s.searchCard}>
        <div style={s.searchIcon}>📧</div>
        <div style={s.searchContent}>
          <p style={s.searchLabel}>Enter your email to view your bookings</p>
          <div style={s.searchRow}>
            <input
              style={s.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && fetchBookings()}
            />
            <button style={s.searchBtn} onClick={fetchBookings} disabled={loading}>
              {loading ? 'Searching...' : 'Find Bookings'}
            </button>
          </div>
          {error && <p style={s.errorText}>{error}</p>}
        </div>
      </div>

      {/* Stats Row */}
      {searched && !loading && bookings.length > 0 && (
        <div style={s.statsRow}>
          {[
            { label:'Total',     count: bookings.length,  bg:'#f8fafc', color:'#1a202c' },
            { label:'Pending',   count: pending.length,   bg:'#fffbeb', color:'#92400e' },
            { label:'Confirmed', count: confirmed.length, bg:'#f0fdf4', color:'#166534' },
            { label:'Completed', count: completed.length, bg:'#eff6ff', color:'#1e40af' },
          ].map(stat => (
            <div key={stat.label} style={{ ...s.statCard, background: stat.bg }}>
              <p style={{ ...s.statCount, color: stat.color }}>{stat.count}</p>
              <p style={{ ...s.statLabel, color: stat.color }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {searched && !loading && bookings.length === 0 && (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>📭</div>
          <h3 style={s.emptyTitle}>No bookings found</h3>
          <p style={s.emptyText}>No bookings found for <strong>{email}</strong></p>
        </div>
      )}

      {/* Bookings List */}
      {searched && !loading && bookings.length > 0 && (
        <div style={s.list}>
          {bookings.map(b => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Pending;
            return (
              <div key={b._id} style={s.card}>

                {/* Colored left stripe */}
                <div style={{ ...s.stripe, background: cfg.dot }} />

                <div style={s.cardBody}>

                  {/* Top row — expert info + status */}
                  <div style={s.cardTop}>
                    <div style={s.expertInfo}>
                      <div style={s.expertAvatar}>
                        {b.expert?.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <h3 style={s.expertName}>{b.expert?.name}</h3>
                        <span style={s.categoryBadge}>{b.expert?.category}</span>
                      </div>
                    </div>
                    <div style={{ ...s.statusBadge, background: cfg.bg, color: cfg.color }}>
                      <span style={{ ...s.statusDot, background: cfg.dot }} />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Detail chips */}
                  <div style={s.detailsRow}>
                    <div style={s.detailChip}><span>📅</span><span>{b.date}</span></div>
                    <div style={s.detailChip}><span>🕐</span><span>{b.timeSlot}</span></div>
                    <div style={s.detailChip}><span>👤</span><span>{b.name}</span></div>
                    <div style={s.detailChip}><span>📱</span><span>{b.phone}</span></div>
                  </div>

                  {/* Notes */}
                  {b.notes && (
                    <div style={s.notesBox}>
                      <span>📝</span>
                      <span style={s.notesText}>{b.notes}</span>
                    </div>
                  )}

                  {/* Footer — date + action buttons */}
                  <div style={s.cardFooter}>
                    <p style={s.bookedOn}>
                      Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', {
                        day:'numeric', month:'short', year:'numeric'
                      })}
                    </p>
                    <div style={s.actionBtns}>
                      {b.status === 'Pending' && (
                        <button style={s.confirmBtn} onClick={() => updateStatus(b._id, 'Confirmed')}>
                          ✓ Confirm Booking
                        </button>
                      )}
                      {b.status === 'Confirmed' && (
                        <button style={s.completeBtn} onClick={() => updateStatus(b._id, 'Completed')}>
                          ✓ Mark as Done
                        </button>
                      )}
                      {b.status === 'Completed' && (
                        <span style={s.doneLabel}>✅ Session Completed</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page:          { maxWidth:'860px', margin:'0 auto', padding:'32px 16px' },
  header:        { marginBottom:'28px' },
  title:         { fontSize:'30px', fontWeight:'700', color:'#1a202c', marginBottom:'6px' },
  subtitle:      { color:'#718096', fontSize:'15px' },

  searchCard:    { background:'#fff', borderRadius:'16px', padding:'24px 28px', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', marginBottom:'24px', display:'flex', gap:'16px', alignItems:'flex-start' },
  searchIcon:    { fontSize:'28px', marginTop:'4px' },
  searchContent: { flex:1 },
  searchLabel:   { fontSize:'14px', color:'#718096', marginBottom:'10px' },
  searchRow:     { display:'flex', gap:'10px' },
  input:         { flex:1, padding:'11px 16px', borderRadius:'10px', border:'1.5px solid #e2e8f0', fontSize:'15px', outline:'none', color:'#1a202c' },
  searchBtn:     { padding:'11px 24px', background:'linear-gradient(135deg,#2b6cb0,#3182ce)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'15px', fontWeight:'600', whiteSpace:'nowrap' },
  errorText:     { color:'#e53e3e', fontSize:'13px', marginTop:'8px' },

  statsRow:      { display:'flex', gap:'12px', marginBottom:'24px' },
  statCard:      { flex:1, borderRadius:'12px', padding:'16px', textAlign:'center' },
  statCount:     { fontSize:'28px', fontWeight:'700', marginBottom:'2px' },
  statLabel:     { fontSize:'13px', fontWeight:'500' },

  emptyState:    { background:'#fff', borderRadius:'16px', padding:'60px 20px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' },
  emptyIcon:     { fontSize:'48px', marginBottom:'16px' },
  emptyTitle:    { fontSize:'20px', fontWeight:'600', color:'#1a202c', marginBottom:'8px' },
  emptyText:     { color:'#718096', fontSize:'15px' },

  list:          { display:'flex', flexDirection:'column', gap:'16px' },
  card:          { background:'#fff', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', display:'flex', overflow:'hidden' },
  stripe:        { width:'5px', flexShrink:0 },
  cardBody:      { flex:1, padding:'20px 24px' },

  cardTop:       { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  expertInfo:    { display:'flex', alignItems:'center', gap:'12px' },
  expertAvatar:  { width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,#2b6cb0,#63b3ed)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'700', flexShrink:0 },
  expertName:    { fontSize:'17px', fontWeight:'600', color:'#1a202c', marginBottom:'4px' },
  categoryBadge: { background:'#ebf8ff', color:'#2b6cb0', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' },
  statusBadge:   { display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600' },
  statusDot:     { width:'7px', height:'7px', borderRadius:'50%', flexShrink:0 },

  detailsRow:    { display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'12px' },
  detailChip:    { display:'flex', alignItems:'center', gap:'6px', background:'#f7fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'6px 12px', fontSize:'13px', color:'#4a5568' },

  notesBox:      { display:'flex', gap:'8px', background:'#fffbeb', borderRadius:'8px', padding:'10px 14px', marginBottom:'12px', alignItems:'flex-start' },
  notesText:     { fontSize:'13px', color:'#92400e', lineHeight:'1.5' },

  cardFooter:    { display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f1f5f9', paddingTop:'12px', marginTop:'4px' },
  bookedOn:      { color:'#a0aec0', fontSize:'12px' },
  actionBtns:    { display:'flex', gap:'8px' },
  confirmBtn:    { padding:'7px 16px', background:'#f0fdf4', color:'#166534', border:'1px solid #bbf7d0', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
  completeBtn:   { padding:'7px 16px', background:'#eff6ff', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
  doneLabel:     { fontSize:'13px', color:'#166534', fontWeight:'600' },
};