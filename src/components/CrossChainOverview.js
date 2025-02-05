import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMultiChainData } from '../hooks/useMultiChainData';
import { useAccount } from 'wagmi';
import '../styles/CrossChainOverview.css';

const COLORS = ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c'];

const CrossChainOverview = () => {
  const { address, isConnected } = useAccount();
  const { multiChainData, totalValue, isLoading, error } = useMultiChainData(address, isConnected);

  if (!isConnected) return null;
  if (isLoading) return <div className="cross-chain-loading">Loading cross-chain data...</div>;
  if (error) {
    return (
      <div className="cross-chain-error">
        <p>Error loading cross-chain data</p>
        <p className="error-details">{error.message}</p>
      </div>
    );
  }

  const chartData = Object.entries(multiChainData)
    .map(([chain, data], index) => ({
      name: chain,
      value: data.totalValue,
      icon: data.icon,
      color: COLORS[index % COLORS.length]
    }))
    .filter(item => item.value > 0);

  return (
    <div className="cross-chain-overview">
      <h3>Cross-Chain Overview</h3>
      <div className="cross-chain-total">
        Total Portfolio Value: ${totalValue.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })}
      </div>
      
      <div className="cross-chain-distribution">
        <div className="chain-breakdown">
          {Object.entries(multiChainData).map(([chain, data]) => (
            <div key={chain} className="chain-item">
              <div className="chain-header">
                <img src={data.icon} alt={chain} className="chain-icon" />
                <span className="chain-name">{chain}</span>
              </div>
              <div className="chain-value">
                ${data.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="chain-percentage">
                {totalValue > 0 ? (
                  `${((data.totalValue / totalValue) * 100).toFixed(1)}%`
                ) : '0%'}
              </div>
            </div>
          ))}
        </div>

        <div className="chain-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${Number(value).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CrossChainOverview; 