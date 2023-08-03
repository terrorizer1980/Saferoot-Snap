import React, { useMemo } from 'react';
import {
  SAFEGUARD_TYPE,
  SafeguardContainer,
  SafeguardListContainer,
  Safeguard,
  SafeguardItem,
} from './index';
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import FixedNavigationBottomBar from '../../FixedNavigationBottomBar';
import { SimpleButton } from '../../SimpleButton';
interface NFTSafeguardListProps {
  nftSafeguards: Safeguard[];
  setNftSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
  currentAsset: SelectedAssetForSetup;
  setShowSetupPage: () => void;
}

// The list of all safeguards available for NFTs
export const NFTSafeguardList: React.FC<NFTSafeguardListProps> = (
  { nftSafeguards, setNftSafeguards, currentAsset, setShowSetupPage }
) => {
  const numberOfSafeguardsEnabled = useMemo(() => nftSafeguards.filter(safeguard => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled).length, [nftSafeguards, currentAsset]);

  const clearSelection = () => setNftSafeguards(nftSafeguards.map(safeguard => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id ? { ...safeguard, isEnabled: false } : safeguard));

  const autoEnable = (safeguard: Safeguard, checked: boolean) => {
    if (checked) {
      safeguard.isValid = true;
    } else {
      safeguard.isValid = false;
    }
  }

  const numberOfSafeguardsValidAndEnabled = useMemo(() => {
    return nftSafeguards.filter((safeguard) => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled && safeguard.isValid).length
  }, [nftSafeguards, currentAsset])

  return (
    <SafeguardContainer>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <b>Choose Safeguard Type (Security)</b>
        <Tooltip title="Configure the detection logic that will get triggered prompting your assets to be backed up">
          <HelpIcon />
        </Tooltip>
      </div>
      <SafeguardListContainer>
        <SafeguardItem title="Block Transfer"
          description="Blocks the transfer of this NFT"
          iconUrl="./time-logo.png"
          safeguards={nftSafeguards}
          setSafeguards={setNftSafeguards}
          currentAsset={currentAsset}
          safeguardType={SAFEGUARD_TYPE.LOCK_ERC_721}
          checkboxHandler={autoEnable}
        />
      </SafeguardListContainer>
      <FixedNavigationBottomBar message={`Currently enabled safeguards ${numberOfSafeguardsEnabled}`}>
        <SimpleButton type="default" onClick={clearSelection}>Remove</SimpleButton>
        <SimpleButton onClick={setShowSetupPage} type={numberOfSafeguardsValidAndEnabled > 0 ? "primary" : "secondary"} disabled={numberOfSafeguardsValidAndEnabled == 0}>Continue</SimpleButton>
      </FixedNavigationBottomBar>
    </SafeguardContainer >
  )
}
