import { useWagmiRead } from "../helpers/useWagmiWrite";
import { default as NFTABI } from "../abi/ERC721NFTABI.json";
import { Address } from "wagmi";

/**
 * Allows you to interact with an erc 721 contract to get the token URI of a token
 * @param args
 * tokenAddress: the address of the contract you want to get the token URI of
 * tokenId: the id of the token you want to get the token URI of
 * @returns
 */
export const tokenURI = (args: { tokenAddress: Address; tokenId: string }) => {
  const hook = useWagmiRead(args.tokenAddress, NFTABI, "tokenURI", [
    args.tokenId,
  ]);

  return hook;
};
