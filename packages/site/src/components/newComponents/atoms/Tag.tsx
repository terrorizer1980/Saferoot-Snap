import React from "react";
import { Typography } from "./Typography";
import { Color, TextStyle } from "../globalStyles";
import { TagContainer, TagIcon } from "./styles";
import { defaultTagIcon } from "../constants";

export type TagProps = {
  text: string;
  bgColor: string;
  color?: string;
  image?: string;
  onClick?: () => void;
};

export const Tag = (props: TagProps) => {
  const { bgColor, color = Color.white, text, image, onClick } = props;
  return (
    <TagContainer style={{ backgroundColor: bgColor }} onClick={onClick}>
      {image && <TagIcon src={image} />}
      <Typography
        {...TextStyle.tinyLabel}
        {...TextStyle.boldText}
        color={color as string}
      >
        {text}
      </Typography>
    </TagContainer>
  );
};
