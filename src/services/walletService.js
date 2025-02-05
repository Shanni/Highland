import { covalentAPI } from './api/covalentAPI';

export const walletService = {
  getWalletActivity: async (walletAddress, chainName = "eth-mainnet") => {
    try {
      return await covalentAPI.getAddressActivity(chainName, walletAddress);
    } catch (error) {
      console.error("Error fetching wallet activity:", error);
      throw error;
    }
  },

  getWalletBalances: async (walletAddress, chainName = "eth-mainnet") => {
    try {
      return await covalentAPI.getTokenBalances(chainName, walletAddress);
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      throw error;
    }
  },

  getTokenPrices: async (chainName = "eth-mainnet", tokenAddresses) => {
    try {
      return await covalentAPI.getTokenPrices(chainName, tokenAddresses);
    } catch (error) {
      console.error("Error fetching token prices:", error);
      throw error;
    }
  }
}; 