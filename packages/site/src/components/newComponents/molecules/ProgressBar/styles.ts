import styled from "styled-components";
import { Color, Dimensions, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const ProgressBarRoot = styled.div`
  padding: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
    width: 100%;
    margin: ${Spacing.GenericSpacerMargin10};
    display: block;
  }
`;

export const ProgressMainContainer = styled.div`
  background-color: ${Color.backgroundGrey};
  height: ${Dimensions.progressBarHeight};
  margin: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
    width: 100%;
    display: block;
  }
`;

export const ProgressActiveContainer = styled.div`
  height: ${Dimensions.progressBarHeight};
  background-color: ${Color.neonGreen};
  @media only screen and ${devices.lg} {
    width: 100%;
    margin: ${Spacing.GenericSpacerMargin10};
    display: block;
  }
`;
