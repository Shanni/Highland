import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import AssetCard from './AssetCard';
import PortfolioPieChart from './charts/PortfolioPieChart';
import DistributionBarChart from './charts/DistributionBarChart';
import ChainSelector from './ChainSelector';
import { useWalletData } from '../hooks/useWalletData';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import '../styles/Portfolio.css';
import CrossChainOverview from './CrossChainOverview';
import Navigation from './Navigation';
import ChainAnalysis from './ChainAnalysis';

const Portfolio = () => {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const { walletData, isLoading, error } = useWalletData(address, isConnected, selectedChain);
  const [totalValue, setTotalValue] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (walletData?.balances?.items) {
      const total = walletData.balances.items.reduce(
        (sum, item) => sum + Number(item.quote || 0),
        0
      );
      setTotalValue(total);
    }
  }, [walletData]);

  if (!isConnected) {
    return (
      <div className="portfolio-connect-prompt">
        <h2>Connect your wallet to view your portfolio</h2>
      </div>
    );
  }

  if (isLoading) {
    return <div className="portfolio-loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio-error">Error loading portfolio data</div>;
  }

  const assets = walletData?.balances?.items || [];

  return (
    <div className="portfolio-container">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="portfolio-content">
        {activeSection === 'overview' && (
          <>
            <CrossChainOverview />
            <ChainAnalysis />
          </>
        )}
        {activeSection === 'performance' && (
          <div className="coming-soon">
            Performance metrics coming soon...
          </div>
        )}
        {activeSection === 'history' && (
          <div className="coming-soon">
            Transaction history coming soon...
          </div>
        )}
        {activeSection === 'alerts' && (
          <div className="coming-soon">
            Price alerts coming soon...
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio; 