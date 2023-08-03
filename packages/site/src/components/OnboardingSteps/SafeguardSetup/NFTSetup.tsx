import React from "react";
import {
  Header,
  NFTSafeguardList,
  Safeguard
} from "./index";
import { SelectedAssetForSetup } from "../../OnboardingSteps/SafeguardSelectionPage";

interface NFTSetupProps {
  setShowSetupPage: (show: boolean) => void;
  currentAsset: SelectedAssetForSetup;
  nftSafeguards: Safeguard[];
  setNFTSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
}

// This is the component that allows a user to setup a single NFT's safeguards
export const NFTSetup: React.FC<NFTSetupProps> = ({
  setShowSetupPage,
  currentAsset,
  nftSafeguards,
  setNFTSafeguards }) => {

  return (
    <>
      <Header setShowSetupPage={() => setShowSetupPage(false)} currentAsset={currentAsset} />
      <NFTSafeguardList
        nftSafeguards={nftSafeguards}
        setNftSafeguards={setNFTSafeguards}
        currentAsset={currentAsset}
        setShowSetupPage={() => setShowSetupPage(false)}
      />
    </>
  );
};