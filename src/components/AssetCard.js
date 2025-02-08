const AssetCard = ({ asset }) => {
  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(balance);
  };

  return (
    <div className="asset-card">
      <div className="asset-icon">
        <img 
          src={asset.logo_url || '/default-token.png'} 
          alt={asset.contract_ticker_symbol} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-token.png';
          }}
        />
      </div>
      <div className="asset-info">
        <h3>{asset.contract_name}</h3>
        <p className="asset-symbol">{asset.contract_ticker_symbol}</p>
        <p className="asset-price">
          {formatValue(asset.quote_rate)}
        </p>
        <p className="asset-balance">
          Balance: {formatBalance(Number(asset.balance) / Math.pow(10, Number(asset.contract_decimals))) } {asset.contract_ticker_symbol}
        </p>
        <p className="asset-value">
          Value: {formatValue(asset.quote)}
        </p>
      </div>
    </div>
  );
};

export default AssetCard; 