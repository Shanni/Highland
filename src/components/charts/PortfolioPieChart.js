import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  'rgb(56, 95, 58)',    // Forest Green
  'rgb(131, 97, 83)',   // Earth Brown
  'rgb(47, 67, 99)',    // Navy Blue
  'rgb(172, 134, 148)', // Mauve
  'rgb(82, 57, 101)',   // Deep Purple
  'rgb(96, 92, 132)',   // Dusty Purple
];

const PortfolioPieChart = ({ data }) => {
  const formattedData = data?.map((item, index) => ({
    name: item.contract_ticker_symbol,
    value: Number(item.quote || 0),
    color: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0) || [];

  const sortedData = formattedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="chart-container">
      <h3>Portfolio Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {sortedData.map((entry, index) => (
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
  );
};

export default PortfolioPieChart; 