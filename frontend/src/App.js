import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Map from './components/Map';
import OnboardingFlow from './components/registration/OnboardingFlow';
import Main from './components/Main';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Leaderboard from './components/Leaderboard';
import { MapProvider } from './contexts/MapContext';
import Scan from './components/Scan';
import BouncingFace from './components/BounchingFace';
import './styles/globals.css';

function App() {
    return (
        <MapProvider>
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
                    <Route path="/main" element={
                        <ProtectedRoute>
                            <Main />
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
                    <Route path="*" element={<Navigate to="/main" replace />} />
                </Routes>
            </Router>
        </MapProvider>
    );
}

export default App;

