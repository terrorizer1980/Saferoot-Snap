import React from "react";
import { Typography } from "./Typography";
import { Spacing, TextStyle } from "../globalStyles";
import { CoinIDImage, UserIDContainer } from "./styles";
import { defaultUser } from "../constants";

export type UserIdProps = {
  image?: string;
  id?: string;
};

export const UserId = (props: UserIdProps) => {
  const { image, id = "#6735 BAYC" } = props;
  return (
    <UserIDContainer>
      {image && <CoinIDImage src={image ?? defaultUser}></CoinIDImage>}
      <div style={{ margin: Spacing.avatarIDTextPadding }}>
        <Typography {...TextStyle.blackExtraSmallLabel}>
          {id}
        </Typography>
      </div>
    </UserIDContainer>
  );
};
