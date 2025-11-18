// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Thêm các route khác sau */}
        <Route path="/schedule" element={<HomePage />} />
        <Route path="/movies" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/services" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
