import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Map from './components/Map';
import OnboardingFlow from './components/registration/OnboardingFlow';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Leaderboard from './components/Leaderboard';
import Scan from './components/Scan';
import BouncingFace from './components/BounchingFace';
import './styles/globals.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/" element={
                    <PublicRoute>
                        <OnboardingFlow />
                    </PublicRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/map" element={
                    <ProtectedRoute>
                        <Map />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                    <ProtectedRoute>
                        <Leaderboard />
                    </ProtectedRoute>
                } />
                <Route path="/scan" element={
                    <ProtectedRoute>
                        <Scan />
                    </ProtectedRoute>
                } />
                <Route path="/bounce" element={
                    <ProtectedRoute>
                        <BouncingFace />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/map" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

