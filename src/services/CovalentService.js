import { GoldRushClient } from "@covalenthq/client-sdk";

const COVALENT_API_KEY = process.env.REACT_APP_COVALENT_API_KEY;
const client = new GoldRushClient(COVALENT_API_KEY);

export const getWalletActivity = async (walletAddress, chainName = "eth-mainnet") => {
  try {
    const response = await client.BaseService.getAddressActivity({
      chainName,
      address: walletAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet activity:", error);
    throw error;
  }
};

export const getWalletBalances = async (walletAddress, chainName = "eth-mainnet") => {
  try {
    const response = await client.BalanceService.getTokenBalancesForWalletAddress(
      chainName,
      walletAddress,
      { nft: false }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    throw error;
  }
};

export const getTokenPrices = async (chainName = "eth-mainnet", tokenAddresses) => {
  try {
    const response = await client.PricingService.getTokenPrices(
      chainName,
      tokenAddresses
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
}; 