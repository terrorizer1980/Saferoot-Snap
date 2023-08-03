import React from "react";
import styled from "styled-components";
import {
  Safeguard,
  SafeguardItem,
  SAFEGUARDS_MAPPING
} from "./index";
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
import FixedNavigationBottomBar from "../../FixedNavigationBottomBar";
import { TokenAmountSafeguard } from './Safeguards/ValueSafeguard';
import { useData } from "../../../hooks/DataContext";
import { ActionType } from "../../../hooks/actions";
import { navigate } from "gatsby";
import { NAVIGATION_PATHS } from "../../../constants";
import { SimpleButton } from "../../SimpleButton";

const SafeguardPriorityGrayContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    justify-content: flex-start;
    align-items: center;
    height: auto;
    background-color: #F5F5F5;
    padding: 10px;
    border-radius: 10px;
  `;

interface SafeguardPriorityItemProps {
  safeguards: Safeguard[];
  setSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
  currentAsset: SelectedAssetForSetup;
  setShowSetupPage: (show: boolean) => void;
  showOrderingPage: (boolean) => void;
}

export const SafeguardTokenPriority: React.FC<SafeguardPriorityItemProps> =
  ({ safeguards, setSafeguards, currentAsset, setShowSetupPage, showOrderingPage }) => {
    const settingsArray = safeguards.filter(safeguard => safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id && safeguard.isEnabled);
    const { state, dispatch } = useData();
    const { assetToEdit } = state;

    const handleSafeguardEdit = () => {
      if (assetToEdit) {
        updateSafeguardForToken();
      } else {
        setShowSetupPage(true);
      }
    }

    const updateSafeguardForToken = () => {
      // 
      // integrate API here
      // 
      // on success: setassetToEdit(null)
      // on failure: setassetToEdit(null)
      dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: null })
      navigate(NAVIGATION_PATHS.DASHBOARD)
    }

    return (
      <SafeguardPriorityGrayContainer>
        <b>Order your safeguards to ensure that your safeguards are prioritized based on the specific asset.</b>
        <br />
        {settingsArray.map((safeguard, index) => {
          return (
            <SafeguardItem title={SAFEGUARDS_MAPPING[safeguard.type].title}
              description={SAFEGUARDS_MAPPING[safeguard.type].description}
              iconUrl={SAFEGUARDS_MAPPING[safeguard.type].iconUrl}
              safeguards={safeguards}
              setSafeguards={setSafeguards}
              currentAsset={currentAsset}
              safeguardType={safeguard.type}
              key={safeguard.asset + index}
            >
              {safeguard.type === "value" && <TokenAmountSafeguard
                tokenSafeguards={safeguards}
                setTokenSafeguards={setSafeguards}
                currentAsset={currentAsset}
                noEdit={true}
              />}
            </SafeguardItem>
          )
        })
        }
        <FixedNavigationBottomBar>
          <SimpleButton type="default" onClick={() => showOrderingPage(false)}>Back</SimpleButton>
          <SimpleButton type="primary" onClick={() => handleSafeguardEdit()}>Complete Configuration</SimpleButton>
        </FixedNavigationBottomBar>
      </SafeguardPriorityGrayContainer>
    )
  }