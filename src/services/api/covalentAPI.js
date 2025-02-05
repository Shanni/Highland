import { GoldRushClient } from "@covalenthq/client-sdk";

const COVALENT_API_KEY = process.env.REACT_APP_COVALENT_API_KEY;
const client = new GoldRushClient(COVALENT_API_KEY);

export const covalentAPI = {
  getAddressActivity: async (chainName, address) => {
    const response = await client.BaseService.getAddressActivity({
      chainName,
      address,
    });
    return response.data;
  },

  getTokenBalances: async (chainName, address) => {
    const response = await client.BalanceService.getTokenBalancesForWalletAddress(
      chainName,
      address,
      { nft: false }
    );
    return response.data;
  },

  getTokenPrices: async (chainName, tokenAddresses) => {
    const response = await client.PricingService.getTokenPrices(
      chainName,
      tokenAddresses
    );
    return response.data;
  }
}; 