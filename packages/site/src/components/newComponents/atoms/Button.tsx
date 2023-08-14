import React, { useState } from "react";
import { Typography } from "./Typography";
import { Color, Dimensions, Spacing, TextStyle } from "../globalStyles";
import { ButtonTypes, defaultIcon } from "../constants";
import { ButtonContainer, ButtonImage } from "./styles";

export type ButtonProps = {
  onClick?: () => void;
  type?: ButtonTypes.Small | ButtonTypes.Large;
  image?: string;
  text?: string;
  bgColor?: string;
  color?: string;
  hoverBgColor?: string;
  borderColor?: string;
  width?: string | number;
  height?: string | number;
  border?: string;
};

export const Button = (props: ButtonProps) => {
  const {
    type = ButtonTypes.Large,
    image,
    text = "",
    bgColor = Color.white,
    color,
    hoverBgColor,
    onClick,
    width,
    height,
    border,
  } = props;

  const [isHovering, setIsHovering] = useState(false);
  return (
    <>
      {type == ButtonTypes.Large && (
        <ButtonContainer
          style={{
            backgroundColor:
              isHovering && hoverBgColor
                ? (hoverBgColor as string)
                : (bgColor as string),
            width: width,
            height: height,
            borderRadius: border == "rounded" ? 30 : 5,
          }}
          onClick={() => {
            onClick ? onClick() : null;
          }}
          onMouseEnter={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
        >
          <div style={{ margin: Spacing.buttonImageMargin }}>
            {image && <ButtonImage src={image} />}
          </div>
          {text && (
            <div
              style={{
                margin: image
                  ? Spacing.buttonTextPadding
                  : Spacing.selectionButtonTextPadding,
              }}
            >
              <Typography
                {...TextStyle.blackMediumLabel}
                color={color ?? (Color.black as string)}
              >
                {text}
              </Typography>
            </div>
          )}
        </ButtonContainer>
      )}
      {type == ButtonTypes.Small && (
        <ButtonContainer
          style={{
            backgroundColor: bgColor as string,
            width: width,
            height: height ?? Dimensions.smallButtonHeight,
            borderRadius: border == "rounded" ? 30 : 5,
          }}
          onClick={() => {
            onClick ? onClick() : null;
          }}
        >
          <div style={{ margin: Spacing.buttonImageMargin }}>
            {image && <ButtonImage src={image} />}
          </div>
          {text && (
            <div
              style={{
                margin: image
                  ? Spacing.buttonTextPadding
                  : Spacing.selectionButtonTextPadding,
              }}
            >
              <Typography
                {...TextStyle.blackMediumLabel}
                color={color ?? (Color.black as string)}
              >
                {text}
              </Typography>
            </div>
          )}
        </ButtonContainer>
      )}
    </>
  );
};
