import React, { useEffect, useState } from "react";
import { Typography } from "./Typography";
import { Color, TextStyle } from "../globalStyles";
import { WalletStatusContainer, WalletStatusDot } from "./styles";

export type WalletStatusProps = {
  status?: string;
};

export const WalletStatus = (props: WalletStatusProps) => {
  const { status } = props;
  const [color, setColor] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    switch (status) {
      case "synced":
        setColor(Color.neonGreen);
        setText("SYNCED");
        break;
      default:
        setColor(Color.neonGreen);
        setText("SYNCED");
        break;
    }
  }, [status]);

  return (
    <WalletStatusContainer>
      <WalletStatusDot
        style={{
          backgroundColor: color,
        }}
      ></WalletStatusDot>
      <Typography {...TextStyle.blackMediumLabel}>{text}</Typography>
    </WalletStatusContainer>
  );
};
