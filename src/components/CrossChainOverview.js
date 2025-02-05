import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMultiChainData } from '../hooks/useMultiChainData';
import { useAccount } from 'wagmi';
import { ChevronDown, ChevronUp } from 'react-feather';
import '../styles/CrossChainOverview.css';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chain-tooltip">
        <div className="chain-tooltip-header">
          <img src={payload[0].payload.icon} alt="" className="chain-tooltip-icon" />
          <span>{payload[0].name}</span>
        </div>
        <div className="chain-tooltip-value">
          ${Number(payload[0].value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </div>
    );
  }
  return null;
};

const CrossChainOverview = () => {
  const { address, isConnected } = useAccount();
  const { multiChainData, totalValue, isLoading, error } = useMultiChainData(address, isConnected);
  const [isExpanded, setIsExpanded] = useState(true);

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
      <div 
        className="overview-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="overview-title">
          <h3>Cross-Chain Overview</h3>
          <div className="total-value">
            Total Portfolio Value: ${totalValue.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <div className={`overview-content ${isExpanded ? 'expanded' : ''}`}>
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
                  innerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  strokeWidth={1}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      opacity={0.9}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainOverview; 