import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const BackupWalletAddress = styled.div`
  display: flex;
  margin: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
    flex-direction: column;
    margin: ${Spacing.GenericSpacerMargin20};
  }
`;

export const BackupWalletInput = styled.div`
  margin: ${Spacing.GenericHorizontalSpacerMargin20};
  width: 100%;
  @media only screen and ${devices.lg} {
    height: 60px;
  }
`;
