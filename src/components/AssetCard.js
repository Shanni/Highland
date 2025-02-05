const AssetCard = ({ asset }) => {
  return (
    <div className="asset-card">
      <div className="asset-icon">
        <img src={asset.icon} alt={asset.symbol} />
      </div>
      <div className="asset-info">
        <h3>{asset.name}</h3>
        <p className="asset-symbol">{asset.symbol}</p>
        <p className="asset-price">${asset.price}</p>
        <p className="asset-balance">
          Balance: {asset.balance} {asset.symbol}
        </p>
      </div>
    </div>
  );
};

export default AssetCard; 