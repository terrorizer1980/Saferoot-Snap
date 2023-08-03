import {
  GOERLI_FACTORY_ADDRESS,
  GOERLI_SERVICE_ADDRESS,
} from "../config/addresses";
import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as SaferootFactoryABI } from "../abi/SaferootFactoryABI.json";

export const createSaferoot = (args: { backup: string }) => {
  const hook = useWagmiWrite(
    GOERLI_FACTORY_ADDRESS,
    SaferootFactoryABI,
    "createSaferoot",
    [
      GOERLI_SERVICE_ADDRESS,
      args.backup,
      "0x0000000000000000000000000000000000000000",
      false,
    ]
  );
  return hook;
};
