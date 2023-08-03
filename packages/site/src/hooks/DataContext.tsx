import { SelectedAssetForSetup } from '../components/OnboardingSteps';
import React, { useEffect, createContext, useContext, useReducer } from "react";
import { LoaderState, Page } from "./actions";
import {
  NFTData,
  SupportedToken,
  TokenBalance,
  SelectedNFTToken,
} from "../components/OnboardingSteps/Tables/gridhelper";
import { Action, ActionType } from "./actions";
import { Step } from "../components/Navigation";
import { Safeguard } from "../components/OnboardingSteps/SafeguardSetup/";
import { Snap } from "../types";
import { isFlask, getSnap } from "../utils";

interface DataState {
  backupWallet: string;
  userWallet: string;
  deployedSaferootAddress: string;
  saferootSupportedTokens: SupportedToken[];
  userTokenBalances: TokenBalance[];
  selectedTokens: string[];
  tokenSafeguards: Safeguard[];
  userNFTs: NFTData[];
  selectedNFTs: SelectedNFTToken[]; // Id of the NFT from opensea
  nftSafeguards: Safeguard[];
  selectedTab: Page;
  steps: Step[];
  approvedCounter: number;
  assetToEdit: SelectedAssetForSetup;
  assetToModify: SelectedAssetForSetup;
  assetToAdd: boolean
  loader: LoaderState;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
}

const initialState: DataState = {
  backupWallet: "",
  userWallet: "",
  deployedSaferootAddress: "",
  saferootSupportedTokens: [],
  userTokenBalances: [],
  selectedTokens: [],
  tokenSafeguards: [],
  userNFTs: [],
  selectedNFTs: [],
  nftSafeguards: [],
  selectedTab: Page.Connect,
  steps: [
    { step: 1, pageType: Page.Connect, disabled: true, completed: false },
    { step: 2, pageType: Page.UserWallet, disabled: true, completed: false },
    { step: 3, pageType: Page.Tokens, disabled: true, completed: false },
    { step: 4, pageType: Page.Safeguards, disabled: true, completed: false },
    { step: 5, pageType: Page.BackupWallet, disabled: true, completed: false },
    {
      step: 6,
      pageType: Page.DeployContract,
      disabled: true,
      completed: false,
    },
    { step: 7, pageType: Page.Review, disabled: true, completed: false },
  ],
  approvedCounter: 0,
  assetToEdit: null,
  assetToModify: null,
  isFlask: false,
  error: undefined,
  loader: { open: false, message: "" },
  assetToAdd: false,
};

// Define the reducer function
const reducer = (state: DataState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_BACKUP_WALLET:
      return { ...state, backupWallet: action.payload };
    case ActionType.SET_USER_WALLET:
      return { ...state, userWallet: action.payload };
    case ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS:
      return { ...state, deployedSaferootAddress: action.payload };
    case ActionType.SET_SUPPORTED_TOKENS:
      return { ...state, saferootSupportedTokens: action.payload };
    case ActionType.SET_USER_TOKEN_BALANCES:
      return { ...state, userTokenBalances: action.payload };
    case ActionType.SET_SELECTED_TOKENS:
      return { ...state, selectedTokens: action.payload };
    case ActionType.SET_USER_NFTS:
      return { ...state, userNFTs: action.payload };
    case ActionType.SET_SELECTED_NFTS:
      return { ...state, selectedNFTs: action.payload };
    case ActionType.SET_SELECTED_TAB:
      return { ...state, selectedTab: action.payload };
    case ActionType.SET_TOKEN_SAFEGUARDS:
      return { ...state, tokenSafeguards: action.payload };
    case ActionType.SET_NFT_SAFEGUARDS:
      return { ...state, nftSafeguards: action.payload };
    case ActionType.SET_STEP_STATUS: // Add this
      return { ...state, steps: action.payload };
    case ActionType.SET_APPROVED_COUNTER:
      return { ...state, approvedCounter: action.payload };
    case ActionType.ADD_USER_NFT:
      return addUserNFT(state, action);
    case ActionType.SET_ASSET_TO_EDIT:
      return { ...state, assetToEdit: action.payload };
    case ActionType.SET_ASSET_TO_MODIFY:
      return { ...state, assetToModify: action.payload };
    case ActionType.SET_ASSET_TO_ADD:
      return { ...state, assetToAdd: action.payload };
    case ActionType.SET_LOADER:
      return { ...state, loader: action.payload }
    case ActionType.SET_SNAPS_INSTALLED:
      return {
        ...state,
        installedSnap: action.payload,
      };
    case ActionType.SET_MM_FLASK_DETECTED:
      return {
        ...state,
        isFlask: action.payload,
      };
    case ActionType.SET_MM_FLASK_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type` + action["type"]);
  }
};

// Add a new user NFT to the state if it doesn't already exist
function addUserNFT(state: DataState, action: Action) {
  if (action.type !== ActionType.ADD_USER_NFT) throw new Error(`Unhandled action type` + action["type"]);
  const nft = action.payload as NFTData;
  const nftAssetContract = nft.assetContract.address;
  const nftTokenId = nft.tokenId;
  // We are converting the tokenId to string is because it comes from the server as a string
  const nftIndex = state.userNFTs.findIndex((nft) => nft.assetContract.address.toLowerCase() === nftAssetContract.toLowerCase() && nft.tokenId.toString() === nftTokenId.toString());
  if (nftIndex === -1) {
    return { ...state, userNFTs: [...state.userNFTs, nft] };
  } else {
    return state;
  }
}

// Create a new context object
export const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  if (typeof window === "undefined") {
    return (
      <DataContext.Provider value={{ state, dispatch }}>
        {children}
      </DataContext.Provider>
    );
  }

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await isFlask();

      dispatch({
        type: ActionType.SET_MM_FLASK_DETECTED,
        payload: isFlaskDetected,
      });
    }

    async function detectSnapInstalled() {
      const installedSnap = await getSnap();
      dispatch({
        type: ActionType.SET_SNAPS_INSTALLED,
        payload: installedSnap,
      });
    }

    detectFlask();

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask, window.ethereum]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: ActionType.SET_MM_FLASK_ERROR,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);
  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Define a hook to access the data context
export const useData = () => useContext(DataContext);
