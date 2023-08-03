import React from 'react';
import { DataGrid, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useNetwork } from 'wagmi'

import { useData } from "../../../hooks/DataContext";
import { ActionType } from "../../../hooks/actions";
import { fetchSupportedTokensAndBalances, TokenBalance, SupportedToken, fetchTokenSafeguards } from './gridhelper';
import { TokenGridColumnsDefinition } from './columnDefinitions';
import { RoundedWhiteContainer } from '../styles';
import { Heading } from '../../../styling/styles';
import { Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { ethers } from 'ethers';
import { SAFEGUARD_TYPE } from '../SafeguardSetup';

interface TokenGridProps {
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: (selections: GridRowSelectionModel) => void;
}

// Grid component for allowing users to select tokens
export const TokenGrid: React.FC<TokenGridProps> = ({
  rowSelectionModel,
  setRowSelectionModel,
}) => {
  const { state, dispatch } = useData();
  const { userTokenBalances, tokenSafeguards, assetToAdd } = state;
  const setSupportedTokens = (supportedTokens: SupportedToken[]) => {
    dispatch({ type: ActionType.SET_SUPPORTED_TOKENS, payload: supportedTokens });
  };
  const setBalances = (balances: TokenBalance[]) => {
    dispatch({ type: ActionType.SET_USER_TOKEN_BALANCES, payload: balances });
  };

  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { ERC20Safeguards, ERC721Safeguards } = await fetchTokenSafeguards();

        dispatch({
          type: ActionType.SET_TOKEN_SAFEGUARDS, payload: ERC20Safeguards.map((safeguard) => {
            return {
              amount: Number(ethers.utils.formatEther(safeguard.threshold_value)),
              asset: safeguard.address,
              id: null,
              type: SAFEGUARD_TYPE.THRESHOLD,
              isEnabled: true,
              isValid: true,
            }
          })
        });

        dispatch({
          type: ActionType.SET_NFT_SAFEGUARDS, payload: ERC721Safeguards.map((safeguard) => {
            return {
              asset: safeguard.contract_address,
              id: safeguard.token_id,
              type: SAFEGUARD_TYPE.LOCK_ERC_721,
              isEnabled: true,
              isValid: true,
            }
          })
        })
        const { supportedTokens: st, balances: b } = await fetchSupportedTokensAndBalances(chain.id);
        setSupportedTokens(st.filter((token) => {
          const balance = b.find((balance) => balance.address === token.address);
          return balance && balance.balance > 0;
        }));
        setBalances(b.filter((balance) => balance.balance > 0));
      } catch (error) {
        console.error(`Error fetching supported tokens and balances: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (chain) {
      fetchData();
    }
  }, [chain]);

  return (
    <RoundedWhiteContainer>
      <Heading>Token Selection &nbsp;
        <Tooltip title="Select the tokens that Saferoot will protect">
          <HelpIcon />
        </Tooltip>
      </Heading>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <DataGrid
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none'
            }
          }}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          isRowSelectable={(params: GridRowParams) => {
            if (assetToAdd) return tokenSafeguards.find((safeguard) => safeguard.asset === params.id) ? false : true; 
            return true;
          }}
          columns={TokenGridColumnsDefinition}
          rows={userTokenBalances.map((tokenBalance) => {
            return {
              ...tokenBalance,
              protected: tokenSafeguards.find((safeguard) => safeguard.asset === tokenBalance.address) ? true : false
            };
          })}
          getRowId={(row) => (row as TokenBalance).address}
        />
      )}
    </RoundedWhiteContainer>
  );
}
