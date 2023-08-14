import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { NFTData } from "../TableView";
import { UsefulValues, defaultAvatar } from "../../constants";
import {
  NFTAssetTileCheckboxContainer,
  NFTAssetTileCheckboxFloat,
  NFTAssetTileIDContainer,
  NFTAssetTileImage,
  NFTAssetTileInfoContainer,
  NFTAssetTileRoot,
  NFTAssetTileSpreadContainer,
} from "./styles";
import { Checkbox } from "@mui/material";
import { AssetGuard, updateAssetProperties } from "../../../../hooks/Assets/useAssetGuards";

export type NFTAssetTileProps = {
  selectable?: boolean;
  data?: AssetGuard;
  setData?: React.Dispatch<React.SetStateAction<Object[]>>;
};

export const NFTAssetTile = (props: NFTAssetTileProps) => {
  const { selectable, data, setData } = props;

  const selectThisNFT = () => {
    updateAssetProperties(setData, "ERC721Assets", { address: data?.address, tokenId: data?.tokenId }, { isSelected: !data?.isSelected });
  }

  return (
    <NFTAssetTileRoot>
      <NFTAssetTileIDContainer>
        <NFTAssetTileCheckboxContainer>
          <NFTAssetTileCheckboxFloat>
            <Checkbox
              sx={{
                color: Color.black,
                "&.Mui-checked": {
                  color: Color.black,
                },
                "& .MuiSvgIcon-root": { fontSize: 24 },
              }}
              onChange={selectThisNFT}
            />
          </NFTAssetTileCheckboxFloat>
        </NFTAssetTileCheckboxContainer>
        <NFTAssetTileImage src={data.asset.image ?? defaultAvatar}></NFTAssetTileImage>
      </NFTAssetTileIDContainer>
      <NFTAssetTileInfoContainer>
        <NFTAssetTileSpreadContainer>
          <div>
            <Typography {...TextStyle.blackSmallLabel}>
              {data.asset.name.length > UsefulValues.MaxVisibleName
                ? data.asset.name.slice(0, 8) + "..."
                : data.asset.name}
            </Typography>
          </div>
          <div>
            <Typography {...TextStyle.blackSmallLabel}>{data.price}</Typography>
          </div>
        </NFTAssetTileSpreadContainer>
        <NFTAssetTileSpreadContainer>
          <div>
            <Typography
              {...TextStyle.headingColorSmallLabel}
              {...TextStyle.opacity}
            >
              {data.collection}
            </Typography>
          </div>
          <div>
            <Typography
              {...TextStyle.headingColorSmallLabel}
              {...TextStyle.opacity}
            >
              {data.value}
            </Typography>
          </div>
        </NFTAssetTileSpreadContainer>
      </NFTAssetTileInfoContainer>
    </NFTAssetTileRoot>
  );
};
