import { ethers } from "ethers";
import { APICalls, predefinedRequests } from "../../../hooks/API/helpers";
// Type of supported tokens from database record
export type SupportedToken = {
  address: string;
  name: string;
  symbol: string;
  chain_id: number;
  network_id: number;
  price: number;
  token_image_url?: string;
  last_updated: Date;
  imageUrl?: string;
};

// User's token balance object
export type TokenBalance = {
  address: string;
  symbol: string;
  balance: number;
  price: number;
  totalValue: number;
  image?: string;
};

export type SelectedNFTToken = {
  address: string;
  tokenId: number;
};

// User's NFT object
export type NFTData = {
  name: string;
  id: number;
  imageUrl: string;
  tokenId: number;
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
};

export type DashboardView = {
  symbol: string;
  address: string;
  price: number;
  balance: number;
  value: number;
  valueProtected: number;
  safeguards: any;
  status: string;
  image: string;
};

let provider;
if (typeof window !== 'undefined' && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  // Handle case where MetaMask is not installed
  console.error("Please install MetaMask or another Ethereum wallet extension");
}

// Fetches supported tokens from the API
export const fetchSupportedTokens = async (
  chainId: number,
  setSupportedTokens?: React.Dispatch<React.SetStateAction<SupportedToken[]>>
): Promise<SupportedToken[]> => {
  try {
    const { data } = await predefinedRequests(APICalls.GET_SUPPORTED_TOKENS, { chainId })
    if (setSupportedTokens) setSupportedTokens(data);
    return data;
  } catch (error) {
    console.error(`Error fetching supported tokens: ${error}`);
    return [];
  }
};

// Fetches supported tokens from through RPC calls to get balances of supported tokens
export const fetchSupportedTokenBalances = async (
  supportedTokens: SupportedToken[],
  setBalances?: React.Dispatch<React.SetStateAction<TokenBalance[]>>
): Promise<TokenBalance[]> => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

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
        const token = supportedTokens.find(
          (t) => t.address === contract.address
        );
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

// fetches all available token safeguards for a wallet address
export const fetchTokenSafeguards = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/v0/getSafeguards`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch token safeguards`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching setup safeguards: ${error}`);
    return [];
  }
};
