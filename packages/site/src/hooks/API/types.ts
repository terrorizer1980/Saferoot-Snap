import { SiweMessage } from "siwe";
import { Address } from "viem";

export enum APICalls {
    NONCE = "nonce",
    VERIFY = "verify",
    SIGN_OUT = "signOut",
    CREATE_DEPLOYED_CONTRACT = "createDeployedContract",
    GET_DEPLOYED_CONTRACT = "getDeployedContract",
    GET_SUPPORTED_TOKENS = "getSupportedTokens",
    GET_USER_NFTS = "getUserNFTs",
    GET_SAFEGUARDS = "getSafeguards",
    ADD_SAFEGUARD = "addSafeguard",
    EDIT_TOKEN_SAFEGUARD = "editTokenSafeguard",
    TOGGLE_TOKEN_SAFEGUARD = "toggleTokenSafeguard",
    TOGGLE_NFT_SAFEGUARD = "toggleNFTSafeguard",
}

export enum DURATIONS {
    ONE_MINUTE = 1000 * 60,
    ONE_HOUR = 1000 * 60 * 60,
    ONE_DAY = 1000 * 60 * 60 * 24,
}

interface NullParams { body: null; url: null }
interface BaseParams<TBody = null, TUrl = null> { body: TBody; url: TUrl }

export interface API_PARAMS {
    [APICalls.NONCE]: NullParams;
    [APICalls.VERIFY]: BaseParams<{ message: SiweMessage; signature: string; }, null>;
    [APICalls.SIGN_OUT]: NullParams;
    [APICalls.CREATE_DEPLOYED_CONTRACT]: BaseParams<{ chainId: number; networkId: number; contractAddress: Address; userWalletAddress: Address; }, null>;
    [APICalls.GET_DEPLOYED_CONTRACT]: NullParams;
    [APICalls.GET_SUPPORTED_TOKENS]: BaseParams<null, { chainId: number; }>;
    [APICalls.GET_USER_NFTS]: BaseParams<null, { userWallet: Address; }>;
    [APICalls.GET_SAFEGUARDS]: NullParams;
    [APICalls.ADD_SAFEGUARD]: BaseParams<{ safeGuardId: string; networkId: number; enabled: boolean; ceilingThresholds: object; }, null>;
    [APICalls.EDIT_TOKEN_SAFEGUARD]: BaseParams<{ contractAddress: Address; value_limit: string; }, { safeGuardId: string; }>;
    [APICalls.TOGGLE_TOKEN_SAFEGUARD]: BaseParams<{ enabled: boolean; }, { safeGuardId: string; }>;
    [APICalls.TOGGLE_NFT_SAFEGUARD]: BaseParams<{ enabled: boolean; }, { safeGuardId: string; }>;
}
