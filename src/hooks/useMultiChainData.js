import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { SUPPORTED_CHAINS, CHAIN_TO_COVALENT_MAP } from '../config/wagmi';

export const useMultiChainData = (address, isConnected) => {
  const [multiChainData, setMultiChainData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchAllChainsData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching data for chains:', SUPPORTED_CHAINS);
        
        const chainPromises = SUPPORTED_CHAINS.map(async (chain) => {
          try {
            const chainName = CHAIN_TO_COVALENT_MAP[chain.id];
            console.log(`Fetching data for ${chain.name} (${chainName})`);
            
            const balances = await walletService.getWalletBalances(address, chainName);
            
            // Check if balances data is valid
            if (!balances || !balances.items) {
              console.warn(`No valid data returned for ${chain.name}`);
              return {
                chain: chain.name,
                data: { items: [] },
                icon: chain.icon,
                error: new Error('No data available')
              };
            }

            return {
              chain: chain.name,
              data: balances,
              icon: chain.icon
            };
          } catch (chainError) {
            console.error(`Error fetching data for ${chain.name}:`, chainError);
            return {
              chain: chain.name,
              data: { items: [] },
              icon: chain.icon,
              error: chainError
            };
          }
        });

        // Add Solana separately
        chainPromises.push(
          (async () => {
            try {
              const balances = await walletService.getWalletBalances(address, 'solana-mainnet');
              
              // Check if Solana balances data is valid
              if (!balances || !balances.items) {
                console.warn('No valid data returned for Solana');
                return {
                  chain: 'Solana',
                  data: { items: [] },
                  icon: '/chain-icons/sol.png',
                  error: new Error('No data available')
                };
              }

              return {
                chain: 'Solana',
                data: balances,
                icon: '/chain-icons/sol.png'
              };
            } catch (solError) {
              console.error('Error fetching Solana data:', solError);
              return {
                chain: 'Solana',
                data: { items: [] },
                icon: '/chain-icons/sol.png',
                error: solError
              };
            }
          })()
        );

        const results = await Promise.all(chainPromises);
        
        const newMultiChainData = {};
        let newTotalValue = 0;

        results.forEach((chainData) => {
          // Ensure data.items exists before reducing
          const items = chainData.data?.items || [];
          const chainTotal = items.reduce(
            (sum, item) => sum + Number(item.quote || 0),
            0
          );

          newMultiChainData[chainData.chain] = {
            ...chainData,
            totalValue: chainTotal
          };
          
          if (!chainData.error) {
            newTotalValue += chainTotal;
          }
        });

        setMultiChainData(newMultiChainData);
        setTotalValue(newTotalValue);
      } catch (error) {
        console.error('Error in fetchAllChainsData:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchAllChainsData();
    } else {
      setMultiChainData({});
      setTotalValue(0);
      setError(null);
    }
  }, [address, isConnected]);

  return { multiChainData, totalValue, isLoading, error };
}; 