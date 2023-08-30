import {
    SAFEROOT_FACTORY_ADDRESS,
    SAFEROOT_SERVICE_ADDRESS,
} from "../config/addresses";
import { useWagmiWrite } from "../helpers/useWagmiWrite";
import { default as SaferootFactoryABI } from "../abi/SaferootFactoryABI.json";
import { SafeguardEntry } from "./addSafeguard";

export interface createSaferootWithSafeguardsProps {
    backup: string;
    safeguardEntries: SafeguardEntry[];
}

export const createSaferootWithSafeguards = (args: createSaferootWithSafeguardsProps): ReturnType<typeof useWagmiWrite> => {
    const hook = useWagmiWrite(
        SAFEROOT_FACTORY_ADDRESS,
        SaferootFactoryABI,
        "createSaferootWithSafeguards",
        [
            SAFEROOT_SERVICE_ADDRESS,
            args.backup,
            args.safeguardEntries
        ]
    );
    return hook;
};