import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoll from './components/CreatePoll';
import PollPage from './components/PollPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <h1>QuickPoll 🗳️</h1>
                <Routes>
                    <Route path="/" element={<CreatePoll />} />
                    <Route path="/poll/:uniqueId" element={<PollPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;