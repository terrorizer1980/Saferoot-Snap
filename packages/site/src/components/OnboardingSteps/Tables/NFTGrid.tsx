import React, { useEffect } from "react";
import { Heading, RoundedInput, Subtitle } from "../../../styling/styles";
import { useData } from "../../../hooks/DataContext";
import { ActionType } from "../../../hooks/actions";
import { NFTData, SelectedNFTToken } from "./gridhelper";
import { RoundedWhiteContainer } from "../styles";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import CustomNFTInsertionModal from "../CustomNFTInsertionModal";
import { fetchNFTs } from "./gridhelper";
import { useNetwork } from "wagmi";
import { ethers } from "ethers";
import { default as NFTABI } from "../../../blockchain/abi/ERC721NFTABI.json";

interface NFTGridProps {
  walletAddress: string;
  selectedNFTs: SelectedNFTToken[];
  setSelectedNFTs: (selectedNFTs: SelectedNFTToken[]) => void;
}

// Grid that allows the user to select NFTs
export const NFTGrid: React.FC<NFTGridProps> = ({
  walletAddress,
  selectedNFTs,
  setSelectedNFTs,
}) => {
  const { state, dispatch } = useData();
  const { userNFTs, nftSafeguards, assetToAdd } = state;
  const setNfts = (nfts: NFTData[]) => {
    dispatch({ type: ActionType.SET_USER_NFTS, payload: nfts });
  };
  const { chain } = useNetwork();

  useEffect(() => {
    // Fetch NFTs from OpenSea API based on user's wallet address
    if (!walletAddress) {
      return;
    }
    const fetchAlchemyNFTs = async () => {
      try {
        let userNFTArrayCombined = [];
        const storedNFTs = await fetchNFTs(chain.id);
        if (storedNFTs) {
          userNFTArrayCombined = [...storedNFTs];
        }

        // Notice the eth-goerli, change to eth-mainnet for mainnet
        const response = await fetch(`https://eth-goerli.g.alchemy.com/nft/v2/${process.env.GATSBY_REACT_APP_ALCHEMY_API_KEY}/getNFTs?owner=${walletAddress}&withMetadata=true&pageSize=100`, {
        });

        const nftCollection = await response.json();
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          if (nftCollection && nftCollection.ownedNfts && nftCollection.ownedNfts.length > 0) {
            const assets = await Promise.all(nftCollection.ownedNfts.map(async (asset) => {
              if (asset.contractMetadata.tokenType !== 'ERC721') {
                return null;
              }
              const contract = new ethers.Contract(asset.contract.address, NFTABI, provider);
              const owner = await contract.ownerOf(asset.id.tokenId);
              if (ethers.utils.getAddress(owner) !== ethers.utils.getAddress(state.userWallet)) {
                return null;
              }

              let imageUrl = asset.metadata.image;
              // If the image URL starts with ipfs://, convert it to use the Infura gateway
              if (imageUrl && imageUrl.startsWith('ipfs://')) {
                imageUrl = `https://gateway.pinata.cloud/ipfs/${imageUrl.slice(7)}`;
              }
              return {
                name: asset.metadata.name,
                id: parseInt(asset.id.tokenId, 16).toString(),
                imageUrl: asset.media[0].thumbnail || imageUrl,
                tokenId: parseInt(asset.id.tokenId, 16).toString(),
                collection: {
                  name: asset.metadata.collection,
                },
                assetContract: {
                  address: asset.contract.address,
                  chainIdentifier: null,
                  schemaName: null,
                  owner: null,
                  assetContractType: asset.contractMetadata.tokenType,
                },
                ethAmount: null,
                usdAmount: null,
              };
            }));

            // Check if the asset already exists in storedNFTs, if so, replace it, else add it
            assets.forEach((asset) => {
              if (asset === null) return;
              const index = userNFTArrayCombined.findIndex(
                (nft) =>
                  nft.tokenId === asset.tokenId &&
                  nft.assetContract.address === asset.assetContract.address
              );
              if (index !== -1) {
                userNFTArrayCombined[index] = asset;
              } else {
                userNFTArrayCombined.push(asset);
              }
            });

            setNfts(userNFTArrayCombined);
          }
        } catch (err) {
          console.log(err);
        }
        setNfts(userNFTArrayCombined);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setNfts([]);
      }
    };

    fetchAlchemyNFTs();

  }, [walletAddress, state.userWallet]);


  const handleNFTSelection = (address: string, tokenId: number) => {
    if (assetToAdd && nftSafeguards.filter(safeguard => safeguard.asset === address).length > 0) {
      // handles case where the user is clicking on an NFT that is already safeguarded 
      // during the add-assets flow (non-onboarding flow)
      // simply doesn't allow the user to select the NFT
      return;
    } else {
      const index = selectedNFTs.findIndex((nft) => nft.address === address && nft.tokenId === tokenId);
      if (index === -1) {
        setSelectedNFTs([...selectedNFTs, { address, tokenId }]);
      } else {
        const newSelectedNFTs = [...selectedNFTs];
        newSelectedNFTs.splice(index, 1);
        setSelectedNFTs(newSelectedNFTs);
      }
    }
  };

  const shortenTokenId = (tokenId: number) => {
    const tokenIdString = tokenId.toString();
    if (tokenIdString.length > 6) {
      return tokenIdString.slice(0, 2) + "..." + tokenIdString.slice(-4);
    }
    return tokenIdString;
  };

  return (
    <RoundedWhiteContainer>
      <Heading>
        NFT Selection &nbsp;
        <Tooltip title="Select the NFTs that Saferoot will protect">
          <HelpIcon />
        </Tooltip>

      </Heading>
      {userNFTs.length > 0 && (
        <Subtitle>You have selected {selectedNFTs.length} NFTs</Subtitle>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "1100px" }}>
        {userNFTs.map((nft) => (
          <div
            key={nft.tokenId}
            style={{ width: "200px", minHeight: "315px", margin: "10px", position: "relative" }}
          >
            {nft.imageUrl !== null && (
              <Tooltip title={nft.assetContract.address}>
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => handleNFTSelection(nft.assetContract.address, nft.tokenId)}
                />
              </Tooltip>
            )}
            {nft.imageUrl === null && (
              <Tooltip title={nft.assetContract.address}>
                <div
                  style={{
                    width: "100%",
                    height: "220px",
                    backgroundColor: "grey",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNFTSelection(nft.assetContract.address, nft.tokenId)}
                />
              </Tooltip>
            )}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "5px",
                backgroundColor: "white",
                borderBottomLeftRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleNFTSelection(nft.assetContract.address, nft.tokenId)}
            >
              <RoundedInput
                type="checkbox"
                disabled={
                  // disable the checkbox if the NFT is already safeguarded
                  nftSafeguards.filter(safeguard => safeguard.asset === nft.assetContract.address).length > 0
                }
                checked={
                  // if the NFT is already safeguarded, check the checkbox 
                  (nftSafeguards.filter(safeguard => safeguard.asset === nft.assetContract.address).length > 0) ? 
                    true :
                    // else, check if the NFT is already selected by the user
                    selectedNFTs.filter(userSelectedNft => userSelectedNft.address === nft.assetContract.address && userSelectedNft.tokenId === nft.tokenId).length > 0
                }
                onChange={(e) => e.stopPropagation()}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {nft.name}: {nft.collection?.name} #{shortenTokenId(nft.tokenId)}
              </div>
            </div>
          </div>
        ))}
        <CustomNFTInsertionModal />
      </div>
    </RoundedWhiteContainer>
  );
};
