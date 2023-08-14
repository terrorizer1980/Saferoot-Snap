import styled from "styled-components";
import { Color, Dimensions, Spacing } from "../globalStyles";
import { devices } from "../constants";

export const AvatarIDContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const AvatarIDImage = styled.img`
  width: 40px;
  height: 40px;
`;

export const UserIDContainer = styled.div`
  display: flex;
  background-color: ${Color.white};
  border-radius: 20px;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${Spacing.userIDPadding};
  @media only screen and ${devices.sm} {
    max-width: 220px;
    overflow: hidden;
  }
`;

export const ButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-width: 1px;
  max-width: 100%;
  height: ${Dimensions.buttonHeight};
  border-color: ${Color.borderColor};
  padding: ${Spacing.buttonPadding};
`;

export const SelectionButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border-width: 1px;
  max-width: 100%;
  height: ${Dimensions.selectionButtonHeight};
  border-color: ${Color.borderColor};
  padding: ${Spacing.buttonPadding};
`;

export const ButtonImage = styled.img`
  width: 20px;
  height: 20px;
`;

export const CoinIDImage = styled.img`
  width: 20px;
  height: 20px;
`;

export const TagIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const TagContainer = styled.div`
  border-radius: 5px;
  padding: ${Spacing.tagContainerPadding};
  margin: ${Spacing.tagContainerMargin};
  width: fit-content;
  display: flex;
`;

export const SecurityInfoContainer = styled.div``;

export const WalletStatusContainer = styled.div`
  border-radius: 6px;
  padding: ${Spacing.WalletStatusPadding};
  display: flex;
  border: solid 1px #ccc;
  align-items: center;
`;

export const WalletStatusDot = styled.div`
  height: ${Dimensions.WalletStatusDot};
  width: ${Dimensions.WalletStatusDot};
  border-radius: 4px;
  margin-right: 4px;
`;

export const RoundedInputRoot = styled.div`
  border-radius: 25px;
  border: solid 1px ${Color.borderColor};
  padding: ${Spacing.roundedInputPadding};
  display: flex;
  justify-content: space-between;
`;

export const RoundedInputContainer = styled.input`
  padding: ${Spacing.roundedInputPadding};
  border-radius: 25px;
  border: none;
  outline: none;
`;

export const RoundedInputPasteButton = styled.div`
  padding: ${Spacing.roundedInputPadding};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: ${Spacing.GenericHorizontalSpacerMargin10};
`;

export const DropDownRoot = styled.div`
  border-radius: 8px;
`;
