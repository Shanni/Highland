import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-header">
          <span className="tooltip-label">{label}</span>
        </div>
        <div className="tooltip-value">
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

const DistributionBarChart = ({ data }) => {
  const formattedData = data
    ?.map(item => ({
      name: item.contract_ticker_symbol,
      value: Number(item.quote || 0),
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="chart-container">
      <h3>Asset Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData} barSize={32}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            opacity={0.1}
            vertical={false}
          />
          <XAxis 
            dataKey="name"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
          />
          <YAxis 
            tick={{ fill: '#ffffff', fontSize: 12 }}
            axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
            tickFormatter={(value) => `$${Number(value).toLocaleString('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            })}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionBarChart; 