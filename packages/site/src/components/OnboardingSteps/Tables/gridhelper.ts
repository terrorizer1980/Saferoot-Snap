import { ethers } from "ethers";
import { makeAPICall } from "../../../hooks/API/helpers";
import { APICalls } from "../../../hooks/API/types";
// Type of supported tokens from database record
export interface SupportedToken {
  address: string;
  name: string;
  symbol: string;
  chain_id: number;
  network_id: number;
  price: number;
  token_image_url?: string;
  last_updated: Date;
  imageUrl?: string;
}

// User's token balance object
export interface TokenBalance {
  address: string;
  symbol: string;
  balance: number;
  price: number;
  totalValue: number;
  image?: string;
}

export interface SelectedNFTToken {
  address: string;
  tokenId: number;
}

// User's NFT object
export interface NFTData {
  name: string;
  id: number;
  imageUrl: string;
  tokenId: string;
  collection: {
    id: number;
    name: string;
  };
  ethAmount: number;
  usdAmount: number;
  assetContract: {
    address: string;
    chainIdentifier: string;
    schemaName: string;
    owner: string;
    assetContractType: string;
  };
}

// Fetches supported tokens from the API
export const fetchSupportedTokens = async (
  chainId: number,
  setSupportedTokens?: React.Dispatch<React.SetStateAction<SupportedToken[]>>
): Promise<SupportedToken[]> => {
  const { data } = await makeAPICall(APICalls.GET_SUPPORTED_TOKENS, { chainId })
  if (setSupportedTokens) setSupportedTokens(data as SupportedToken[]);
  return data;
};

// Fetches supported tokens from through RPC calls to get balances of supported tokens
export const fetchSupportedTokenBalances = async (
  supportedTokens: SupportedToken[],
  setBalances?: React.Dispatch<React.SetStateAction<TokenBalance[]>>
): Promise<TokenBalance[]> => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

    // The ABI erc20 ABI for fetching token balances
    const tokenAbi = ["function balanceOf(address) view returns (uint256)"];
    const tokenAddresses = supportedTokens.map((token) => token.address);
    const tokenContracts = tokenAddresses.map(
      (address) => new ethers.Contract(address, tokenAbi, provider)
    );

    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const balances = await Promise.all(
      tokenContracts.map(async (contract) => {
        const balance = await contract.balanceOf(userAddress);
        const balanceNumber = Number(
          ethers.utils.formatEther(balance.toString())
        );
        const token: SupportedToken = supportedTokens.find(
          (t) => t.address === contract.address
        ) as SupportedToken;
        return {
          address: contract.address,
          symbol: token.symbol,
          balance: balanceNumber,
          price: token.price,
          totalValue: balanceNumber * token.price,
          image: "./token-logo.png",
        };
      })
    );

    if (setBalances) {
      setBalances(balances);
    }
    return balances;
  } catch (error) {
    console.error(`Error fetching supported token balances`);
    return [];
  }
};

// Fetches supported tokens and balances
export const fetchSupportedTokensAndBalances = async (
  chainId: number
): Promise<{ supportedTokens: SupportedToken[]; balances: TokenBalance[] }> => {
  const supportedTokens = await fetchSupportedTokens(chainId);
  const balances = await fetchSupportedTokenBalances(supportedTokens);
  return { supportedTokens, balances };
};