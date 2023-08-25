import {
  usePrepareContractWrite,
  useContractWrite,
  Address,
  useContractRead,
} from "wagmi";
import { AbiItem } from "web3-utils";

export const findFunctionAbi = (abi, functionName) => {
  return abi.filter(
    (item) => item.name === functionName && item.type === "function"
  );
};

/**
 * useWagmiWrite A custom hook that returns a function that can be used to write to the blockchain
 * @param address - contract address
 * @param abi - contract abi
 * @param functionName - function name from contract
 * @param args - function arguments
 */
export const useWagmiWrite = (
  address: Address,
  abi: AbiItem,
  functionName: string,
  args: any[]
) => {
  const { config } = usePrepareContractWrite({
    address: address,
    abi: findFunctionAbi(abi, functionName),
    functionName: functionName,
    args: args,
  });
  const writeContract = useContractWrite(config);
  return writeContract;
};
/**
 * useWagmiWrite A custom hook that returns a function that can be used to write to the blockchain
 * @param address - contract address
 * @param abi - contract abi
 * @param functionName - function name from contract
 * @param args - function arguments
 */
export const useWagmiRead = (
  address: Address,
  abi: AbiItem,
  functionName: string,
  args: any[]
) => {
  const readContract = useContractRead({
    address: address,
    abi: findFunctionAbi(abi, functionName),
    functionName: functionName,
    args: args,
  });
  return readContract;
};
