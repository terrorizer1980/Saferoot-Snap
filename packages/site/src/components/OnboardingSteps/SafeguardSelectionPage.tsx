import React from 'react';
import { SimpleButton } from '../SimpleButton';
import SafeguardSetup from '../newComponents/organisms/SafeguardSetup';
import FixedNavigationBottomBar from '../FixedNavigationBottomBar';
import { AssetGuard, AssetGuards } from '../../hooks/Assets/types';
import { ASSET_TYPE } from '../../constants';

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

export const SafeguardSelectionPage = ({ nextTab, prevTab, assetGuards, setAssetGuards }) => {

  const nextTabHandler = () => {
    nextTab();
  };

  const AssetsSetupCorrectly = (assetGuards: AssetGuards): boolean => {
    const { ERC20Assets, ERC721Assets } = assetGuards;
    const validateAsset = (asset: AssetGuard) => {
      if (asset.isSelected && !asset.isPreGuarded) {
            return asset.security && asset.security.length > 0;
        }
        return true;  
    };
    const areERC20AssetsValid = ERC20Assets.every(validateAsset);
    const areERC721AssetsValid = ERC721Assets.every(validateAsset);
    return areERC20AssetsValid && areERC721AssetsValid;
}

  return (
    <>
      <SafeguardSetup assetGuards={assetGuards} setAssetGuards={setAssetGuards} />
      <FixedNavigationBottomBar message="Setup Safeguards for each of your assets">
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton type={AssetsSetupCorrectly(assetGuards) ? "primary" : "secondary"} onClick={nextTabHandler} disabled={!AssetsSetupCorrectly(assetGuards)}>Save</SimpleButton>
      </FixedNavigationBottomBar>
    </>
  );
};