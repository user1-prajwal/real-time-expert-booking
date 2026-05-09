import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎯 ExpertBook</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Experts</Link>
        <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav:    { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#2b6cb0', padding:'14px 32px' },
  brand:  { color:'#fff', fontWeight:'bold', fontSize:'20px', textDecoration:'none' },
  links:  { display:'flex', gap:'20px' },
  link:   { color:'#bee3f8', textDecoration:'none', fontSize:'15px', fontWeight:'500' },
};