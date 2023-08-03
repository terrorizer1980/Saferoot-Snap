import React, { useEffect } from 'react';
import { Heading, Subtitle } from '../../styling/styles';
import {
  EthereumAddressInput,
} from '..';

import { useData } from "../../hooks/DataContext";
import { ActionType } from "../../hooks/actions";
import { ethers } from "ethers";

import { Container, Left, Right, RoundedWhiteContainer } from "./styles";
import FixedNavigationBottomBar from "../FixedNavigationBottomBar";
import { UserWalletWidget } from "../UserWalletWidget";
import { Tooltip } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { SimpleButton } from '../SimpleButton';

export const BackupWalletPage = ({ nextTab, prevTab }) => {
  const { state, dispatch } = useData();
  const setBackupWallet = (address: string) => {
    dispatch({ type: ActionType.SET_BACKUP_WALLET, payload: address });
  };

  const nextTabHandler = () => {
    if (
      ethers.utils.isAddress(state.backupWallet) &&
      state.backupWallet !== state.userWallet
    ) {
      nextTab();
    }
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setBackupWallet(text);
  };

  return (
    <Container>
      <Left>
        <UserWalletWidget />
      </Left>
      <Right>
        <RoundedWhiteContainer style={{ maxWidth: "1200px" }}>
          <Heading>Designate a backup wallet &nbsp;
            <Tooltip title="This address will be where your funds and assets will be moved to in the event a safeguard is triggered. The address must be a valid ethereum address as Saferoot is only on the ethereum network">
              <HelpIcon />
            </Tooltip>
          </Heading>
          <Subtitle style={{ marginBottom: "30px" }}>
            Your funds and assets will be transferred to this Ethereum address if a safeguard is triggered
          </Subtitle>
          <EthereumAddressInput
            address={state.backupWallet}
            setAddress={setBackupWallet}
            checkForConflict
          />
          <br />
          <SimpleButton type="primary" onClick={handlePaste} disabled={ethers.utils.isAddress(state.backupWallet)}>Paste</SimpleButton>
        </RoundedWhiteContainer>
      </Right>
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
    </Container>
  );
};
