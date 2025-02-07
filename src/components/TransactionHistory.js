import { useState } from 'react';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { formatDistanceToNow } from 'date-fns';
import '../styles/TransactionHistory.css';

const TransactionHistory = ({ chainName }) => {
  const { transactions, isLoading, error } = useTransactionHistory(chainName);
  const [selectedTx, setSelectedTx] = useState(null);

  if (isLoading) {
    return <div className="transaction-loading">Loading transaction history...</div>;
  }

  if (error) {
    return <div className="transaction-error">Error: {error}</div>;
  }

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <div className="transaction-list">
        {transactions.map((tx) => (
          <div 
            key={tx.hash} 
            className="transaction-item"
            onClick={() => setSelectedTx(tx.hash === selectedTx ? null : tx.hash)}
          >
            <div className="transaction-main">
              <div className="transaction-info">
                <span className="transaction-type">
                  {tx.chainName && `[${tx.chainName}]`} {tx.type || 'Transfer'}
                </span>
                <span className="transaction-time">
                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                </span>
              </div>
              <div className="transaction-addresses">
                <div className="address-from">
                  From: {shortenAddress(tx.from)}
                </div>
                <div className="address-to">
                  To: {shortenAddress(tx.to)}
                </div>
              </div>
            </div>
            {selectedTx === tx.hash && (
              <div className="transaction-details">
                <div className="detail-item">
                  <span>Gas Used:</span>
                  <span>{tx.gasSpent}</span>
                </div>
                <div className="detail-item">
                  <span>Gas Price:</span>
                  <span>{formatGasPrice(tx.gasPrice)} Gwei</span>
                </div>
                <div className="detail-item">
                  <span>Block:</span>
                  <span>{tx.blockHeight}</span>
                </div>
                <a 
                  href={`https://etherscan.io/tx/${tx.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-explorer"
                >
                  View in Explorer
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatGasPrice = (price) => {
  if (!price) return '0';
  return (Number(price) / 1e9).toFixed(2);
};

export default TransactionHistory; 