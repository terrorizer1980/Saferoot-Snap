import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useData } from '../../hooks/DataContext';
import { ActionType, Page } from '../../hooks/actions';
import { useNetwork } from 'wagmi';
import { SupportedToken, fetchSupportedTokensAndBalances, TokenBalance, fetchTokenSafeguards, fetchNFTs, NFTData } from '../OnboardingSteps/Tables/gridhelper';
import { AssetApprovedState, SelectedAssetForSetup } from '../OnboardingSteps';
import { ethers } from "ethers";
import { navigate } from "gatsby";
import { SAFEGUARD_TYPE, Safeguard } from "../OnboardingSteps/SafeguardSetup";
import { SimpleButton } from "../SimpleButton";
import { SafeguardSetupModal } from "../SafeguardSetupModal";
import { NFT_SUPPORT_ENABLED } from "../../config/environmentVariable";
import { DataGrid } from "@mui/x-data-grid";
import { TokenGridDashboardColumnsDefinition, DashboardNFTGridDefinition } from "../OnboardingSteps/Tables/columnDefinitions";
import { LoaderModal } from "../LoaderModal";
import { EmptyStateContainer } from "./EmptyStateContainer";
import { NAVIGATION_PATHS } from "../../constants";

export const AccountInformationTableContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items:center;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
  max-width: 1000px;
  `;
const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  button {
    margin-right: 10px;
  }`

const TableContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  margin-top: 10px;
  `

export const AccountInformationTable = () => {

  const { state, dispatch } = useData();
  const { userTokenBalances, userNFTs, tokenSafeguards, nftSafeguards, assetToEdit, loader, assetToModify } = state;
  const [tokenSafeguardsTemp, setTokenSafeguardsTemp] = useState<Safeguard[]>(tokenSafeguards || null);
  const [nftSafeguardsTemp, setNFTSafeguardsTemp] = useState<Safeguard[]>(nftSafeguards || null);
  const [showSetupPage, setShowSetupPage] = useState(false);
  const { chain } = useNetwork();
  const setSupportedTokens = (supportedTokens: SupportedToken[]) => {
    dispatch({ type: ActionType.SET_SUPPORTED_TOKENS, payload: supportedTokens });
  };
  const setBalances = (balances: TokenBalance[]) => {
    dispatch({ type: ActionType.SET_USER_TOKEN_BALANCES, payload: balances });
  };
  const [currentAsset, setCurrentAsset] = useState<SelectedAssetForSetup | null>(null);
  const [assetApprovalStates, setAssetApprovalStates] = useState<AssetApprovedState[]>([]);
  const [nftData, setNftData] = useState<Object[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { supportedTokens: st, balances: b } = await fetchSupportedTokensAndBalances(chain.id);
        const { ERC20Safeguards, ERC721Safeguards } = await fetchTokenSafeguards();
        const tokenDetails = ERC20Safeguards.map((safeguard) => {

          return {
            symbol: st.find((token) => token.address.toLowerCase() === safeguard.address.toLowerCase())?.symbol || '',

            address: safeguard.address,

            balance: b.find((balance) => balance.address.toLowerCase() === safeguard.address.toLowerCase())?.balance || 0,

            safeguards: ERC20Safeguards.map((safeguard) => {
              return {
                amount: Number(ethers.utils.formatEther(safeguard.threshold_value)),
                asset: safeguard.address,
                id: safeguard.supported_token_id,
                type: SAFEGUARD_TYPE.THRESHOLD,
                isEnabled: true,
                isValid: true,
                hash: safeguard.activation_hash,
              }
            }),

            status: 'Protected',

            image: "./token-logo.png",
          }
        })
        // set selected NFT data
        // set token safeguards
        dispatch({
          type: ActionType.SET_SELECTED_NFTS, payload: ERC721Safeguards.map((safeguard) => {
            return {
              address: safeguard.contract_address,
              id: safeguard.token_id,
              type: SAFEGUARD_TYPE.LOCK_ERC_721,
              isEnabled: true,
              isValid: true,
            }
          })
        })
        dispatch({
          type: ActionType.SET_SELECTED_TOKENS, payload: tokenDetails.map((token) => token.address)
        })
        dispatch({
          type: ActionType.SET_TOKEN_SAFEGUARDS, payload: ERC20Safeguards.map((safeguard) => {
            return {
              amount: ethers.utils.formatEther(safeguard.threshold_value),
              asset: safeguard.address,
              id: null,
              type: SAFEGUARD_TYPE.THRESHOLD,
              isEnabled: true,
              isValid: true,
            }
          })
        });
        dispatch({
          type: ActionType.SET_NFT_SAFEGUARDS, payload:
            ERC721Safeguards.map((safeguard) => {
              return {
                asset: safeguard.contract_address,
                id: safeguard.token_id,
                type: SAFEGUARD_TYPE.LOCK_ERC_721,
                isEnabled: safeguard.enabled,
                isValid: true,
                hash: safeguard.activation_hash,
              }
            })
        });
        setSupportedTokens(st);
        setBalances(tokenDetails);
        setTokenSafeguardsTemp(ERC20Safeguards.map((safeguard) => {
          return {
            amount: ethers.utils.formatEther(safeguard.threshold_value),
            asset: safeguard.address,
            id: null,
            type: SAFEGUARD_TYPE.THRESHOLD,
            isEnabled: true,
            isValid: true,
            hash: safeguard.activation_hash,
          }
        }));
      } catch (error) {
        console.error(`Error fetching supported tokens and balances: ${error}`);
      }
    };
    if (chain) {
      fetchData();
    }
    if (assetToModify === null) {
      fetchData();
    }
  }, [chain, assetToModify]);

  useEffect(() => {
    if (assetToEdit) {
      setShowSetupPage(true)
      setCurrentAsset(assetToEdit)
    }
  }, [assetToEdit])

  useEffect(() => {
    const newBalances = userTokenBalances.map((balance) => {
      return {
        ...balance,
        safeguards: tokenSafeguardsTemp.filter((safeguard) => safeguard.asset === balance.address),
      }
    })
    setBalances(newBalances)
  }, [tokenSafeguardsTemp])

  useEffect(() => {
    setTimeout(() => {
      const hasValidData = userNFTs?.length > 0 && nftSafeguards?.length > 0;
      if (hasValidData) {
        const newNFTData = userNFTs.map((safeguard) => ({
          ...safeguard,
          hash: nftSafeguards.find((nft) => nft.asset === safeguard.assetContract.address && nft.id === safeguard.id)?.hash,
          enabled: nftSafeguards.find((nft) => nft.asset === safeguard.assetContract.address && nft.id === safeguard.id)?.isEnabled,
        }));
        setNftData(newNFTData);
      }
    }, 500)
  }, [userNFTs, nftSafeguards])

  const setNfts = (nfts: NFTData[]) => {
    dispatch({ type: ActionType.SET_USER_NFTS, payload: nfts });
  };

  useEffect(() => {
    const fetchAlchemyNFTs = async () => {
      try {
        let userNFTArrayCombined = [];
        const storedNFTs = await fetchNFTs(chain.id);
        if (storedNFTs) {
          userNFTArrayCombined = [...storedNFTs];
        }

        // Notice the eth-goerli, change to eth-mainnet for mainnet
        const response = await fetch(`https://eth-goerli.g.alchemy.com/nft/v2/${process.env.GATSBY_REACT_APP_ALCHEMY_API_KEY}/getNFTs?owner=${state.userWallet}&withMetadata=true&pageSize=100`, {
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

  }, [state.userWallet]);

  const launchAddAssetsFlow = () => {
    navigate(NAVIGATION_PATHS.ONBOARDING)
    dispatch({ type: ActionType.SET_SELECTED_TAB, payload: Page.Tokens })
    dispatch({ type: ActionType.SET_ASSET_TO_ADD, payload: true })
  }

  return (
    <AccountInformationTableContainer>
      <LoaderModal open={loader.open} message={loader.message} />
      <Toolbar>
        <SimpleButton
          type="default"
          onClick={launchAddAssetsFlow}>+ Add assets to protect</SimpleButton>
        <br />
        <br />
      </Toolbar>

      {userTokenBalances.length > 0 ?
        <TableContainer>
          <div>
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none'
                }
              }}
              columns={TokenGridDashboardColumnsDefinition(assetApprovalStates, setAssetApprovalStates)}
              rows={userTokenBalances}
              getRowId={(row) => (row as TokenBalance).address}
            />
          </div>
        </TableContainer>
        :
        <EmptyStateContainer message="You have no tokens protected yet." button={
          <SimpleButton type="primary" onClick={launchAddAssetsFlow}>Add Tokens</SimpleButton>
        } />
      }
      {NFT_SUPPORT_ENABLED && nftData.length > 0 ?
        <TableContainer>
          <div>
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none'
                }
              }}
              columns={DashboardNFTGridDefinition(assetApprovalStates, setAssetApprovalStates)}
              rows={nftData}
              getRowId={(row) => (row as NFTData)?.assetContract?.address + (row as NFTData)?.id}
            />
          </div>
        </TableContainer>
        :
        <EmptyStateContainer message="You have no NFTs protected yet." button={
          <SimpleButton type="primary" onClick={launchAddAssetsFlow}>Add NFTs</SimpleButton>
        } />
      }
      <SafeguardSetupModal
        open={showSetupPage}
        setOpen={setShowSetupPage}
        currentAsset={currentAsset}
        setTokenSafeguards={setTokenSafeguardsTemp}
        tokenSafeguardsTemp={tokenSafeguardsTemp as Safeguard[]}
        setNFTSafeguards={setNFTSafeguardsTemp}
        nftSafeguardsTemp={nftSafeguardsTemp}
      />
    </AccountInformationTableContainer>
  )
}



