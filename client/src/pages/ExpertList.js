import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:5000';
const CATEGORIES = ['All','Technology','Finance','Design','Marketing'];

export default function ExpertList() {
  const [experts, setExperts]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchExperts();
  // }, [page, category]);
  useEffect(() => {
  const delay = setTimeout(() => {
    fetchExperts();
  }, 400); // waits 400ms after user stops typing
  return () => clearTimeout(delay);
}, [page, category, search]);

  const fetchExperts = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${BASE}/experts`, {
        params: { page, limit: 6, category, search }
      });
      setExperts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to load experts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setPage(1);
  //   fetchExperts();
  // };
  const handleSearch = (e) => {
  e.preventDefault();
  setPage(1);
};

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Find Your Expert</h1>

      {/* Search + Filter */}
      <div style={styles.filterBar}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.input}
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={styles.btn} type="submit">Search</button>
        </form>
        <div style={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(category === cat ? styles.catActive : {}) }}
              onClick={() => { setCategory(cat); setPage(1); }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <p style={styles.center}>Loading experts...</p>}

      {/* Error */}
      {error && <p style={{ ...styles.center, color: 'red' }}>{error}</p>}

      {/* Expert Cards */}
      {!loading && !error && (
        <>
          {experts.length === 0 ? (
            <p style={styles.center}>No experts found.</p>
          ) : (
            <div style={styles.grid}>
              {experts.map(exp => (
                <div key={exp._id} style={styles.card}>
                  <img src={exp.image} alt={exp.name} style={styles.avatar} />
                  <h3 style={styles.name}>{exp.name}</h3>
                  <span style={styles.badge}>{exp.category}</span>
                  <p style={styles.meta}>⭐ {exp.rating} &nbsp;|&nbsp; {exp.experience} yrs exp</p>
                  <p style={styles.bio}>{exp.bio}</p>
                  <button style={styles.viewBtn} onClick={() => navigate(`/experts/${exp._id}`)}>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page:       { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  title:      { fontSize:'28px', fontWeight:'700', marginBottom:'24px', color:'#2b6cb0' },
  filterBar:  { marginBottom:'28px' },
  searchForm: { display:'flex', gap:'10px', marginBottom:'14px' },
  input:      { flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #cbd5e0', fontSize:'15px' },
  btn:        { padding:'10px 20px', background:'#2b6cb0', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px' },
  categories: { display:'flex', gap:'8px', flexWrap:'wrap' },
  catBtn:     { padding:'7px 16px', borderRadius:'20px', border:'1px solid #cbd5e0', background:'#fff', cursor:'pointer', fontSize:'13px' },
  catActive:  { background:'#2b6cb0', color:'#fff', border:'1px solid #2b6cb0' },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'24px' },
  card:       { background:'#fff', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' },
  avatar:     { width:'80px', height:'80px', borderRadius:'50%', marginBottom:'12px', objectFit:'cover' },
  name:       { fontSize:'18px', fontWeight:'600', marginBottom:'6px' },
  badge:      { background:'#ebf8ff', color:'#2b6cb0', padding:'3px 12px', borderRadius:'20px', fontSize:'12px', marginBottom:'8px' },
  meta:       { color:'#718096', fontSize:'14px', marginBottom:'8px' },
  bio:        { color:'#4a5568', fontSize:'13px', marginBottom:'16px', lineHeight:'1.5' },
  viewBtn:    { padding:'9px 24px', background:'#2b6cb0', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', width:'100%' },
  center:     { textAlign:'center', marginTop:'40px', fontSize:'16px', color:'#718096' },
  pagination: { display:'flex', justifyContent:'center', alignItems:'center', gap:'16px', marginTop:'32px' },
  pageBtn:    { padding:'8px 18px', background:'#2b6cb0', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', disabled:{opacity:0.5} },
  pageInfo:   { fontSize:'15px', color:'#4a5568' },
};