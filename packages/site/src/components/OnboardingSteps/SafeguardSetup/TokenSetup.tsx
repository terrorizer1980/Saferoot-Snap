import React, { useEffect } from "react";
import {
  Safeguard,
  Header,
  TokenSafeguardList,
} from "./index";
import { SelectedAssetForSetup } from "../../OnboardingSteps/SafeguardSelectionPage";
import { useData } from "../../../hooks/DataContext";
import { ActionType } from "../../../hooks/actions";
import { ASSET_TYPE, HttpStatusCode } from "../../../constants";
import { ethers } from "ethers";
import { default as SaferootABI } from "../../../blockchain/abi/SaferootABI.json";
import { useNetwork } from "wagmi";
import { ethtoWeiString } from "../../../blockchain/helpers/ethtoWeiString";
import { callAPIProps } from "../../Management/ModifySafeguard";

interface TokenSetupProps {
  setShowSetupPage: (show: boolean) => void;
  currentAsset: SelectedAssetForSetup;
  tokenSafeguards: Safeguard[];
  setTokenSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
}

// This is the component that allows a user to setup a single token's safeguards
export const TokenSetup: React.FC<TokenSetupProps> = ({
  setShowSetupPage,
  currentAsset,
  tokenSafeguards,
  setTokenSafeguards }) => {
  const [showOrderingPage, setShowOrderingPage] = React.useState(false);

  const inValidConfigurations = tokenSafeguards.filter((safeguard) =>
    safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isValid);
  const enabledConfigurations = tokenSafeguards.filter((safeguard) =>
    safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled);

  const handleSetShowOrderingPage = (showOrderingPage) => {
    const validConfigurations = inValidConfigurations.length === enabledConfigurations.length && enabledConfigurations.length > 0;
    setShowOrderingPage(validConfigurations && !showOrderingPage);
    setShowSetupPage(validConfigurations && showOrderingPage);
  };

  const { state, dispatch } = useData();
  const { assetToEdit } = state;
  const assetToEditRef = React.useRef(null);
  const apiCallAllowed = React.useRef(false);


  useEffect(() => {
    assetToEditRef.current = assetToEdit ? { ...assetToEdit } : null;
  }, [assetToEdit]);

  function encodeKey(tokenType, id) {
    if (tokenType === undefined || id === undefined) {
      throw new Error('TokenType or ID is undefined');
    }
    tokenType = Number(tokenType);
    id = Number(id);
    if (isNaN(tokenType) || isNaN(id)) {
      throw new Error('TokenType or ID is not a number');
    }
    const tokenTypeBits = BigInt(tokenType) << BigInt(248);
    const idBits = BigInt(id);
    const key = tokenTypeBits | idBits;
    return '0x' + key.toString(16).padStart(64, '0');
  }

  const editSafeguard = async (hash, amount) => {
    dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Safeguard editing in progress" } })
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const deployedSaferootContract = new ethers.Contract(
        state.deployedSaferootAddress,
        SaferootABI,
        signer
      );
      const tx = await deployedSaferootContract.editSafeguard(
        [{
          key: hash,
          newAmount: amount,
          newTokenId: 0,
        }]
      );
      apiCallAllowed.current = true;
      await tx.wait()
    } catch (error) {
      console.log(error)
    }
  };

  const updateSafeguardForToken = () => {
    const assetTo: Safeguard = tokenSafeguards.find((safeguard) => safeguard.asset === assetToEditRef.current.address && safeguard.id === assetToEditRef.current.id)
    editSafeguard(assetTo.hash, ethtoWeiString(assetTo.amount))
    setShowSetupPage(false);
  }

  const handleSafeguardEdit = () => {
    if (assetToEditRef.current) {
      updateSafeguardForToken();
    } else {
      setShowSetupPage(false);
    }
  }

  function decodeKey(encodedKey: string): [ASSET_TYPE, number] {
    const key = BigInt(encodedKey);
    const tokenType = Number((key >> BigInt(248)) & BigInt(0xff));
    const id = Number(key & BigInt("0x0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
    return [tokenType, id];
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const deployedSaferootContract = new ethers.Contract(
      state.deployedSaferootAddress,
      SaferootABI,
      signer
    );
    deployedSaferootContract.on("ERC20SafeguardEdited", (eventData) => {
      const [tokenType, id] = decodeKey(eventData);
      if ((tokenType !== ASSET_TYPE.TOKEN) || (assetToEditRef.current === null)) {
        return;
      }
      const assetTo: Safeguard = tokenSafeguards.find((safeguard) => safeguard.asset === assetToEditRef.current.address && safeguard.id === assetToEditRef.current.id)
      if (apiCallAllowed.current) {
        editSafeguardAPI(eventData, ethtoWeiString(assetTo.amount));
      }
      apiCallAllowed.current = false
    });
  }, [])

  const editSafeguardAPI = async (safeGuardId, value) => {
    try {
      const result = await fetch(
        `http://localhost:5433/v0/safeguard/${safeGuardId.toString()}/ERC20`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractAddress: assetToEdit.address.toString(),
            value_limit: value,
          }),
          credentials: "include",
        }
      );

      if (result.status === HttpStatusCode.Unauthorized) {
        dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Unauthorized to process - please log in again." } })
        return;
      }

      if (result.status === HttpStatusCode.TooManyRequests) {
        dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Too many requests - please try again later." } })
        return;
      }

      if (result.status === HttpStatusCode.OK) {
        dispatch({ type: ActionType.SET_LOADER, payload: { open: false, message: "" } })
        dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: null })
        return;
      } else {
        dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Could not edit safeguard, please try again." } })
      }
    } catch (error) {
      dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Something went wrong on our end, please try again later." } })
    }
  };

  return (
    <>
      <Header setShowSetupPage={() => setShowSetupPage(false)} currentAsset={currentAsset} />
      <TokenSafeguardList
        tokenSafeguards={tokenSafeguards}
        setTokenSafeguards={setTokenSafeguards}
        currentAsset={currentAsset}
        setShowSetupPage={handleSafeguardEdit}
      />
    </>
  );
};