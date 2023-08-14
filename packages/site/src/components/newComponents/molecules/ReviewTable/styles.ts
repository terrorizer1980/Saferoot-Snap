import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const TableStyles = styled.table`
  padding: ${Spacing.mobileViewRootPadding};
  border: solid 1px ${Color.borderColor};
  background-color: ${Color.white};
  margin: ${Spacing.mobileViewRootMargin};
`;

export const TableRootContainer = styled.table`
  padding: ${Spacing.mobileViewRootPadding};
  background-color: ${Color.white};
  border: solid 2px ${Color.headingColor};
  width: 100%;
  border-radius: 8px;
  @media only screen and ${devices.lg} {
    padding: 0;
    border: 0;
    margin: ${Spacing.GenericSpacerMargin20};
  }
`;

export const TableHeaderContainer = styled.table`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  @media only screen and ${devices.lg} {
    display: block;
  }
`;

export const TableFilterContainer = styled.table`
  display: flex;
  align-items: center;
  @media only screen and ${devices.lg} {
    padding: ${Spacing.GenericSpacerMargin20}
  }
`;

export const IDContainer = styled.table`
  width: max-content;
  padding: ${Spacing.GenericHorizontalSpacerMargin40}
`;

export const TokenIDContainer = styled.table`
  display: flex;
  padding: ${Spacing.GenericHorizontalSpacerMargin20}
`;

export const HeaderStyles = styled.div`
  padding: ${Spacing.mobileViewRootPadding};
  border: solid 1px ${Color.borderColor};
  background-color: ${Color.white};
  margin: ${Spacing.mobileViewRootMargin};
`;

// export const HeaderStyles = styled.div`
//   padding: ${Spacing.mobileViewRootPadding};
//   border: solid 1px ${Color.borderColor};
//   background-color: ${Color.white};
//   margin: ${Spacing.mobileViewRootMargin};
// `;

export const MobileViewRootContainer = styled.div`
  padding: ${Spacing.mobileViewRootPadding};
  border: solid 1px ${Color.borderColor};
  border-radius: 8px;
  background-color: ${Color.white};
`;

export const MobileViewMainContainer = styled.div`
  display: flex;
  padding: ${Spacing.mobileViewReviewPadding};
`;

export const MobileViewIcon = styled.img`
  width: 30px;
  height: 30px;
  padding: ${Spacing.mobileViewIconPadding}
`;

export const MobileViewLine = styled.div`
  // margin: ${Spacing.mobileViewLineMargin};
  height: 1px;
  width: 100%;
  opacity: 0.5;
  background-color: ${Color.borderColor};
`;

export const MobileViewSpreadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MobileViewTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const MobileViewButtonsContainer = styled.div`
  margin: ${Spacing.mobileViewLineMargin};
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  margin: ${Spacing.GenericSpacerMargin10};
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

