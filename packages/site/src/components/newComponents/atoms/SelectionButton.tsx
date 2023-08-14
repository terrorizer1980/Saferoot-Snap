import React, { useEffect, useState } from "react";
import { Typography } from "./Typography";
import { Color, Spacing, TextStyle } from "../globalStyles";
import { SelectionButtonContainer } from "./styles";

export type SelectionButtonProps = {
  onClick?: () => void;
  enabledText: string;
  disabledText: string;
  enabledTextColor?: string;
  disabledTextColor?: string;
  enabledBgColor?: string;
  disabledBgColor?: string;
  defaultState?: boolean;
  changeButtonStateTo?: boolean | null;
  width?: string | number;
};

export const SelectionButton = (props: SelectionButtonProps) => {
  const {
    enabledText = "",
    disabledText = "",
    enabledTextColor = Color.white,
    disabledTextColor = Color.black,
    enabledBgColor = Color.neonGreen,
    disabledBgColor = Color.white,
    onClick,
    width,
    defaultState = false,
    changeButtonStateTo = false,
  } = props;

  const [buttonState, setButtonState] = useState<boolean>(defaultState);

  const buttonClick = () => {
    onClick ? onClick() : null;
  };

  useEffect(() => {
    changeButtonStateTo != null
      ? setButtonState(changeButtonStateTo)
      : null;
  }, [changeButtonStateTo]);

  return (
    <SelectionButtonContainer
      style={{
        width: width,
        backgroundColor: buttonState
          ? (enabledBgColor as string)
          : (disabledBgColor as string),
      }}
      onClick={buttonClick}
    >
      <div style={{ margin: Spacing.selectionButtonTextPadding }}>
        <Typography
          {...TextStyle.mediumLabel}
          color={
            buttonState
              ? (enabledTextColor as string)
              : (disabledTextColor as string)
          }
        >
          {buttonState ? disabledText : enabledText}
        </Typography>
      </div>
    </SelectionButtonContainer>
  );
};
