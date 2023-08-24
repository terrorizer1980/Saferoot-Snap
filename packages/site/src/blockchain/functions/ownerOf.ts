import { useWagmiRead } from "../helpers/useWagmiWrite";
import { default as NFTABI } from "../abi/ERC721NFTABI.json";
import { Address } from "wagmi";

/**
 * Allows you to interact with an erc 721 contract to get the owner of a token
 * @param args
 * tokenAddress: the address of the contract you want to get the owner of
 * tokenId: the id of the token you want to get the owner of
 * @returns a wagmi hook object
 */
export const ownerOf = (args: { tokenAddress: Address; tokenId: string }): ReturnType<typeof useWagmiRead> => {
  const hook = useWagmiRead(args.tokenAddress, NFTABI, "ownerOf", [
    args.tokenId,
  ]);

  return hook;
};
