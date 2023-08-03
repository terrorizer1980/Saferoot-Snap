import React from "react";
import { GridColDef } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { TokenBalance, NFTData, DashboardView, } from "./gridhelper";
import styled from 'styled-components';
import { deepOrange, grey } from '@mui/material/colors';
import { NFTApprovalAndBackupSetup, Safeguard, TokenApprovalAndBackupSetup } from "../SafeguardSetup"
import { useData } from "../../../hooks/DataContext";
import { ActionType } from "../../../hooks/actions";
import { ASSET_TYPE } from "../../../constants";
import { SimpleButton } from "../../SimpleButton";
import { Address } from "wagmi";

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
      {safeguards?.map((safeguard, index) => {
        switch (safeguard.type) {
          case "threshold":
            return <Tooltip title={`Triggers when a transaction of ${token.symbol} over ${safeguard.amount}`}>
              <SafeguardsLI key={index}>Value {safeguard.amount} {token.symbol}</SafeguardsLI>
            </Tooltip>
          default:
            break;
        }
      })}
    </SafeguardsUL>
  )
}

export const TokenGridColumnsDefinition: GridColDef[] = [
  {
    field: "symbol",
    headerName: "Token",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      const { row } = params;
      const tokenBalance: TokenBalance = row as TokenBalance;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {tokenBalance.image && (
            <Tooltip title={`Contract Address: ${tokenBalance.address}`}>
              <Avatar
                alt={tokenBalance.symbol}
                src={tokenBalance.image}
                style={{
                  marginRight: 10,
                  width: 30,
                  height: 30,
                }}
              />
            </Tooltip>
          )}
          {tokenBalance.symbol}
        </div>
      );
    },
  },
  {
    field: "balance",
    headerName: "Your balance",
    type: "number",
    width: 150,
  },
  {
    field: "protected",
    headerName: "Protected",
    width: 150,
    renderCell: (params) => {
      const { row } = params;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {row.protected ? "Yes" : "No"}
        </div>
      );
    },
  },

];

export const TokenGridDashboardColumnsDefinition = (approvalStates, setApprovalStates) => [
  {
    field: "symbol",
    headerName: "Token",
    minWidth: 100,
    renderCell: (params) => {
      const { row } = params;
      const tokenBalance: TokenBalance = row as TokenBalance;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {tokenBalance.image && (
            <Tooltip title={`Contract Address: ${tokenBalance.address}`}>
              <Avatar
                alt={tokenBalance.symbol}
                src={tokenBalance.image}
                style={{
                  marginRight: 10,
                  width: 30,
                  height: 30,
                }}
              />
            </Tooltip>
          )}
          {tokenBalance.symbol}
        </div>
      );
    },
  },
  {
    field: "balance",
    headerName: "Balance",
    type: "number",
    width: 150,
  },
  {
    field: "safeguards",
    headerName: "Active Safeguards",
    width: 200,
    renderCell: (params) => {
      const { row } = params;
      const tokenBalance: DashboardView = row as DashboardView;
      // Filtered safeguards for the given asset
      const safeguards = tokenBalance.safeguards?.filter((safeguard: Safeguard) => {
        return safeguard.asset.toLowerCase() === tokenBalance.address.toLowerCase() && safeguard.isEnabled && safeguard.isValid;
      });
      if (safeguards?.length === 0) {
        return (
          <SafeguardList>No Safeguards configured</SafeguardList>
        )
      }
      return (
        <SafeguardGridList safeguards={safeguards} token={tokenBalance} />
      )
    },
  },
  {
    field: "isEnabled",
    headerName: "Status",
    type: "number",
    width: 100,
  },
  {
    field: "allowance",
    headerName: "Approvals",
    type: "number",
    width: 150,
    renderCell: (params) => {
      return (
        <TokenApprovalAndBackupSetup tokenAddress={params.row.address} upgradeAble={true} approvalStates={approvalStates} setApprovalStates={setApprovalStates} />
      )
    },
  },
  {
    field: "Edit Safeguard List",
    headerName: "",
    width: 100,
    renderCell: (params) => {
      const { row } = params;
      const { dispatch } = useData();
      return (
        <SimpleButton type="default" onClick={() => {
          dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: { assetType: ASSET_TYPE.TOKEN, address: row.address, id: null, symbol: row.symbol } })
        }}>Edit</SimpleButton>)
    },
  },
  {
    field: "Delete Safeguard List",
    headerName: "",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const { dispatch } = useData();
      return (
        <SimpleButton type="default" onClick={() => {
          dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: { assetType: ASSET_TYPE.TOKEN, address: row.address, id: 0, symbol: row.symbol, hash: row.safeguards[0].hash } })
        }}>Delete</SimpleButton>)
    },
  }
]
export const NFTGridColumnsDefinition: GridColDef[] = [
  {
    field: "NFT",
    headerName: "",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const NFT: NFTData = row as NFTData;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {NFT.imageUrl ? (
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              variant='square'
              alt={NFT.collection?.name}
              src={NFT.imageUrl}
              style={{ marginRight: 10, width: 60, height: 60 }}
            />
          ) : (
            <Avatar
              sx={{ bgcolor: grey[500] }}
              variant='square'
              alt={NFT.collection?.name}
              style={{ marginRight: 10, width: 60, height: 60 }}
            />
          )}

        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Collection",
    type: "string",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const NFT: NFTData = row as NFTData;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {NFT.collection?.name || "Unknown"}
        </div>
      );
    }
  },
  {
    field: "tokenId",
    headerName: "#ID",
    type: "string",
    width: 150,
  }
];

export const DashboardNFTGridDefinition = (approvalStates, setApprovalStates) => [
  {
    field: "NFT",
    headerName: "",
    width: 150,
    renderCell: (params) => {
      const { row } = params;
      const NFT: NFTData = row as NFTData;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {NFT.imageUrl ? (
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              variant='square'
              alt={NFT.collection?.name}
              src={NFT.imageUrl}
              style={{ marginRight: 10, width: 60, height: 60 }}
            />
          ) : (
            <Avatar
              sx={{ bgcolor: grey[500] }}
              variant='square'
              alt={NFT.collection?.name}
              style={{ marginRight: 10, width: 60, height: 60 }}
            />
          )}

        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Collection",
    type: "string",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const NFT: NFTData = row as NFTData;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {NFT.collection?.name || "Unknown"}
        </div>
      );
    }
  },
  {
    field: "tokenId",
    headerName: "#ID",
    type: "string",
    width: 150,
  },
  {
    field: "allowance",
    headerName: "Approvals",
    type: "number",
    width: 150,
    renderCell: (params) => {
      const { row } = params;
      const nftItem: NFTData = row as NFTData;
      return (
        <NFTApprovalAndBackupSetup
          assetContractAddress={nftItem.assetContract.address as Address}
          tokenId={nftItem.tokenId?.toString()}
          approvalStates={approvalStates}
          setApprovalStates={setApprovalStates}
          upgradeAble={true}
        />
      )
    },
  },
  {
    field: "Delete Safeguard List",
    headerName: "",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const { state, dispatch } = useData();
      if (row.enabled) {
        return (
          <SimpleButton type="default" onClick={() => {
            if (!state.assetToModify) {
              dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: { assetType: ASSET_TYPE.NFT, address: row.collection.name, id: row.tokenId, symbol: row.symbol, hash: row.hash, enabled: false } })
            }
          }}>Disable</SimpleButton>)
      }
      return (
        <SimpleButton type="primary" onClick={() => {
          if (!state.assetToModify) {
            dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: { assetType: ASSET_TYPE.NFT, address: row.collection.name, id: row.tokenId, symbol: row.symbol, hash: row.hash, enabled: true } })
          }
        }}>Enable</SimpleButton>)
    },
  }
];