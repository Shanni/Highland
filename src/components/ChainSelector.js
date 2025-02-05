import { useState } from 'react';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import '../styles/ChainSelector.css';

const ChainSelector = ({ selectedChain, onChainSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chain-selector">
      <button 
        className="chain-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={selectedChain.icon} 
          alt={selectedChain.name} 
          className="chain-icon"
        />
        <span>{selectedChain.name}</span>
        <span className="arrow">▼</span>
      </button>

      {isOpen && (
        <div className="chain-dropdown">
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              className={`chain-option ${selectedChain.id === chain.id ? 'selected' : ''}`}
              onClick={() => {
                onChainSelect(chain);
                setIsOpen(false);
              }}
            >
              <img 
                src={chain.icon} 
                alt={chain.name} 
                className="chain-icon"
              />
              <span>{chain.name}</span>
            </button>
          ))}
          <button
            className={`chain-option ${selectedChain === 'solana' ? 'selected' : ''}`}
            onClick={() => {
              onChainSelect('solana');
              setIsOpen(false);
            }}
          >
            <img 
              src="/chain-icons/sol.png" 
              alt="Solana" 
              className="chain-icon"
            />
            <span>Solana</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChainSelector; 