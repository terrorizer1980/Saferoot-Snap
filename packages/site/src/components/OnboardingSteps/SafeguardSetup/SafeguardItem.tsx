import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Checkbox } from "@mui/material";
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
import { SAFEGUARD_TYPE } from "./constants";
import { TokenSafeguardListProps } from "./Safeguards/ValueSafeguard";
// Styles for the safeguard list component
const SafeguardItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    `;

const SafeguardItemValue = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0px 10px;
  `;


export interface Safeguard {
  type: SAFEGUARD_TYPE;
  asset: string;
  id: number;
  isEnabled: boolean;
  isValid: boolean;

  // optional additions for enabling a state-independent
  // safeguard edit/delete flow
  // only used during dashboard flows
  hash?: string;
  amount?: number;
}

// Props for the safeguard list component
interface SafeguardItemProps {
  children?: React.ReactElement<TokenSafeguardListProps>;
  title: string;
  description: string;
  iconUrl: string;
  safeguards: Safeguard[];
  setSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
  currentAsset: SelectedAssetForSetup;
  safeguardType: SAFEGUARD_TYPE;
  checkboxHandler?: (safeguard: Safeguard, checked: boolean) => void;
}

// Safeguard Item is the component that manages the individual configuration container, it allows expanding and collapsing its children
export const SafeguardItem: React.FC<SafeguardItemProps> = ({
  title,
  description,
  iconUrl,
  children = null,
  safeguards,
  setSafeguards,
  currentAsset,
  safeguardType,
  checkboxHandler,
}) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const settings = safeguards.filter((safeguard) =>
    safeguard.type === safeguardType && safeguard.asset === currentAsset.address && safeguard.id === currentAsset.id);

  useEffect(() => {
    if (settings.length === 0) {
      setSafeguards([...safeguards, { type: safeguardType, asset: currentAsset.address, isEnabled: false, id: currentAsset.id, isValid: false }]);
    }
  }, [safeguards])

  const handleEnabledChange = (checked: boolean) => {
    safeguardSettings.isEnabled = checked;
    setSafeguards([...safeguards.filter(settings =>
      !(settings.asset === currentAsset.address && settings.type === safeguardType && settings.id === currentAsset.id)), safeguardSettings]);
    title !== "Block Transfer" && setIsExpanded(checked);
    if (checkboxHandler) {
      checkboxHandler(safeguardSettings, checked);
    }
  }

  useEffect(() => {
    if (settings.length === 0) {
      return;
    }
    const safeguardSettings = settings[0];
    title !== "Block Transfer" && setIsExpanded(safeguardSettings.isEnabled);
  }, [])

  if (settings.length === 0) {
    return null;
  }

  const safeguardSettings = settings[0];

  return (
    <div
      style={{
        height: isExpanded ? "500px" : "200px",
        width: "280px",
        border: safeguardSettings.isEnabled
          ? safeguardSettings.isValid
            ? "2px solid #27FB6B"
            : "2px solid red"
          : "2px solid #E0E0E0",
        backgroundColor: safeguardSettings.isEnabled ? "#FFFFFF" : "#F6F6F6",
        padding: "10px",
        overflow: "hidden",
        transition: "height 0.5s",
        borderRadius: "15px",
        margin: "5px"
      }}

    >
      <SafeguardItemInfo>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <img src={iconUrl} height={"70px"} style={{ "padding": "10px" }} />
          <div>
            <Checkbox checked={safeguardSettings.isEnabled} onChange={(_, checked) => handleEnabledChange(checked)} />
          </div>
        </div>
        <SafeguardItemValue>
          <b>{title}</b>
          <p>{description}</p>
        </SafeguardItemValue>
      </SafeguardItemInfo>
      {children}
    </div>
  );
};