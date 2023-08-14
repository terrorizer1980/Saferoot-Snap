import styled from "styled-components";
import { Color, Spacing } from "../globalStyles";
import { devices } from "../constants";

export const GenericRoot = styled.div`
  display: flex;
  margin: ${Spacing.dashboardMargin};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.dashboardMobileMargin};
    display: block;
  }
`;

export const GenericWalletCardContainer = styled.div`
  width: 40vw;
  margin: ${Spacing.dashboardCard1Margin};
  @media only screen and ${devices.lg} {
    width: 100%;
    margin: ${Spacing.dashboardCardMobileMargin};
  }
`;

export const GenericInfoContainer = styled.div`
  width: 100%;
  padding: ${Spacing.GenericDialoguePadding};
  border-radius: 8px;
  border: solid 1px ${Color.borderColor};
  background-color: ${Color.white};
  @media only screen and ${devices.lg} {
    width: fit-content;
  }
`;

export const GenericHorizontalSpacer = styled.div`
  margin: ${Spacing.GenericHorizontalSpacerMargin20};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.GenericHorizontalSpacerMargin10};
  }
`;

export const GenericInfoHeading = styled.div`
  margin: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
  }
`;

export const GenericInfoSubText = styled.div`
  width: 80%;
  margin: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
    width: 100%;
  }
`;
