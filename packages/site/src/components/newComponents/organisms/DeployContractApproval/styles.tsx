import styled from "styled-components";
import { Spacing } from "../../globalStyles";
import { devices } from "../../constants";


export const InfoContainer = styled.div`
  border-radius: 8px;
  @media only screen and ${devices.lg} {
  }
`;

export const TableContainer = styled.div`
  margin: ${Spacing.reviewTableMargin};
  @media only screen and ${devices.lg} {
    margin: 0;
  }
`;

export const ButtonContainer = styled.div`
  margin: ${Spacing.reviewTableMargin};
  @media only screen and ${devices.lg} {
  }
`;
