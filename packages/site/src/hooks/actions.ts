// actions.ts
import { Safeguard } from "../components/OnboardingSteps/SafeguardSetup/common";
import {
  NFTData,
  SelectedNFTToken,
  SupportedToken,
  TokenBalance,
} from "../components/OnboardingSteps/Tables/gridhelper";
import { Step } from "../components";
import { SelectedAssetForSetup } from "../components/OnboardingSteps";
import { Snap } from "../types";

export interface LoaderState {  
  open: boolean;
  message: string;
}

export enum Page {
  Connect,
  UserWallet,
  BackupWallet,
  Tokens,
  Safeguards,
  Review,
  Success,
  DeployContract,
}

export enum ActionType {
  SET_BACKUP_WALLET = "SET_BACKUP_WALLET",
  SET_USER_WALLET = "SET_USER_WALLET",
  SET_DEPLOYED_SAFEROOT_ADDRESS = "SET_DEPLOYED_SAFEROOT_ADDRESS",
  SET_SUPPORTED_TOKENS = "SET_SUPPORTED_TOKENS",
  SET_USER_TOKEN_BALANCES = "SET_USER_TOKEN_BALANCES",
  SET_SELECTED_TOKENS = "SET_SELECTED_TOKENS",
  SET_TOKEN_SAFEGUARDS = "SET_TOKEN_SAFEGUARDS",
  SET_USER_NFTS = "SET_USER_NFTS",
  SET_SELECTED_NFTS = "SET_SELECTED_NFTS",
  SET_NFT_SAFEGUARDS = "SET_NFT_SAFEGUARDS",
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_STEP_STATUS = "SET_STEP_STATUS",
  SET_APPROVED_COUNTER = "SET_APPROVED_COUNTER",
  ADD_USER_NFT = "ADD_USER_NFT",
  SET_ASSET_TO_EDIT = "SET_ASSET_TO_EDIT",
  SET_ASSET_TO_MODIFY = "SET_ASSET_TO_MODIFY",
  SET_ASSET_TO_ADD = "SET_ASSET_TO_ADD",
  SET_ASSET_TO_APPROVE = "SET_ASSET_TO_APPROVE",
  SET_LOADER = "SET_LOADER",
  SET_SNAPS_INSTALLED = "SET_SNAPS_INSTALLED",
  SET_MM_FLASK_DETECTED = "SET_MM_FLASK_DETECTED",
  SET_MM_FLASK_ERROR = "SET_MM_FLASK_ERROR",
}

export type Action =
  | { type: ActionType.SET_BACKUP_WALLET; payload: string }
  | { type: ActionType.SET_USER_WALLET; payload: string }
  | { type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS; payload: string }
  | { type: ActionType.SET_SUPPORTED_TOKENS; payload: SupportedToken[] }
  | { type: ActionType.SET_USER_TOKEN_BALANCES; payload: TokenBalance[] }
  | { type: ActionType.SET_SELECTED_TOKENS; payload: string[] }
  | { type: ActionType.SET_USER_NFTS; payload: NFTData[] }
  | { type: ActionType.SET_SELECTED_NFTS; payload: SelectedNFTToken[] }
  | { type: ActionType.SET_SELECTED_TAB; payload: Page }
  | { type: ActionType.SET_TOKEN_SAFEGUARDS; payload: Safeguard[] }
  | { type: ActionType.SET_NFT_SAFEGUARDS; payload: Safeguard[] }
  | { type: ActionType.SET_STEP_STATUS; payload: Step[] }
  | { type: ActionType.SET_APPROVED_COUNTER; payload: number }
  | { type: ActionType.ADD_USER_NFT; payload: NFTData }
  | { type: ActionType.SET_ASSET_TO_EDIT; payload: SelectedAssetForSetup }
  | { type: ActionType.SET_ASSET_TO_MODIFY; payload: SelectedAssetForSetup }
  | { type: ActionType.SET_ASSET_TO_ADD; payload: boolean }
  | { type: ActionType.SET_ASSET_TO_APPROVE; payload: object[] | null }
  | { type: ActionType.SET_LOADER; payload: LoaderState }
  | { type: ActionType.SET_SNAPS_INSTALLED; payload: Snap }
  | { type: ActionType.SET_MM_FLASK_DETECTED; payload: boolean }
  | { type: ActionType.SET_MM_FLASK_ERROR; payload: Error };
