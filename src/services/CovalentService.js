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

export const getMultiChainTransactions = async (walletAddress) => {
  try {
    // Get transactions across all supported chains
    const resp = await client.TransactionService.getAllTransactionsForAddress(
      walletAddress,
      { quoteCurrency: "USD" }
    );
    
    if (resp.error) {
      throw new Error(resp.error_message || 'Failed to fetch transactions');
    }

    // Format and sort transactions by date
    const transactions = resp.data.items
      .filter(tx => tx.successful) // Only include successful transactions
      .map(tx => ({
        chainName: tx.chain_name,
        hash: tx.tx_hash,
        timestamp: new Date(tx.block_signed_at),
        from: tx.from_address,
        to: tx.to_address,
        value: tx.value,
        gasSpent: tx.gas_spent,
        gasPrice: tx.gas_price,
        type: tx.type,
        blockHeight: tx.block_height
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    return transactions;
  } catch (error) {
    console.error('Error fetching multichain transactions:', error);
    throw error;
  }
};

// Get transactions for a specific chain
export const getChainTransactions = async (walletAddress, chainName) => {
  try {
    const resp = await client.AllChainsService.getMultiChainMultiAddressTransactions(
      chainName,
      walletAddress,
      { quoteCurrency: "USD" }
    );

    if (resp.error) {
      throw new Error(resp.error_message || 'Failed to fetch transactions');
    }

    return resp.data.items
      .filter(tx => tx.successful)
      .map(tx => ({
        hash: tx.tx_hash,
        timestamp: new Date(tx.block_signed_at),
        from: tx.from_address,
        to: tx.to_address,
        value: tx.value,
        gasSpent: tx.gas_spent,
        gasPrice: tx.gas_price,
        type: tx.type,
        blockHeight: tx.block_height
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error(`Error fetching transactions for ${chainName}:`, error);
    throw error;
  }
};