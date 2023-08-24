import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const StepDescriptionRoot = styled.div`
  padding: ${Spacing.GenericSpacerMargin10};
  border-radius: 15px;
  display: flex;
  @media only screen and ${devices.lg} {
  }
`;

export const StepNumber = styled.div`
  margin: ${Spacing.stepNumberMargin};
  background-color: ${Color.black};
  border-radius: 15px;
  height: 20px;
  min-width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StepInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  @media only screen and ${devices.lg} {
  }
`;

export const ButtonImage = styled.img`
  width: 20px;
  height: 20px;
`;
