import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DistributionBarChart = ({ data }) => {
  const formattedData = data?.map(item => ({
    name: item.contract_ticker_symbol,
    value: Number(item.quote || 0), // Convert to Number
  }))
  .filter(item => item.value > 0)
  .sort((a, b) => b.value - a.value)
  .slice(0, 10) || []; // Show top 10 tokens

  return (
    <div className="chart-container">
      <h3>Asset Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="name"
            tick={{ fill: '#ffffff' }}
          />
          <YAxis 
            tick={{ fill: '#ffffff' }}
            tickFormatter={(value) => `$${Number(value).toLocaleString('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            })}`}
          />
          <Tooltip 
            formatter={(value) => `$${Number(value).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="rgb(56, 95, 58)"
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionBarChart; 