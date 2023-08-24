import { Modal } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  ActionButtons,
  ModalHeading,
  SelectionButtonContainer,
  SelectionModalRoot,
} from "./styles";
import { SelectionButton } from "../../atoms/SelectionButton";
import "./styles.css";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { useData } from "../../../../hooks/DataContext";
import { ETHEREUM_TOKEN_STANDARD, HttpStatusCode } from "../../../../constants";
import { ActionType } from "../../../../hooks/actions";
import { makeAPICall } from "../../../../hooks/API/helpers";
import { APICalls } from "../../../../hooks/API/types";

export type SelectionModalProps = {
  text: string;
  enableText?: string;
  disableText?: string;
  openModal?: boolean;
  onClickBoolean?: Dispatch<SetStateAction<boolean>>;
  setOpenModal?: Dispatch<SetStateAction<boolean>>;
  tokenType?: string;
  safeGuardId?: string;
  enabled?: boolean;
  refetch?: () => void;
};

export const handleResponse = (status: HttpStatusCode, dispatch, successCalls: () => void): void => {
  switch (status) {
    case HttpStatusCode.Unauthorized:
      dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Unauthorized to process - please log in again." } });
      return;

    case HttpStatusCode.TooManyRequests:
      dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Too many requests - please try again later." } });
      return;

    case HttpStatusCode.OK:
      dispatch({ type: ActionType.SET_LOADER, payload: { open: false, message: "" } });
      successCalls();
      return;

    default:
      break;
  }
}

export const SelectionModal = (props: SelectionModalProps) => {
  const { text, enableText = 'Enable', disableText = 'Disable', onClickBoolean, openModal, setOpenModal, tokenType, safeGuardId, enabled, refetch } = props;
  const { state, dispatch } = useData();

  const modifySafeguardAPI = async (tokenType, safeGuardId, enabled = null) => {
    try {
      if (tokenType === ETHEREUM_TOKEN_STANDARD.ERC721) {
        const { status } = await makeAPICall(APICalls.TOGGLE_NFT_SAFEGUARD,
          {
            safeGuardId
          },
          {
            enabled: !enabled
          }, dispatch)
        handleResponse(status, dispatch, () => {
          dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: null });
          refetch();
        });
      } else {
        const { status } = await makeAPICall(APICalls.TOGGLE_TOKEN_SAFEGUARD,
          {
            safeGuardId
          },
          {
            enabled: !enabled
          }, dispatch)
        handleResponse(status, dispatch, () => {
          dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: null });
          refetch();
        });
      }
    } catch (error) {
      dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Something went wrong on our end, please try again later." } })
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const onClickButton1 = () => {
    if (tokenType === ETHEREUM_TOKEN_STANDARD.ERC721 && safeGuardId) {
      modifySafeguardAPI(tokenType, safeGuardId, !enabled);
    }
    if (tokenType === ETHEREUM_TOKEN_STANDARD.ERC20 && safeGuardId) {
      modifySafeguardAPI(tokenType, safeGuardId);
    }
    onClickBoolean(true);
    closeModal();
  };

  const onClickButton2 = () => {
    onClickBoolean(false);
    closeModal();
  };
  return (
    <Modal
      open={openModal}
      onClose={onClickButton2}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="selection-modal-styles"
    >
      <SelectionModalRoot>
        <ModalHeading>
          <Typography {...TextStyle.blackExtraLargeLabel}>{text}</Typography>
        </ModalHeading>
        <ActionButtons>
          <SelectionButtonContainer>
            <Button
              onClick={() => {
                onClickButton1();
              }}
              text={enableText}
              border="rounded"
              bgColor={Color.neonGreen as string}
            />
          </SelectionButtonContainer>
          <SelectionButtonContainer>
            <Button
              onClick={() => {
                onClickButton2();
              }}
              text={disableText}
              border="rounded"
            />
          </SelectionButtonContainer>
        </ActionButtons>
      </SelectionModalRoot>
    </Modal>
  );
};
