import styled from "styled-components";
import { Heading } from "../../../styling/styles";
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
import { ASSET_TYPE } from "../../../constants";
import { useData } from "../../../hooks/DataContext";
// Styles for the header component
const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: space-between;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  `;

const HeaderTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;

const HeaderLightGrayFont = styled.span`
    color: #8e8e8e;
  `;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 5.33333px;
  width: 180px;
  height: 24px;
  padding: 0 10px;
  border: none;
  cursor: pointer;
`;

const CaretIcon = styled.span`
  width: 20px;
  height: 20px;
  color: black;
  border-radius: 2px;
  background-color: #F2F2F2;
  margin-right: 5px;
`;

const Text = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #000000;
`;

// Usage
const ButtonWithCaret = ({ onClick }) => (
  <BackButton onClick={onClick}>
    <CaretIcon >{'<'}</CaretIcon>
    <Text>Go back to all assets</Text>
  </BackButton>
);

interface HeaderProps {
  setShowSetupPage: (show: boolean) => void;
  currentAsset: SelectedAssetForSetup;
}

export const Header: React.FC<HeaderProps> = ({ setShowSetupPage, currentAsset }) => {
  const HeadingMessage = currentAsset.assetType === ASSET_TYPE.TOKEN
    ? `${currentAsset.symbol}`
    : `${currentAsset.symbol ? `${currentAsset.symbol} #${currentAsset.id}` : `${currentAsset.address} #${currentAsset.id}`}`;

  const { state } = useData()
  const { assetToEdit } = state

  return (
    <HeaderContainer>
      <HeaderTitleContainer>
        <Heading>{assetToEdit === null ? "Add Safeguard" : "Edit Safeguard"} for {HeadingMessage}</Heading>
      </HeaderTitleContainer>
    </HeaderContainer>
  )
}