import {
  SAFEROOT_FACTORY_ADDRESS,
  SAFEROOT_SERVICE_ADDRESS,
} from "../config/addresses";
import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as SaferootFactoryABI } from "../abi/SaferootFactoryABI.json";

export const createSaferoot = (args: { backup: string }): ReturnType<typeof useWagmiWrite> => {
  const hook = useWagmiWrite(
    SAFEROOT_FACTORY_ADDRESS,
    SaferootFactoryABI,
    "createSaferoot",
    [
      SAFEROOT_SERVICE_ADDRESS,
      args.backup,
      "0x0000000000000000000000000000000000000000",
      false,
    ]
  );
  return hook;
};
