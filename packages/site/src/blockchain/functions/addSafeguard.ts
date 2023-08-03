import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as SaferootABI } from "../abi/SaferootABI.json";
import { TransferType, TokenType } from "../enums";
import { Address } from "wagmi";
import { Safeguard } from "../../components/OnboardingSteps/SafeguardSetup";
import { BigNumber } from "ethers";

export interface SafeguardEntry {
  tokenType: TokenType;
  contractAddress: Address;
  amount: BigNumber;
  tokenId: BigNumber;
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
}) => {
  const hook = useWagmiWrite(
    args.saferootAddress,
    SaferootABI,
    "addSafeguard",
    args.callData
  );
  return hook;
};
