import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Portfolio from './components/Portfolio';
import WalletConnect from './components/WalletConnect';
import { config } from './config/wagmi';
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
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
        <Analytics />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
