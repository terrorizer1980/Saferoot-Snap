import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const DashboardRoot = styled.div`
  margin: ${Spacing.dashboardMargin};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.dashboardMobileMargin};
  }
`;
export const DashboardCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media only screen and ${devices.lg} {
    flex-direction: column;
    display: block;
  }
`;

export const DashboardTokensTableRoot = styled.div`
  width: 100%;
  border-radius: 8px;
  background-color: ${Color.white};
  margin: ${Spacing.GenericSpacerMargin20};
`;

export const DashboardNFTTableRoot = styled.div`
  width: 100%;
  border-radius: 8px;
  background-color: ${Color.white};
  margin: ${Spacing.GenericSpacerMargin20};
`;

export const DashboardTokensTableHeader = styled.div`
  margin: ${Spacing.dashboardTableHeader};
`;

export const DashboardButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: ${Spacing.dashboardMargin};
  @media only screen and ${devices.lg} {
    justify-content: center;
    flex-direction: column;
  }
`;

export const DashboardTable = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${Spacing.dashboardMargin};
`;

export const DashboardCard1 = styled.div`
  flex: 1;
  margin: ${Spacing.dashboardCard1Margin};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.dashboardCardMobileMargin};
  }
`;

export const DashboardCard2 = styled.div`
  flex: 1;
  margin: ${Spacing.dashboardCard2Margin};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.dashboardCardMobileMargin};
  }
`;

export const DashboardCard3 = styled.div`
  flex: 1;
  margin: ${Spacing.dashboardCard3Margin};
  @media only screen and ${devices.lg} {
    margin: ${Spacing.dashboardCardMobileMargin};
  }
`;
