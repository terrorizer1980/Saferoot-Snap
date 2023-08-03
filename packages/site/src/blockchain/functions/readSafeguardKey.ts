import { useContractRead } from "wagmi";
import { default as SaferootABI } from "../../blockchain/abi/SaferootABI.json";

export const readSafeguardKey = (args: { saferootAddress: string }) => {
  const hook = useContractRead({
    address: args.saferootAddress,
    abi: SaferootABI,
    functionName: "currentSafeguardKey",
  });
  return hook;
};
