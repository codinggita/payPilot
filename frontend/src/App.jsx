import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Rewards from './pages/Rewards';
import Transactions from './pages/Transactions';
import Reconciliation from './pages/Reconciliation';
import Wallets from './pages/Wallets';
import Statements from './pages/Statements';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="bg-background min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;