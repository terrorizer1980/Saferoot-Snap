import React, { useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useData } from "../../hooks/DataContext";
import { Container, Left, Right, RoundedWhiteContainer } from './styles';
import { ActionType } from '../../hooks/actions';
import { TokenGridColumnsDefinition, NFTGridColumnsDefinition, TokenGridDashboardColumnsDefinition, DashboardNFTGridDefinition } from './Tables/columnDefinitions';
import { TokenSetup, NFTSetup, Safeguard } from './SafeguardSetup';
import { NFTData, SelectedNFTToken, TokenBalance } from './Tables/gridhelper';
import FixedNavigationBottomBar from '../FixedNavigationBottomBar';
import { UserWalletWidget } from '../UserWalletWidget';
import { NFT_SUPPORT_ENABLED } from '../../config/environmentVariable';
import { ASSET_TYPE } from '../../constants';
import styled from 'styled-components';
import { Heading } from '../../styling/styles';
import { Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { SafeguardSetupModal } from '../SafeguardSetupModal';
import { SAFEGUARD_TYPE } from '../OnboardingSteps/SafeguardSetup';
import { SimpleButton } from '../SimpleButton';

const SafeguardList = styled.div`
  color: black;
  background-color: #E9FFF0;
  border-radius: 8px;
  padding: 8px;
  margin: 5px;
`;

const SafeguardsUL = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const SafeguardsLI = styled.li`
  margin: 5px;
  font-size: 14px;
  background-color: #E9FFF0;
  border-radius: 8px;
  padding: 4px;
`;

const SafeguardGridList = ({ safeguards, token }) => {
  if (safeguards?.length === 0) {
    return (
      <SafeguardList>No Safeguards configured</SafeguardList>
    )
  }
  return (
    <SafeguardsUL>
      {safeguards?.map(safeguard => {
        switch (safeguard.type) {
          case SAFEGUARD_TYPE.THRESHOLD:
            return <Tooltip key={safeguard} title={`Triggers when a transaction of ${token.symbol} over ${safeguard.amount}`}>
              <SafeguardsLI key={safeguard}>Value {safeguard.amount} {token.symbol}</SafeguardsLI>
            </Tooltip>
          case SAFEGUARD_TYPE.LOCK_ERC_721:
            return <Tooltip key={safeguard} title={'Triggers when the NFT is transfered'}>
              <SafeguardsLI key={safeguard}>Locked</SafeguardsLI>
            </Tooltip>
          default:
            break;
        }
      })}
    </SafeguardsUL>
  )
}


// This is the current asset that is being configured
export interface SelectedAssetForSetup {
  assetType: ASSET_TYPE;
  address: string;
  symbol: string;
  id: number;

  // optional additions for enabling a state-independent
  // safeguard edit/delete flow
  // only used during dashboard flows
  hash?: string;
  amount?: number;
  enabled?: boolean; // to identify if the safeguard is enabled or disabled
}

// The datagrid column for the token grid for safeguard setup
const TokenGridSafeguardsColumnDefinition: (setCurrentAsset: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>, tokenSafeguards: Safeguard[], editDisabled: boolean) => GridColDef[] =
  (setCurrentAsset, tokenSafeguards, editDisabled) => editDisabled ?
    [
      ...TokenGridColumnsDefinition,
      {
        field: "safeguards",
        headerName: "Active Safeguards",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const tokenBalance: TokenBalance = row as TokenBalance;

          // Filtered safeguards for the given asset
          const safeguards = tokenSafeguards?.filter((safeguard: Safeguard) => {
            return safeguard.asset === tokenBalance.address && safeguard.isEnabled && safeguard.isValid;
          });
          if (safeguards.length === 0) {
            return (
              <SafeguardList>No Safeguards configured</SafeguardList>
            )
          }
          return (
            <SafeguardGridList safeguards={safeguards} token={tokenBalance} />
          )
        }
      }
    ] : [
      ...TokenGridColumnsDefinition,
      {
        field: "safeguards",
        headerName: "Active Safeguards",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const tokenBalance: TokenBalance = row as TokenBalance;

          // Filtered safeguards for the given asset
          const safeguards = tokenSafeguards?.filter((safeguard: Safeguard) => {
            return safeguard.asset === tokenBalance.address && safeguard.isEnabled && safeguard.isValid;
          });
          if (safeguards.length === 0) {
            return (
              <SafeguardList>No Safeguards configured</SafeguardList>
            )
          }
          return (
            <SafeguardGridList safeguards={safeguards} token={tokenBalance} />
          )
        }
      },
      {
        field: "Configured Safeguard List",
        headerName: "Safeguards",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const tokenBalance: TokenBalance = row as TokenBalance;

          // Filtered safeguards for the given asset
          const safeguards = tokenSafeguards?.filter((safeguard: Safeguard) => {
            return safeguard.asset === tokenBalance.address && safeguard.isEnabled && safeguard.isValid;
          });

          const handleClick = () => {
            setCurrentAsset({ assetType: ASSET_TYPE.TOKEN, address: tokenBalance.address, id: null, symbol: tokenBalance.symbol });
          };

          return (
            <SimpleButton type="primary" onClick={handleClick}>{`${safeguards.length > 0 ? "Edit" : "Setup"}`}</SimpleButton>)
        },
      }
    ];

interface TokenGridProps {
  balances: TokenBalance[];
  selectedTokens?: string[];
  tokenSafeguards?: Safeguard[];
  setCurrentAsset?: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>;
  editDisabled?: boolean;
  dashboard?: boolean;
}
export const TokenGrid: React.FC<TokenGridProps> = ({ balances, selectedTokens = [], tokenSafeguards, setCurrentAsset = null, editDisabled = false, dashboard = false }) => {
  if (selectedTokens?.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom component="div">
          No tokens selected
        </Typography>
      </div>
    )
  }

  const getColumnDefinition = React.useCallback((setCurrentAsset: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>, tokenSafeguards, editDisabled = false) => {
    switch (true) {
      case setCurrentAsset === null && !dashboard:
        return TokenGridColumnsDefinition;
      case dashboard:
        return TokenGridDashboardColumnsDefinition;
      default:
        return TokenGridSafeguardsColumnDefinition(setCurrentAsset, tokenSafeguards, editDisabled);
    }
  }, [setCurrentAsset]);


  return (
    <div>
      <DataGrid
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none'
          }
        }}
        columns={getColumnDefinition(setCurrentAsset, tokenSafeguards, editDisabled)}
        rows={balances?.filter(row => selectedTokens?.includes(row.address))}
        getRowId={(row) => row.address}
      />
    </div>
  )
};

const NFTGridSafeguardsColumnDefinition: (setCurrentAsset: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>, nftSafeguards, editDisabled) => GridColDef[] =
  (setCurrentAsset, nftSafeguards, editDisabled = false) =>
    editDisabled ? [
      ...NFTGridColumnsDefinition,
      {
        field: "safeguards",
        headerName: "Active Safeguards",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const NFT: NFTData = row as NFTData;
          // Filtered safeguards for the given asset
          const safeguards = nftSafeguards.filter((safeguard: Safeguard) => {
            return safeguard.asset === NFT.assetContract.address && safeguard.id === NFT.tokenId && safeguard.isEnabled && safeguard.isValid;
          });
          if (safeguards.length === 0) {
            return (
              <SafeguardList>No Safeguards configured</SafeguardList>
            )
          }
          return (
            <SafeguardGridList safeguards={safeguards} token={NFT} />
          )
        }
      }
    ] : [
      ...NFTGridColumnsDefinition,
      {
        field: "safeguards",
        headerName: "Active Safeguards",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const NFT: NFTData = row as NFTData;
          // Filtered safeguards for the given asset
          const safeguards = nftSafeguards?.filter((safeguard: Safeguard) => {
            return safeguard.asset === NFT.assetContract.address && safeguard.id === NFT.tokenId && safeguard.isEnabled && safeguard.isValid;
          });
          if (safeguards?.length === 0) {
            return (
              <SafeguardList>No Safeguards configured</SafeguardList>
            )
          }
          return (
            <SafeguardGridList safeguards={safeguards} token={NFT} />
          )
        }
      },
      {
        field: "button",
        headerName: "Configure",
        width: 300,
        renderCell: (params) => {
          const { row } = params;
          const NFT: NFTData = row as NFTData;
          // Filtered safeguards for the given asset
          const safeguards = nftSafeguards?.filter((safeguard: Safeguard) => {
            return safeguard.asset === NFT.assetContract.address && safeguard.id === NFT.tokenId && safeguard.isEnabled && safeguard.isValid;
          });
          const handleClick = () => {
            setCurrentAsset({ assetType: ASSET_TYPE.NFT, address: NFT.assetContract.address, id: NFT.tokenId, symbol: NFT.collection.name });
          };
          return (
            <SimpleButton type="primary" onClick={handleClick}>{`${safeguards.length > 0 ? "Edit" : "Setup"}`}</SimpleButton>
          );
        },
      },
    ];

interface NFTGridProps {
  nftSafeguards: Safeguard[];
  editDisabled?: boolean;
  nfts: NFTData[];
  selectedNFTs?: SelectedNFTToken[];
  setCurrentAsset?: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>;
  dashboard?: boolean;
}

export const NFTGrid: React.FC<NFTGridProps> = ({ nfts, selectedNFTs = [], setCurrentAsset = null, nftSafeguards, editDisabled = false, dashboard=false }) => {
  if (!dashboard && selectedNFTs.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom component="div">
          No NFTs selected
        </Typography>
      </div>
    )
  }

  const getColumnDefinition = React.useCallback((setCurrentAsset: React.Dispatch<React.SetStateAction<SelectedAssetForSetup | null>>, nftSafeguards, editDisabled) => {
    return setCurrentAsset === null
      ? NFTGridColumnsDefinition
      : NFTGridSafeguardsColumnDefinition(setCurrentAsset, nftSafeguards, editDisabled);
  }, [setCurrentAsset]);

  return (
    <div>
      <DataGrid
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none'
          }
        }}
        columns={dashboard ? DashboardNFTGridDefinition : getColumnDefinition(setCurrentAsset, nftSafeguards, editDisabled)}
        rows={dashboard ? nftSafeguards : nfts.filter((row) => selectedNFTs.filter((selectedNFT) => selectedNFT.address === row.assetContract.address && row.tokenId === selectedNFT.tokenId).length > 0)}
        getRowId={(row) => row.assetContract.address + "_" + row.tokenId}
      />
    </div>
  )
};

export const SafeguardSelectionPage = ({ nextTab, prevTab }) => {
  const { state, dispatch } = useData();
  const { selectedTokens, selectedNFTs, userTokenBalances, userNFTs, tokenSafeguards, nftSafeguards, assetToEdit } = state;

  // This function will populate the threshold and wei value so we can still retain
  // the original user creation setup
  const nextTabHandler = () => {
    nextTab();
    dispatch({ type: ActionType.SET_TOKEN_SAFEGUARDS, payload: tokenSafeguardsTemp });
    dispatch({ type: ActionType.SET_NFT_SAFEGUARDS, payload: nftSafeguardsTemp });
  };

  const [showSetupPage, setShowSetupPage] = React.useState(false);

  const [tokenSafeguardsTemp, setTokenSafeguardsTemp] = React.useState<Safeguard[]>(tokenSafeguards);
  const [nftSafeguardsTemp, setNFTSafeguardsTemp] = React.useState<Safeguard[]>(nftSafeguards);
  // This holds the current asset that is being configured
  const [currentAsset, setCurrentAsset] = React.useState<SelectedAssetForSetup | null>(assetToEdit);
  const AssetsSetupCorrectly = useMemo(() => {
    const allTokensValid = selectedTokens.map((token) => token);
    const allAssetsValid = allTokensValid.every((asset) => {
      const tokenSafeguardsForAsset = tokenSafeguardsTemp.filter((safeguard) => safeguard.asset === asset);
      return tokenSafeguardsForAsset.some((safeguard) => safeguard.isEnabled && safeguard.isValid);
    });

    const allNFTs = selectedNFTs.map((nft) => nft);
    const allNFTsValid = allNFTs.every((nft) => {
      const safeguards = nftSafeguardsTemp.filter((safeguard) => safeguard.asset === nft.address && safeguard.id === nft.tokenId);
      return safeguards.some((safeguard) => safeguard.isEnabled && safeguard.isValid);
    });

    return allAssetsValid && allNFTsValid;
  }, [selectedTokens, tokenSafeguardsTemp, nftSafeguardsTemp, selectedNFTs]);

  useEffect(() => {
    if (currentAsset) {
      setShowSetupPage(true);
    }
  }, [currentAsset]);

  return (
    <>
      <Container>
        <Left>
          <UserWalletWidget />
        </Left>
        {showSetupPage ?
          <SafeguardSetupModal
            open={showSetupPage}
            setOpen={setShowSetupPage}
            currentAsset={currentAsset}
            setTokenSafeguards={setTokenSafeguardsTemp}
            tokenSafeguardsTemp={tokenSafeguardsTemp as Safeguard[]}
            setNFTSafeguards={setNFTSafeguardsTemp}
            nftSafeguardsTemp={nftSafeguardsTemp}
          />
          :
          null}
        <Right>
          <RoundedWhiteContainer>
            <Heading>Setup Safeguard for Selected Tokens &nbsp;
              <Tooltip title="Setup the method in which Saferoot will detect malicious transactions">
                <HelpIcon />
              </Tooltip>
            </Heading>

            <TokenGrid balances={userTokenBalances}
              selectedTokens={selectedTokens}
              tokenSafeguards={tokenSafeguardsTemp}
              setCurrentAsset={setCurrentAsset} />
          </RoundedWhiteContainer>
          {NFT_SUPPORT_ENABLED && selectedNFTs.length > 0 &&
            <RoundedWhiteContainer>
              <Heading>Setup Safeguard for Selected NFTs &nbsp;
                <Tooltip title="Setup the method in which Saferoot will detect malicious transactions">
                  <HelpIcon />
                </Tooltip>
              </Heading>
              <NFTGrid selectedNFTs={selectedNFTs}
                nfts={userNFTs}
                nftSafeguards={nftSafeguardsTemp}
                setCurrentAsset={setCurrentAsset} />
            </RoundedWhiteContainer>
          }
        </Right>
        <FixedNavigationBottomBar message="Setup Safeguards for each of your assets">
          <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
          <SimpleButton type={AssetsSetupCorrectly ? "primary" : "secondary"} onClick={nextTabHandler} disabled={!AssetsSetupCorrectly}>Save</SimpleButton>
        </FixedNavigationBottomBar>
      </Container>
    </>
  );
};