import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SelectedAssetForSetup } from "../../SafeguardSelectionPage";
import { RoundedInput } from "../../../../styling/styles";
import { Safeguard, SAFEGUARD_TYPE } from "../index";
import { RoundedGrayContainers } from "../../styles";
import { SimpleButton } from "../../../SimpleButton";


// Safeguard configuration component
const SingleSafeguardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

const SelectionButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  `;

// Interface to allow for showing selected amount
interface SelectionButtonProps {
  selected: boolean;
}

const SelectionButtons = styled.button<SelectionButtonProps>`
    background-color: ${({ selected }) => (selected ? "#27FB6B" : "black")};
    flex-grow: 1;
    height:50px;
    border-radius: 15px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    `;

const CustomAmount = styled(SelectionButtons)`
    width: 100%;
    `;

export interface TokenSafeguardListProps {
  tokenSafeguards: Safeguard[];
  setTokenSafeguards: React.Dispatch<React.SetStateAction<Safeguard[]>>;
  currentAsset: SelectedAssetForSetup;
  noEdit?: boolean;
}

export interface ValueSafeguard extends Safeguard {
  amount: number;
}

// The dollar Value Safeguard is a safeguard that will trigger if the value of the asset goes above a certain amount
export const TokenAmountSafeguard: React.FC<TokenSafeguardListProps> = (
  {
    tokenSafeguards,
    setTokenSafeguards,
    currentAsset,
    noEdit = false
  }
) => {

  // Fetches the settings from tokenSafeguards
  const settings = tokenSafeguards.filter((safeguard) =>
    safeguard.type === SAFEGUARD_TYPE.THRESHOLD && safeguard.asset === currentAsset.address);

  // Add the safeguard to the list if it doesn't exist
  useEffect(() => {
    if (settings.length === 0) {
      const newValueSafeguard: ValueSafeguard = { type: SAFEGUARD_TYPE.THRESHOLD, asset: currentAsset.address, amount: 0, isEnabled: false, isValid: false, id: currentAsset.id };
      setTokenSafeguards([...tokenSafeguards, newValueSafeguard]);
    }
  }, [settings.length])

  // Return if the settings array did not populate yet
  if (settings.length === 0) {
    return null;
  }
  // Get the settings for this safeguard
  const safeguardSettings = settings[0] as ValueSafeguard;
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState('0');
  const handleCustomAmountClick = () => {
    setShowCustomInput(true);
  };

  const showSafeguardOnOpen = () => {
    if (!showCustomInput && safeguardSettings.amount && ![10, 50, 100].includes(safeguardSettings.amount)) {
      setShowCustomInput(true);
      setCustomAmountInput(safeguardSettings.amount.toString());
    }
  };

  showSafeguardOnOpen();

  // Value change handlers
  const handleDollarValueChange = (value: number) => {
    const newTokenSafeguards = [...tokenSafeguards];
    const index = newTokenSafeguards.findIndex((safeguard) => safeguard.type === SAFEGUARD_TYPE.THRESHOLD && safeguard.asset === currentAsset.address);
    (newTokenSafeguards[index] as ValueSafeguard).amount = value;
    if (value > 0) {
      (newTokenSafeguards[index] as ValueSafeguard).isValid = true;
    } else {
      (newTokenSafeguards[index] as ValueSafeguard).isValid = false;
    }
    setTokenSafeguards(newTokenSafeguards);
  };

  const handleFixedAmountClicked = (value: number) => {
    setShowCustomInput(false);
    handleDollarValueChange(value);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmountInput(event.target.value);
  };

  const handleCustomAmountOkClick = () => {
    // Set the custom amount value only when the OK button is clicked
    try {
      Number(customAmountInput);
      handleDollarValueChange(Number(customAmountInput));
    } catch (e) {
      handleDollarValueChange(0);
      return;
    }
  };

  return (
    <SingleSafeguardContainer>
      <p style={{ padding: "0 10px" }}>
        {noEdit ? "Token Amount" : "Choose amongst the following amounts:"}
      </p>
      {noEdit && (
        <RoundedGrayContainers>
          {safeguardSettings.amount}
        </RoundedGrayContainers>
      )}

      {!noEdit &&
        <SelectionButtonContainer>
          <SelectionButtons onClick={() => handleFixedAmountClicked(10)} selected={!showCustomInput && safeguardSettings.amount === 10}>
            10 {currentAsset.symbol}
          </SelectionButtons>
          <SelectionButtons onClick={() => handleFixedAmountClicked(50)} selected={!showCustomInput && safeguardSettings.amount === 50}>
            50 {currentAsset.symbol}
          </SelectionButtons>
          <SelectionButtons onClick={() => handleFixedAmountClicked(100)} selected={!showCustomInput && safeguardSettings.amount === 100}>
            100 {currentAsset.symbol}
          </SelectionButtons>
          <CustomAmount onClick={handleCustomAmountClick} selected={showCustomInput}>
            OR CUSTOM
          </CustomAmount>
          {showCustomInput && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <RoundedInput type="text" pattern="^\d+(\.\d{1,2})?$" onChange={handleCustomAmountChange} value={customAmountInput} />
                <SimpleButton type="secondary" onClick={handleCustomAmountOkClick}>OK</SimpleButton>
              </div>
            </>
          )}
        </SelectionButtonContainer>
      }
    </SingleSafeguardContainer>
  )
};