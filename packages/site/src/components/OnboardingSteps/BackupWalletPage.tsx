import React from 'react';
import { useData } from "../../hooks/DataContext";
import { ethers } from "ethers";

import FixedNavigationBottomBar from "../FixedNavigationBottomBar";
import { SimpleButton } from '../SimpleButton';
import BackupWallet from '../newComponents/organisms/BackupWallet';

export const BackupWalletPage = ({ nextTab, prevTab }) => {
  
  const { state } = useData();

  const nextTabHandler = () => {
    if (
      ethers.utils.isAddress(state.backupWallet) &&
      state.backupWallet !== state.userWallet
    ) {
      nextTab();
    }
  };

  return (
    <>
      <BackupWallet/>
      <FixedNavigationBottomBar>
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton
          type={"primary"}
          onClick={nextTabHandler}
          disabled={
            !ethers.utils.isAddress(state.backupWallet) ||
            !(state.backupWallet !== state.userWallet)
          }
        >
          Next
        </SimpleButton>
      </FixedNavigationBottomBar>
    </>
  );
};
