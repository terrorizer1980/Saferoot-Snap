import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as SaferootABI } from "../abi/SaferootABI.json";
import { TokenType } from "../enums";
import { Address } from "wagmi";

export interface SafeguardEntry {
  tokenType: TokenType;
  contractAddress: Address;
  tokenId: number;
}

/**
 *
 * @param args : {
 * saferootAddress: string;
 * callData: SafeguardEntry[];
 * }
 * @returns
 */
export const addSafeguard = (args: {
  saferootAddress: Address;
  callData: SafeguardEntry[];
}): ReturnType<typeof useWagmiWrite> => {
  const hook = useWagmiWrite(
    args.saferootAddress,
    SaferootABI,
    "addSafeguard",
    [
      args.callData
    ]
  );
  return hook;
};
