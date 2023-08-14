import React, { useEffect, useState } from "react";
import { NFTAssetTile } from "../NFTAssetTile";
import { TileViewAssetContainer, TileViewFilterContainer, TileViewHeader, TileViewRoot, TileViewTileContainer } from "./styles";
import { Typography } from "../../atoms/Typography";
import { TextStyle } from "../../globalStyles";
import { GenericHorizontalSpacer } from "../../organisms/commonStyles";
import { Switch } from "@mui/material";
import { DropDown } from "../../atoms/DropDown";
import { AssetSelectionFilter } from "../../constants";

export type TokenData = {
  asset?: {
    name: string;
    image: string;
  };
  price?: string | number;
  collection?: string | number;
  balance?: string | number;
  value?: string | number;
  valueProtected?: string | number;
  security?: string[];
  status?: {
    type: string;
    time: string;
  };
};

export type NFTData = {
  asset?: {
    name: string;
    image: string;
  };
  price?: string | number;
  collection?: string | number;
  balance?: string | number;
  value?: string | number;
  valueProtected?: string | number;
  security?: string[];
  status?: {
    type: string;
    time: string;
  };
};

export type TileViewProps = {
  type: "token" | "nft";
  tableHeader: string;
  headerOptions?: { sort: boolean; selectAll: boolean };
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data: NFTData[];
  setData?: React.Dispatch<React.SetStateAction<Object[]>>;
};

export const TileView = (props: TileViewProps) => {
  const { type, tableHeader, labels, data, buttonOptions, setData } = props;

  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    const handleResize = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TileViewRoot>
      <TileViewHeader>
        <Typography {...TextStyle.blackExtraLargeLabel}>
          {tableHeader}
        </Typography>
      </TileViewHeader>
      <TileViewTileContainer>
        {data.map((item) => {
          return (
            <TileViewAssetContainer>
              <NFTAssetTile data={item} setData={setData} />
            </TileViewAssetContainer>
          );
        })}
      </TileViewTileContainer>
    </TileViewRoot>
  );
};
