import React, { useState } from "react";
import {
  ButtonImage,
  StepDescriptionRoot,
  StepInfoContainer,
  StepNumber,
} from "./styles";
import { Color, TextStyle } from "../../globalStyles";
import { Typography } from "../../atoms/Typography";
import { defaultIcon } from "../../constants";

// Styles for the step description component
export interface StepDescriptionProps {
  stepNumber?: number;
  heading?: string;
  headingSubText?: string;
  active?: boolean;
  completed?: boolean;
}

// Safeguard Item is the component that manages the individual configuration container, it allows expanding and collapsing its children
export const StepDescription = (props: StepDescriptionProps) => {
  const {
    stepNumber = 1,
    heading = "This is the new text",
    headingSubText = "This is the new text",
    active = false,
    completed = false,
  } = props;

  return (
    <StepDescriptionRoot>
      <StepNumber
        style={{
          backgroundColor: active
            ? (Color.black as string)
            : (Color.headingColor as string),
          opacity: active ? 1 : 0.7,
        }}
      >
        {completed ? (
          <ButtonImage src={'/completed.svg'}></ButtonImage>
        ) : (
          <Typography {...TextStyle.whiteSmallLabel}>{stepNumber}</Typography>
        )}
      </StepNumber>
      <StepInfoContainer>
        <Typography
          {...TextStyle.blackLargeLabel}
          color={
            active ? (Color.black as string) : (Color.headingColor as string)
          }
        >
          {heading}
        </Typography>
        {/* {active && ( */}
          <Typography
            {...TextStyle.headingColorMediumLabel}
            {...TextStyle.opacity}
          >
            {headingSubText}
          </Typography>
        {/* )} */}
      </StepInfoContainer>
    </StepDescriptionRoot>
  );
};
