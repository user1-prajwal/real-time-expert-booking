import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<ExpertList />} />
        <Route path="/experts/:id"    element={<ExpertDetail />} />
        <Route path="/book/:id"       element={<BookingPage />} />
        <Route path="/my-bookings"    element={<MyBookings />} /> 
      </Routes>
    </BrowserRouter>
  );
}