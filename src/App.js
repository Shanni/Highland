import { useState } from 'react';
import { createClient } from 'viem';
import './App.css';
import Portfolio from './components/Portfolio';
import WalletConnect from './components/WalletConnect';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Highland</h1>
          <p>Your Peak Crypto Portfolio Manager</p>
        </div>
        <WalletConnect />
      </header>
      <main>
        <Portfolio />
      </main>
    </div>
  );
}

export default App;
