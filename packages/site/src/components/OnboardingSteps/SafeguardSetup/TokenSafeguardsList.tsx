import React, { useMemo } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';

import {
  Safeguard,
  SafeguardItem,
  SafeguardContainer,
  SafeguardListContainer,
  SAFEGUARDS_MAPPING,
  SAFEGUARD_TYPE
} from './index';
import { TokenAmountSafeguard } from './Safeguards/ValueSafeguard';
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
import FixedNavigationBottomBar from '../../FixedNavigationBottomBar';
import { useData } from '../../../hooks/DataContext';
import { navigate } from 'gatsby';
import { ActionType } from '../../../hooks/actions';
import { NAVIGATION_PATHS } from '../../../constants';
import { SimpleButton } from '../../SimpleButton';

// Interface to allow for showing the safeguards for a token
interface TokenSafeguardListProps {
  tokenSafeguards: Safeguard[];
  setTokenSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
  currentAsset: SelectedAssetForSetup;
  setShowSetupPage: () => void;
}
// The list of all safeguards available for tokens
export const TokenSafeguardList: React.FC<TokenSafeguardListProps> = (
  { tokenSafeguards, setTokenSafeguards, currentAsset, setShowSetupPage }
) => {
  const numberOfSafeguardsEnabled = useMemo(() => {
    return tokenSafeguards.filter((safeguard) => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled).length
  }, [tokenSafeguards, currentAsset])

  const clearSelection = () => {
    setTokenSafeguards(tokenSafeguards.map((safeguard) => {
      if (safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id) {
        return {
          ...safeguard,
          isEnabled: false
        }
      }
      return safeguard
    }))
  }

  const { state, dispatch } = useData()
  const { assetToEdit } = state

  const numberOfSafeguardsValidAndEnabled = useMemo(() => {
    return tokenSafeguards.filter((safeguard) => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled && safeguard.isValid).length
  }, [tokenSafeguards, currentAsset])


  return (
    <SafeguardContainer>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <b>Choose Safeguard Type (Security)</b>
        <Tooltip title="Configure the detection logic that will get triggered prompting your assets to be backed up">
          <HelpIcon />
        </Tooltip>
      </div>
      <br />
      <SafeguardListContainer>
        <SafeguardItem title={SAFEGUARDS_MAPPING.value.title}
          description={SAFEGUARDS_MAPPING.value.description}
          iconUrl={SAFEGUARDS_MAPPING.value.iconUrl}
          safeguards={tokenSafeguards}
          setSafeguards={setTokenSafeguards}
          currentAsset={currentAsset}
          safeguardType={SAFEGUARD_TYPE.THRESHOLD} >
          <TokenAmountSafeguard
            tokenSafeguards={tokenSafeguards}
            setTokenSafeguards={setTokenSafeguards}
            currentAsset={currentAsset}
          />
        </SafeguardItem>
      </SafeguardListContainer>
      <FixedNavigationBottomBar message={`Currently enabled safeguards ${numberOfSafeguardsEnabled}`}>
        <SimpleButton type="default" onClick={clearSelection}>Remove</SimpleButton>
        <SimpleButton type={numberOfSafeguardsValidAndEnabled > 0 ? "primary" : "secondary"} onClick={setShowSetupPage} disabled={numberOfSafeguardsValidAndEnabled == 0}>
          {assetToEdit === null ? "Continue" : "Update"}
        </SimpleButton>
      </FixedNavigationBottomBar>
    </SafeguardContainer >
  )
}