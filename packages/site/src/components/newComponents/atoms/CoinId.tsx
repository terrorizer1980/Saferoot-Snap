import React from "react";
import { Typography } from "./Typography";
import { Spacing, TextStyle } from "../globalStyles";
import { AvatarIDContainer, AvatarIDImage, CoinIDImage } from "./styles";
import { defaultIcon } from "../constants";

export type CoinIdProps = {
  image?: string;
  id?: string;
};

export const CoinId = (props: CoinIdProps) => {
  const { image, id = "" } = props;
  return (
    <AvatarIDContainer>
      <CoinIDImage src={image ?? defaultIcon}></CoinIDImage>
      <div style={{ margin: Spacing.avatarIDTextPadding }}>
        <Typography {...TextStyle.blackSmallLabel} {...TextStyle.boldText}>
          {id}
        </Typography>
      </div>
    </AvatarIDContainer>
  );
};
