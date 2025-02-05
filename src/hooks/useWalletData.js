import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';

export const useWalletData = (address, isConnected) => {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [balances, activity] = await Promise.all([
          walletService.getWalletBalances(address),
          walletService.getWalletActivity(address)
        ]);
        
        setWalletData({
          balances,
          activity
        });
      } catch (error) {
        setError(error);
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchWalletData();
    } else {
      setWalletData(null);
      setError(null);
    }
  }, [address, isConnected]);

  return { walletData, isLoading, error };
}; 