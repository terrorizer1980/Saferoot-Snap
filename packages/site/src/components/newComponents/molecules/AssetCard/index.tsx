import React from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { TextStyle } from "../../globalStyles";
import { useData } from "../../../../hooks/DataContext";
import { Button } from "../../atoms/Button";

export type AssetCardProps = {
  protectedAssets: { tokens: number; nfts: number };
  protectedValue?: number;
};

export const AssetCard = (props: AssetCardProps) => {
  const { state } = useData();
  const { protectedAssets, protectedValue = 0 } = props;

  return (
    <div className="wallet_card_root_container">
      <div className="wallet_card_info_container">
        <div>
          <Typography {...TextStyle.headingColorExtraSmallLabel}>
            Assets Protected
          </Typography>
        </div>
        <div className="asset_card_amounts">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div style={{ height: 31, marginRight: 2 }}>
              <Typography {...TextStyle.blackExtraLargeLabel}>
                {protectedAssets.tokens}
              </Typography>
            </div>
            <div>
              <Typography {...TextStyle.orchidPurpleExtraSmallLabel}>
                Tokens
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: 10,
            }}
          >
            <div style={{ height: 31, marginRight: 2 }}>
              <Typography {...TextStyle.blackExtraLargeLabel}>
                {protectedAssets.nfts}
              </Typography>
            </div>
            <div>
              <Typography {...TextStyle.orchidPurpleExtraSmallLabel}>
                NFTs
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="asset_card_value_container">
        <Button onClick={() => {
          if (state.deployedSaferootAddress) {
            const etherscanURL = `https://goerli.etherscan.io/address/${state.deployedSaferootAddress}`;
            window.open(etherscanURL, '_blank');
          }
        }}
        text="View Contract"
        />
      </div>
    </div>
  );
};
