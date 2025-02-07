import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getMultiChainTransactions, getChainTransactions } from '../services/CovalentService';

export const useTransactionHistory = (chainName = null) => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address) return;

      setIsLoading(true);
      setError(null);

      try {
        const txs = chainName 
          ? await getChainTransactions(address, chainName)
          : await getMultiChainTransactions(address);
        setTransactions(txs);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, isConnected, chainName]);

  return { transactions, isLoading, error };
}; 