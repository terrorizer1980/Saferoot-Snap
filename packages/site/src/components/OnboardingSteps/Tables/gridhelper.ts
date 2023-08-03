import { ethers } from "ethers";
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

export const fetchNFTs = async (
  chainId: number,
  setNFTs?: React.Dispatch<React.SetStateAction<NFTData[]>>
): Promise<NFTData[]> => {
  try {
    const response = await fetch(
      `http://localhost:5433/ethereum/v0/${chainId}/userERC721Asset`,
      { credentials: "include" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs`);
    }

    const data = await response.json();

    const retrievedNFTDataObjects = await Promise.all(
      data.map(async (nft) => {
        const contract = new ethers.Contract(
          nft.contract_address,
          ["function tokenURI(uint256) view returns (string)"],
          provider
        );
        const tokenURI = await contract.tokenURI(nft.token_id);

        let metadata = {};
        if (tokenURI) {
          try {
            const res = await fetch(tokenURI);
            metadata = await res.json();
          } catch (e) {
            console.error(`Error fetching tokenURI: ${e}`);
          }
        }
        return {
          name: metadata?.name || "Unknown",
          id: metadata?.id || nft.token_id,
          imageUrl: metadata?.image || null,
          tokenId: nft.token_id,
          collection: {
            id: null,
            name: metadata?.collection || "Unknown",
          },
          assetContract: {
            address: nft.contract_address,
            chainIdentifier: nft.chain_id,
            schemaName: "",
            owner: "",
            assetContractType: "",
          },
          ethAmount: null,
          usdAmount: null,
        };
      })
    );

    if (setNFTs) setNFTs(retrievedNFTDataObjects);

    return retrievedNFTDataObjects;
  } catch (error) {
    console.error(`Error fetching NFTs: ${error}`);
    return [];
  }
};

// Fetches supported tokens from the API
export const fetchSupportedTokens = async (
  chainId: number,
  setSupportedTokens?: React.Dispatch<React.SetStateAction<SupportedToken[]>>
): Promise<SupportedToken[]> => {
  try {
    const response = await fetch(
      `http://localhost:5433/ethereum/v0/${chainId}/supported_token`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch supported tokens`);
    }
    const data = await response.json();
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
      `http://localhost:5433/v0/getSafeguards`,
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
