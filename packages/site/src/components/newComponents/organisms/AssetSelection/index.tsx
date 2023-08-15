import React, { useEffect } from "react";
import {
  SafeguardSetupInfoContainer,
  SafeguardSetupNFTContainer,
  SafeguardSetupTokenContainer,
} from "./styles";
import { WalletCard } from "../../molecules";
import { TableView } from "../../molecules/TableView";
import {
  GenericRoot,
  GenericWalletCardContainer,
} from "../commonStyles";
import { TileView } from "../../molecules/TileView";

const AssetSelection = ({ assetGuards, setAssetGuards }) => {

  const { ERC20Assets, ERC721Assets } = assetGuards
  const ERC20NonGuarded = ERC20Assets.filter((asset) => !asset.isPreGuarded)
  const ERC721NonGuarded = ERC721Assets.filter((asset) => !asset.isPreGuarded)

  useEffect(() => {
    setAssetGuards((prev) => {
      return {
        ERC20Assets: prev.ERC20Assets.map((asset) => {
          if (!asset.isPreGuarded) {
            return {
              ...asset,
              isSelected: false,
              safeguards: [],
              security: [],
            }
          }
          return asset
        }),
        ERC721Assets: prev.ERC721Assets.map((asset) => {
          if (!asset.isPreGuarded) {
            return {
              ...asset,
              isSelected: false,
              safeguards: [],
              security: [],
            }
          }
          return asset
        }),
      }
    })
  }, [])

  return (
    <GenericRoot>
      <GenericWalletCardContainer>
        <WalletCard
          amount="11,1688.13"
          coinAmount="68.3"
          network="ethereum marriot"
        />
      </GenericWalletCardContainer>
      <SafeguardSetupInfoContainer>
        <SafeguardSetupTokenContainer>
          {ERC20NonGuarded?.length > 0 &&
            <TableView
              type={"token"}
              headerOptions={true}
              tableHeader={"Select Tokens"}
              labels={["TOKEN", "BALANCE"]}
              data={ERC20NonGuarded}
              setData={setAssetGuards}
              selectable
            />
          }
        </SafeguardSetupTokenContainer>
        <SafeguardSetupNFTContainer>
          {ERC721NonGuarded?.length > 0 &&
            <TileView
              type={"nft"}
              tableHeader={"Select NFTS"}
              labels={["NFT", "COLLECTION", "PRICE", "VALUE", "SECURITY"]}
              data={ERC721NonGuarded}
              setData={setAssetGuards}
            />
          }
        </SafeguardSetupNFTContainer>
      </SafeguardSetupInfoContainer>
    </GenericRoot>
  );
};

export default AssetSelection;
