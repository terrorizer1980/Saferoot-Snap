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
  border: solid 1px ${Color.borderColor};
  width: 100%;
  border-radius: 8px;
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

