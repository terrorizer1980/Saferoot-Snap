import React from "react";
import { Typography } from "./Typography";
import { Spacing, TextStyle } from "../globalStyles";
import { AvatarIDContainer, AvatarIDImage } from "./styles";
import { defaultAvatar } from "../constants";

export type AvatarIdProps = {
  image?: string;
  id?: string;
};

export const AvatarId = (props: AvatarIdProps) => {
  const { image, id = "" } = props;
  return (
    <AvatarIDContainer>
      {image && <AvatarIDImage src={image}></AvatarIDImage>}
      <div style={{ margin: Spacing.avatarIDTextPadding }}>
        <Typography {...TextStyle.blackMediumLabel} {...TextStyle.boldText}>
          {id}
        </Typography>
      </div>
    </AvatarIDContainer>
  );
};
