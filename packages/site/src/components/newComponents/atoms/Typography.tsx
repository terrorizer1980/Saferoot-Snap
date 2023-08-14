import React from "react";
import "../styles.css";
import { Color } from "../globalStyles";

type TypographyProps = {
  bgColor?: string;
  children?: string | JSX.Element | JSX.Element[] | number;
  fontSize?: string | number;
  lineHeight?: string | number;
  color?: string;
  textAlign?: string;
  styleProps?: object;
};

export const Typography = (props: TypographyProps) => {
  const {
    children,
    color = Color.black,
    textAlign,
    styleProps,
    bgColor,
    fontSize,
    lineHeight,
  } = props;

  let styles: object = {
    color: color,
    fontSize: fontSize,
    lineHeight: lineHeight,
    backgroundColor: bgColor,
    textAlign: textAlign ?? "left",
  };

  if (styleProps) {
    styles = {
      ...styles,
      ...styleProps,
    };
  }

  return <div style={styles}>{children}</div>;
};
