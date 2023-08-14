import React, { useEffect, useState } from "react";
import {
  BackupWalletAddress,
  BackupWalletInput,
} from "./styles";
import { WalletCard } from "../../molecules";
import { GenericInfoContainer, GenericInfoHeading, GenericInfoSubText, GenericRoot, GenericWalletCardContainer } from "../commonStyles";
import { TextStyle } from "../../globalStyles";
import { Typography } from "../../atoms/Typography";
import { RoundedInput } from "../../atoms/RoundedInput";
import { useData } from "../../../../hooks/DataContext";
import { ActionType } from "../../../../hooks/actions";

const BackupWallet = () => {

  const { dispatch } = useData();
  const [text, setText] = useState("");
  const setBackupWallet = (address: string) => {
    dispatch({ type: ActionType.SET_BACKUP_WALLET, payload: address });
  };

  useEffect(() => {
    setBackupWallet(text);
  }, [text]);

  return (
    <GenericRoot>
      <GenericWalletCardContainer>
        <WalletCard
          amount="11,1688.13"
          coinAmount="68.3"
          network="ethereum marriot"
        />
      </GenericWalletCardContainer>

      <GenericInfoContainer>
        <GenericInfoHeading>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            Assign a Backup Wallet
          </Typography>
        </GenericInfoHeading>

        <GenericInfoSubText>
          <Typography {...TextStyle.headingColorMediumLabel}>
            To finish connecting, you must sign a message in your wallet to
            verify that you are the owner of this account.
          </Typography>
        </GenericInfoSubText>

        <BackupWalletAddress>
          <BackupWalletInput>
            <RoundedInput placeholder="Wallet address" pasteOption text={text} setText={setText} />
          </BackupWalletInput>
        </BackupWalletAddress>
      </GenericInfoContainer>
    </GenericRoot>
  );
};

export default BackupWallet;
