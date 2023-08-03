import React from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import type { } from '@mui/x-data-grid/themeAugmentation';
import { useData } from "../../hooks/DataContext";
import { NFTGrid } from './Tables/NFTGrid';
import { TokenGrid } from './Tables/TokenGrid';
import { Container, Left, Right } from './styles';
import FixedNavigationBottomBar from '../FixedNavigationBottomBar';
import { UserWalletWidget } from '../UserWalletWidget';
import { NFT_SUPPORT_ENABLED } from '../../config/environmentVariable';
import { SelectedNFTToken } from './Tables/gridhelper';
import { ActionType } from '../../hooks/actions';
import { SimpleButton } from '../SimpleButton';


export const TokenSelectionPage = ({ nextTab, prevTab }) => {
  const { state, dispatch } = useData();
  const userWallet = state.userWallet;
  const [userTokenSelection, setUserTokenSelection] =
    React.useState<GridRowSelectionModel>([]);
  const [userNFTSelection, setUserNFTSelection] = React.useState<SelectedNFTToken[]>([]);
  const [hasAssetsSelected, setHasAssetsSelected] = React.useState<boolean>(false);

  const handleConfirm = () => {
    dispatch({ type: ActionType.SET_SELECTED_NFTS, payload: userNFTSelection });
    dispatch({ type: ActionType.SET_SELECTED_TOKENS, payload: userTokenSelection as string[] });
    nextTab();
  }

  React.useEffect(() => {
    setHasAssetsSelected(userTokenSelection.length > 0 || userNFTSelection.length > 0);
  }, [userTokenSelection, userNFTSelection]);

  return (
    <Container>
      <Left>
        <UserWalletWidget />
      </Left>
      <Right>
        <TokenGrid rowSelectionModel={userTokenSelection} setRowSelectionModel={setUserTokenSelection} />
        {NFT_SUPPORT_ENABLED &&
          <NFTGrid walletAddress={userWallet} selectedNFTs={userNFTSelection} setSelectedNFTs={setUserNFTSelection} />}
      </Right>
      <FixedNavigationBottomBar
        message={`You've selected ${userTokenSelection.length} token(s)${NFT_SUPPORT_ENABLED ? ` and ${Object.values(userNFTSelection).filter((checked) => checked).length} NFTs` : ''}.`}>
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton type={hasAssetsSelected ? "primary" : "secondary"} disabled={!hasAssetsSelected} onClick={() => handleConfirm()}>Select Assets</SimpleButton>
      </FixedNavigationBottomBar>
    </Container>
  );
};