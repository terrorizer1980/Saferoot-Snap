import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Tooltip, Avatar } from "@mui/material";
import { useData } from "../../../hooks/DataContext";
import { ASSET_TYPE } from "../../../constants";
import { NFTData } from "../Tables/gridhelper";
import { SelectedAssetForSetup } from "../SafeguardSelectionPage";
// Styles for the asset list component
const AssetContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

const AssetListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  `;

const Asset = styled.div`
    display: flex;
    flex-direction: row;
    min-width: 536px;
    height: 75px;
    justify-content: space-around;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 15px;
  `;

const AssetValues = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `;

const AssetValuesRightAligned = styled(AssetValues)`
    align-items: flex-end;
  `;

// Props for the asset list component
interface AssetListProps {
  currentAsset: SelectedAssetForSetup;
}

// The header props to populate the header component used to decouple the header from the asset list
interface HeaderInfo {
  contractAddress: string;
  price?: string;
  tokenName?: string;
  balance?: string;
  value?: string;
  imageUrl?: string;
  collection?: string;
  tokenId?: number;
  type: ASSET_TYPE;
}

export const AssetList: React.FC<AssetListProps> = ({ currentAsset }) => {
  const { state } = useData();
  const { saferootSupportedTokens, userTokenBalances, userNFTs } = state;

  // The header info is used to populate the header component
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    contractAddress: null,
    price: null,
    tokenName: null,
    balance: null,
    value: null,
    imageUrl: null,
    collection: null,
    tokenId: null,
    type: null,
  });

  // The header info is updated when the current asset changes
  useEffect(() => {
    if (currentAsset.assetType === ASSET_TYPE.TOKEN) {
      const asset = saferootSupportedTokens.find((token) => token.address === currentAsset.address)
      const balance = userTokenBalances.find((token) => token.address === currentAsset.address)
      setHeaderInfo({
        contractAddress: asset.address,
        tokenName: asset.name,
        price: String(asset.price),
        balance: String(balance.balance),
        value: (asset.price * balance.balance).toString(),
        imageUrl: asset.imageUrl,
        collection: null,
        tokenId: null,
        type: ASSET_TYPE.TOKEN,
      })
    }
    else if (currentAsset.assetType === ASSET_TYPE.NFT) {
      const asset: NFTData = userNFTs.find((nft: NFTData) => nft.tokenId === currentAsset.id && nft.assetContract.address === currentAsset.address)
      setHeaderInfo({
        contractAddress: asset.assetContract.address,
        price: null,
        balance: null,
        value: null,
        imageUrl: asset.imageUrl,
        collection: asset.collection.name,
        tokenId: asset.tokenId,
        type: ASSET_TYPE.NFT,
      });
    }
  }, [currentAsset])

  return (
    <AssetContainer>
      <b>Asset</b>
      <br />
      <AssetListContainer>
        <Asset>
          <Tooltip title={`Contract Address: ${headerInfo.contractAddress}`}>
            <Avatar
              src={headerInfo.imageUrl}
              style={{
                marginRight: 10,
                width: 30,
                height: 30,
              }}
            />
          </Tooltip>
          <AssetValues>
            {headerInfo.type === ASSET_TYPE.NFT ? <><b>#{headerInfo.tokenId}</b>{headerInfo.collection}</> : <b>{headerInfo.tokenName}</b>}
            <div>{headerInfo.price}</div>
          </AssetValues>
          {headerInfo.type === ASSET_TYPE.TOKEN ?
            <AssetValuesRightAligned>
              <b>Balance</b>
              <div>{headerInfo.balance}</div>
            </AssetValuesRightAligned> : null}
          {headerInfo.type === ASSET_TYPE.TOKEN ?
            <AssetValuesRightAligned>
              <b>Value</b>
              <div>{headerInfo.value}</div>
            </AssetValuesRightAligned> : null}
        </Asset>
      </AssetListContainer>
    </AssetContainer>
  )
}