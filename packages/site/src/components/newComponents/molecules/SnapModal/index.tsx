import { Modal } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  ActionButtons,
  ModalHeading,
  SelectionButtonContainer,
  SelectionModalRoot,
} from "../SelectionModal/styles"
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { connectSnap, getSnap } from "../../../../utils";
import { ActionType } from "../../../../hooks/actions";
import { useData } from "../../../../hooks/DataContext";

export type SnapModalProps = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export const SnapModal = (props: SnapModalProps) => {

  const { openModal, setOpenModal } = props
  const { state, dispatch } = useData();

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: ActionType.SET_SNAPS_INSTALLED,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: ActionType.SET_MM_FLASK_ERROR, payload: e });
    }
  };

  useEffect(() => {
    if (state.installedSnap) {
      setOpenModal(false)
    }
  }, [state.installedSnap])

  return (
    <Modal
      open={openModal}
      onClose={() => { setOpenModal(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="selection-modal-styles"
    >
      <SelectionModalRoot>
        <ModalHeading>
          <Typography {...TextStyle.blackExtraLargeLabel}>Saferoot Metamask</Typography>
        </ModalHeading>
        <Typography {...TextStyle.blackMediumLabel}>Let this snap notify you when you when you need further details for onboarding steps.</Typography>
        <br /><br />
        <ActionButtons>
          <SelectionButtonContainer>
            <Button
              onClick={() => {
                handleConnectClick()
              }}
              text={"Install Snap"}
              border="rounded"
              bgColor={Color.neonGreen as string}
            />
          </SelectionButtonContainer>
        </ActionButtons>
      </SelectionModalRoot>
    </Modal>
  );
};
