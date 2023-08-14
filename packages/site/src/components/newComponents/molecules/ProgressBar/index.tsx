import React from "react";
import {
  ProgressActiveContainer,
  ProgressBarRoot,
  ProgressMainContainer,
} from "./styles";
import { Typography } from "@mui/material";
import { TextStyle } from "../../globalStyles";

export interface ProgressBarProps {
  steps: number;
  activeStep: number;
}

// Progress Bar is the green color progress depicting bar with number of steps and  current step as inputs.
export const ProgressBar = (props: ProgressBarProps) => {
  const { steps, activeStep } = props;

  return (
    <ProgressBarRoot>
        <ProgressMainContainer>
          <ProgressActiveContainer
            style={{
              width: (100 / steps) * activeStep + "%",
            }}
          />
        </ProgressMainContainer>
      <Typography {...TextStyle.secondaryTextExtraSmallLabel} {...TextStyle.opacity}>{activeStep + "/" + steps + " tasks completed"}</Typography>
    </ProgressBarRoot>
  );
};
