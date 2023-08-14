import styled from "styled-components";
import { Color, Dimensions, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const ReviewContainerRoot = styled.div`
  padding: ${Spacing.safeguardCardPadding};
  margin: ${Spacing.safeguardCardMargin};
  background-color: ${Color.backgroundGrey};
  border-radius: 15px;
  transition: height 0.5s;
  overflow: hidden;
  @media only screen and ${devices.lg} {
    margin: ${Spacing.GenericSpacerMargin10};
    display: block;
  }
`;

export const ReviewInfoContainer = styled.div`
  padding: ${Spacing.GenericSpacerMargin20};
  @media only screen and ${devices.lg} {
    width: 100%;
    display: block;
  }
`;

export const InfoOption = styled.div`
  padding: ${Spacing.GenericSpacerMargin10};
  display: flex;
  @media only screen and ${devices.lg} {
    width: 100%;
    display: block;
  }
`;

export const InfoOptionHeading = styled.div`
  width: ${Dimensions.reviewInfoHeading};
  @media only screen and ${devices.lg} {
  }
`;

export const InfoOptionValue = styled.div`
  @media only screen and ${devices.lg} {
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  @media only screen and ${devices.lg} {
  }
`;

export const UserContainer = styled.div`
  margin: ${Spacing.GenericSpacerMargin10};
  @media only screen and ${devices.lg} {
  }
`;
