
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const BASE   = 'https://expert-booking-api-cnpe.onrender.com';
const socket = io(BASE);

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null); // NEW — tracks selected slot

  // eslint-disable-next-line
  useEffect(() => {
    fetchExpert();

    // Real-time slot update via socket
    socket.on('slotBooked', ({ expertId, date, timeSlot }) => {
      if (expertId === id) {
        setExpert(prev => {
          if (!prev) return prev;
          const updated = prev.timeSlots.map(s =>
            s.date === date && s.time === timeSlot ? { ...s, isBooked: true } : s
          );
          return { ...prev, timeSlots: updated };
        });
        // If the booked slot was selected by this user, deselect it
        setSelectedSlot(prev =>
          prev?.date === date && prev?.time === timeSlot ? null : prev
        );
      }
    });

    return () => socket.off('slotBooked');
  }, [id]);

  const fetchExpert = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${BASE}/experts/${id}`);
      setExpert(res.data.data);
      const dates = [...new Set(res.data.data.timeSlots.map(s => s.date))];
      if (dates.length) setSelectedDate(dates[0]);
    } catch {
      setError('Failed to load expert details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.isBooked) return;
    // If clicking the same slot again, deselect it
    if (selectedSlot?.time === slot.time && selectedSlot?.date === slot.date) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ date: slot.date, time: slot.time });
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot) return;
    navigate(`/book/${expert._id}`, {
      state: {
        date:       selectedSlot.date,
        timeSlot:   selectedSlot.time,
        expertName: expert.name,
      }
    });
  };

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (error)   return <p style={{ ...styles.center, color:'red' }}>{error}</p>;
  if (!expert) return null;

  const dates        = [...new Set(expert.timeSlots.map(s => s.date))];
  const slotsForDate = expert.timeSlots.filter(s => s.date === selectedDate);

  return (
    <div style={styles.page}>

      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Experts
      </button>

      {/* Expert Info Card */}
      <div style={styles.card}>
        <img src={expert.image} alt={expert.name} style={styles.avatar} />
        <div>
          <h1 style={styles.name}>{expert.name}</h1>
          <span style={styles.badge}>{expert.category}</span>
          <p style={styles.meta}>⭐ {expert.rating} &nbsp;|&nbsp; {expert.experience} years experience</p>
          <p style={styles.bio}>{expert.bio}</p>
        </div>
      </div>

      {/* Time Slots Section */}
      <div style={styles.slotSection}>
        <h2 style={styles.sectionTitle}>Available Time Slots</h2>

        {/* Date Tabs */}
        <div style={styles.dateTabs}>
          {dates.map(date => (
            <button
              key={date}
              style={{
                ...styles.dateTab,
                ...(selectedDate === date ? styles.dateTabActive : {})
              }}
              onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
            >
              {new Date(date).toLocaleDateString('en-IN', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </button>
          ))}
        </div>

        {/* Slots Grid */}
        <div style={styles.slots}>
          {slotsForDate.map((slot, i) => {
            const isSelected = selectedSlot?.time === slot.time && selectedSlot?.date === slot.date;
            return (
              <button
                key={i}
                disabled={slot.isBooked}
                style={{
                  ...styles.slot,
                  ...(slot.isBooked
                    ? styles.slotBooked
                    : isSelected
                      ? styles.slotSelected
                      : styles.slotAvailable)
                }}
                onClick={() => handleSlotClick(slot)}
              >
                {slot.time}
                {slot.isBooked  && <span style={styles.slotLabel}> Booked</span>}
                {isSelected     && <span style={styles.slotLabel}> ✓ Selected</span>}
              </button>
            );
          })}
        </div>

        <p style={styles.hint}>
          🟢 Available &nbsp; 🔵 Selected &nbsp; 🔴 Booked &nbsp;|&nbsp; Slots update in real-time
        </p>

        {/* Book Now Button — only shows when a slot is selected */}
        {selectedSlot && (
          <div style={styles.bookBar}>
            <p style={styles.bookBarText}>
              📅 {selectedSlot.date} &nbsp;|&nbsp; 🕐 {selectedSlot.time}
            </p>
            <button style={styles.bookBtn} onClick={handleBookNow}>
              Book This Slot →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:          { maxWidth:'900px', margin:'0 auto', padding:'32px 16px' },

  // Back button
  backBtn:       { display:'inline-flex', alignItems:'center', gap:'6px', background:'none', border:'1px solid #cbd5e0', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontSize:'14px', color:'#4a5568', marginBottom:'20px', fontWeight:'500' },

  // Expert card
  card:          { background:'#fff', borderRadius:'12px', padding:'28px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', display:'flex', gap:'24px', alignItems:'flex-start', marginBottom:'28px' },
  avatar:        { width:'100px', height:'100px', borderRadius:'50%', objectFit:'cover', flexShrink:0 },
  name:          { fontSize:'24px', fontWeight:'700', marginBottom:'8px' },
  badge:         { background:'#ebf8ff', color:'#2b6cb0', padding:'3px 12px', borderRadius:'20px', fontSize:'13px' },
  meta:          { color:'#718096', fontSize:'14px', margin:'10px 0' },
  bio:           { color:'#4a5568', fontSize:'14px', lineHeight:'1.6' },

  // Slot section
  slotSection:   { background:'#fff', borderRadius:'12px', padding:'28px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  sectionTitle:  { fontSize:'20px', fontWeight:'600', marginBottom:'16px', color:'#2b6cb0' },
  dateTabs:      { display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' },
  dateTab:       { padding:'8px 16px', borderRadius:'8px', border:'1px solid #cbd5e0', background:'#f7fafc', cursor:'pointer', fontSize:'13px' },
  dateTabActive: { background:'#2b6cb0', color:'#fff', border:'1px solid #2b6cb0' },
  slots:         { display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'16px' },
  slot:          { padding:'10px 18px', borderRadius:'8px', border:'2px solid transparent', cursor:'pointer', fontSize:'14px', fontWeight:'500', transition:'all 0.15s' },
  slotAvailable: { background:'#c6f6d5', color:'#276749', border:'2px solid transparent' },
  slotSelected:  { background:'#2b6cb0', color:'#fff', border:'2px solid #1a4d8f' },
  slotBooked:    { background:'#fed7d7', color:'#9b2335', cursor:'not-allowed', border:'2px solid transparent' },
  slotLabel:     { fontSize:'11px' },
  hint:          { color:'#718096', fontSize:'13px', marginBottom:'16px' },

  // Book bar — appears when slot is selected
  bookBar:       { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#ebf8ff', border:'1px solid #bee3f8', borderRadius:'10px', padding:'14px 20px', marginTop:'8px' },
  bookBarText:   { color:'#2b6cb0', fontWeight:'500', fontSize:'15px' },
  bookBtn:       { padding:'10px 24px', background:'#2b6cb0', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'600' },

  center:        { textAlign:'center', marginTop:'60px', fontSize:'16px', color:'#718096' },
};