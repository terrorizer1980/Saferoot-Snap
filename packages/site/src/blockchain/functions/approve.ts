import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as TokenABI } from "../abi/ERC20TokensABI.json";
import { Address } from "wagmi";

export const approve = (args: {
  tokenAddress: Address;
  saferootAddress: Address;
  amount: string;
}) => {
  const hook = useWagmiWrite(args.tokenAddress, TokenABI, "approve", [
    args.saferootAddress,
    args.amount,
  ]);

  return hook;
};
