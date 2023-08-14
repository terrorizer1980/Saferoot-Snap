import styled from "styled-components";
import { Color, Dimensions, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const SafeguardCardRoot = styled.div`
  padding: ${Spacing.safeguardCardPadding};
  margin: ${Spacing.safeguardCardMargin};
  background-color: ${Color.backgroundGrey};
  border-radius: 15px;
  transition: height 0.5s;
  overflow: hidden;
  width: ${Dimensions.safeguardCardWidth};
  @media only screen and ${devices.lg} {
    width: 100%;
    margin: ${Spacing.GenericSpacerMargin10};
    display: block;
  }
`;

export const SafeguardItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`;

export const SafeguardItemImage = styled.div`
  display: flex;
  flexdirection: row;
  width: 100%;
  justifycontent: space-between;
  margin: ${Spacing.safeguardCardSpacerMargin}
`;

export const SafeguardItemValue = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const SafeguardCardOtherOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: ${Spacing.safeguardCardOptionsMargin};
`;

export const SafeguardCardButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  height: 100px;
  margin: ${Spacing.safeguardCardSpacerMargin};
`;

export const SafeguardCardCustomText = styled.div`
  margin: ${Spacing.safeguardCardSpacerMargin};
`;
