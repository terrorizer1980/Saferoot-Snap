import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const ModalRoot = styled.div`
  padding: ${Spacing.modalPadding};
  background-color: ${Color.white};
  border-radius: 10px;
  height: 80vh;
  overflow-y: scroll;
  @media only screen and ${devices.lg} {
    width: 100%;
    padding: ${Spacing.modalMobilePadding};
    margin: ${Spacing.dashboardMobileMargin};
    display: block;
  }
`;

export const ModalHeading = styled.div`
  margin: ${Spacing.GenericSpacerMargin10};
`;

export const ModalSafeguardAssetInfo = styled.div`
  display: flex;
  justify-content: space-between;
  slign-items: center;
  flex-wrap: wrap;
  width: 60%;
  border-radius: 12px;
  background-color: ${Color.backgroundGrey};
  padding: ${Spacing.modalSafeguardAssetInfoPadding};
  margin: ${Spacing.GenericSpacerMargin20};
  @media only screen and ${devices.lg} {
    width: 80%;
    margin: 0;
  }
`;

export const ModalSafeguardCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 60vw;
  @media only screen and ${devices.lg} {
    width: 100%;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${Spacing.GenericSpacerMargin20};
`;

export const SelectionButtonContainer = styled.div`
  margin: ${Spacing.modalButtonMargin};
  display: flex;
  justify-content: center;
  align-items: center;
`;
