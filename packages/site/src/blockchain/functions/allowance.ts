import { useWagmiRead } from "../helpers/useWagmiWrite";
import { default as TokenABI } from "../abi/ERC20TokensABI.json";
import { Address } from "wagmi";

export const allowance = (args: {
  userWalletAddress: Address;
  tokenAddress: Address;
  saferootAddress: Address;
}): ReturnType<typeof useWagmiRead> => {
  const hook = useWagmiRead(args.tokenAddress, TokenABI, "allowance", [
    args.userWalletAddress,
    args.saferootAddress,
  ]);

  return hook;
};
