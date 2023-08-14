import React from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { WalletStatus } from "../../atoms/WalletStatus";
import { useAccount, useBalance, useNetwork } from "wagmi";


export const WalletCard = () => {
  const {
    address,
    isConnected
  } = useAccount();
  const {
    chain
  } = useNetwork();
  const {
    data,
    isFetching
  } = useBalance({
    address: address,
  });

  return (
    <div className="wallet_card_root_container">
      <div className="wallet_card_info_container">
        <div>
          <Typography {...TextStyle.headingColorExtraSmallLabel}>
            Wallet
          </Typography>
        </div>
        <div className="wallet_card_coin_amount">
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {data && `${parseFloat(data.formatted).toFixed(4)} ${data.symbol}`}
          </Typography>
        </div>
        <div>
          <Typography
            {...TextStyle.headingColorExtraSmallLabel}
          >
            Network
          </Typography>
        </div>
        <div>
          <Typography {...TextStyle.blackExtraLargeLabel}>{chain ? chain.name : "Not Connected"}</Typography>
        </div>
      </div>
      <div>
        <WalletStatus />
      </div>
    </div>
  );
};
