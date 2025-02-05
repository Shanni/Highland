import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import AssetCard from './AssetCard';
import PortfolioPieChart from './charts/PortfolioPieChart';
import DistributionBarChart from './charts/DistributionBarChart';
import ChainSelector from './ChainSelector';
import { useWalletData } from '../hooks/useWalletData';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import TransactionHistory from './TransactionHistory';

const ChainAnalysis = () => {
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

  if (isLoading) {
    return <div className="chain-analysis-loading">Loading chain data...</div>;
  }

  if (error) {
    return <div className="chain-analysis-error">Error loading chain data</div>;
  }

  const assets = walletData?.balances?.items || [];

  return (
    <div className="chain-analysis">
      <div className="chain-content">
        <div className="chain-header">
          <div className="header-left">
            <h2>{selectedChain.name} Analysis</h2>
            <p className="chain-total-value">
              Total Value: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <ChainSelector 
            selectedChain={selectedChain}
            onChainSelect={setSelectedChain}
          />
        </div>

        <div className="portfolio-charts">
          <PortfolioPieChart data={assets} />
          <DistributionBarChart data={assets} />
        </div>

        <div className="portfolio-grid">
          {assets.map((asset) => (
            <AssetCard key={asset.contract_address} asset={asset} />
          ))}
        </div>

        {/* <TransactionHistory chainName={selectedChain.name} /> */}
      </div>
    </div>
  );
};

export default ChainAnalysis; 