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

const Portfolio = () => {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const { walletData, isLoading, error } = useWalletData(address, isConnected, selectedChain);
  const [totalValue, setTotalValue] = useState(0);

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
    <div className="portfolio">
      <div className="portfolio-header">
        <h2>Your Mountain Peak Assets</h2>
        <div className="portfolio-controls">
          <ChainSelector 
            selectedChain={selectedChain}
            onChainSelect={setSelectedChain}
          />
        </div>
        <p className="portfolio-total">
          Total Value: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <CrossChainOverview />

      <div className="portfolio-charts">
        <PortfolioPieChart data={assets} />
        <DistributionBarChart data={assets} />
      </div>

      <div className="portfolio-grid">
        {assets.map((asset) => (
          <AssetCard key={asset.contract_address} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio; 