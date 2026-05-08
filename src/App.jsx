// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import './index.css';

function App() {
  const [userData, setUserData] = useState({
    selectedCareer: null,
    triviaAnswers: {},
    userName: '',
    userLevel: 'beginner'
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/signup" 
          element={<SignUp userData={userData} setUserData={setUserData} />} 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard userData={userData} setUserData={setUserData} />} 
        />
        <Route path="/lesson/:id" element={<Lesson userData={userData} />} />
      </Routes>
    </Router>
  );
}

export default App;