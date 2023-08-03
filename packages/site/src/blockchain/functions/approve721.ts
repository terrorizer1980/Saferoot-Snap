import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as NFTABI } from "../abi/ERC721NFTABI.json";
import { Address } from "wagmi";

/**
 * Allows you to interact with an erc 721 contract to approve a user to transfer a token
 * @param args
 *  to: the address of the user you want to approve
 *  saferootAddress: the address of the contract you want to approve
 *  tokenId: the id of the token you want to approve
 * @returns
 */
export const approve721 = (args: {
  to: Address;
  saferootAddress: Address;
  tokenId: string;
}) => {
  const hook = useWagmiWrite(args.to, NFTABI, "approve", [
    args.saferootAddress,
    args.tokenId,
  ]);

  return hook;
};
