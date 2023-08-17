import React from 'react';
import type { } from '@mui/x-data-grid/themeAugmentation';
import FixedNavigationBottomBar from '../FixedNavigationBottomBar';
import { SimpleButton } from '../SimpleButton';
import AssetSelection from '../newComponents/organisms/AssetSelection';

export const TokenSelectionPage = ({ nextTab, prevTab, assetGuards, setAssetGuards }) => {

  const [hasAssetsSelected, setHasAssetsSelected] = React.useState<boolean>(false);

  const handleConfirm = () => {
    nextTab();
  }

  const checkSelectedAssets = (assets) => {
    return assets.some((asset) => asset.isSelected)
  }

  React.useEffect(() => {
    setHasAssetsSelected(checkSelectedAssets(assetGuards.ERC20Assets) || checkSelectedAssets(assetGuards.ERC721Assets));
  }, [assetGuards]);

  const getSelectedAssetsCounts = (assets) => {
    return assets.filter((asset) => asset.isSelected).length
  }

  return (
    <>
      <AssetSelection assetGuards={assetGuards} setAssetGuards={setAssetGuards} />
      <FixedNavigationBottomBar
        message={`You've selected ${getSelectedAssetsCounts(assetGuards.ERC20Assets)} token(s) and ${getSelectedAssetsCounts(assetGuards.ERC721Assets)} NFTs.`}>
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton type={hasAssetsSelected ? "primary" : "secondary"} disabled={!hasAssetsSelected} onClick={() => handleConfirm()}>Next</SimpleButton>
      </FixedNavigationBottomBar>
    </>
  );
};