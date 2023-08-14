import React, { useEffect, useState } from "react";
import {
  SafeguardSetupInfoContainer,
  SafeguardSetupNFTContainer,
  SafeguardSetupTokenContainer,
} from "./styles";
import { WalletCard } from "../../molecules";
import { TableView } from "../../molecules/TableView";
import {
  GenericInfoContainer,
  GenericRoot,
  GenericWalletCardContainer,
} from "../commonStyles";
import useAssetGuards from "../../../../hooks/Assets/useAssetGuards";

const SafeguardSetup = ({ assetGuards, setAssetGuards }) => {

  const { ERC20Assets, ERC721Assets } = assetGuards
  const [selectedERC20Assets, setSelectedERC20Assets] = useState(null)
  const [selectedERC721Assets, setSelectedERC721Assets] = useState(null)

  useEffect(() => {
    const newSelected = ERC20Assets?.filter((asset) => asset.isSelected)
    setSelectedERC20Assets(newSelected)
  }, [ERC20Assets])

  useEffect(() => {
    const newSelected = ERC721Assets?.filter((asset) => asset.isSelected)
    setSelectedERC721Assets(newSelected)
  }, [ERC721Assets])

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
          {selectedERC20Assets?.length > 0 && <TableView
            type={"token"}
            tableHeader={"Setup Safeguard for Selected Tokens"}
            labels={["TOKEN", "BALANCE", "SECURITY"]}
            data={selectedERC20Assets}
            setData={setAssetGuards}
          ></TableView>}
        </SafeguardSetupTokenContainer>
        <SafeguardSetupNFTContainer>
          {selectedERC721Assets?.length > 0 && <TableView
            type={"nft"}
            tableHeader={"Setup Safeguard for Selected NFTS"}
            labels={["NFT", "COLLECTION", "SECURITY"]}
            data={selectedERC721Assets}
            setData={setAssetGuards}
          ></TableView>}
        </SafeguardSetupNFTContainer>
      </SafeguardSetupInfoContainer>
    </GenericRoot>
  );
};

export default SafeguardSetup;
