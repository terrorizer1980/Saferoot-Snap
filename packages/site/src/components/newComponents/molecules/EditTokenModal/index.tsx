import { Modal } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActionButtons,
  ModalHeading,
  ModalRoot,
  ModalSafeguardAssetInfo,
  ModalSafeguardCards,
  SelectionButtonContainer,
} from "./styles";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { SafeguardCard } from "../SafeguardCard";
import { CoinId } from "../../atoms/CoinId";
import { AvatarId } from "../../atoms/AvatarId";
import { AssetTypes } from "../../constants";
import { useData } from "../../../../hooks/DataContext";
import { ActionType } from "../../../../hooks/actions";
import { ethtoWeiString } from "../../../../blockchain/helpers/ethtoWeiString";
import { AssetGuard, AssetGuards, updateAssetProperties } from "../../../../hooks/Assets/useAssetGuards";
import { SimpleButton } from "../../../SimpleButton";
import { handleResponse } from "../SelectionModal";
import { makeAPICall } from "../../../../hooks/API/helpers";
import { APICalls } from "../../../../hooks/API/types";
import { HttpStatusCode } from "../../../../constants";

export type EditTokenModalProps = {
  type: string;
  data?: AssetGuard;
  onClose?: () => void;
  openModal?: boolean;
  setOpenModal?: Dispatch<SetStateAction<boolean>>;
  refetch?: () => void;
  setData?: React.Dispatch<React.SetStateAction<AssetGuards>>;
};

export const EditTokenModal = (props: EditTokenModalProps) => {
  const { dispatch } = useData();
  const { type, data, onClose, openModal, setOpenModal, refetch, setData } = props;

  const getDesiredValue = () => {
    if (data?.safeguards?.length == 0 && data?.safeguards[0]?.value) {
      return data.safeguards[0].value
    }
    return null
  }
  const [desiredThreshold, setDesiredThreshold] = useState(getDesiredValue);

  const editSafeguardAPI = async (address, safeGuardId, value) => {
    try {
      const { status } = await makeAPICall(APICalls.EDIT_TOKEN_SAFEGUARD,
        {
          safeGuardId
        },
        {
          contractAddress: address,
          value_limit: ethtoWeiString(Number(value)),
        }, dispatch)
      handleResponse(status, dispatch, () => {
        dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: null });
        refetch();
        onClickClose();
      });
    } catch (error) {
      dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Something went wrong on our end, please try again later." } })
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const onClickClose = () => {
    onClose();
    closeModal();
  };

  const dispatchNeedForSafeguard = (setData) => {
    if (type == AssetTypes.Token && setData) {
      updateAssetProperties(setData, "ERC20Assets", { address: data?.address }, { security: ["Threshold Value: " + desiredThreshold], safeguards: [{ type: "threshold", value: desiredThreshold }] });
    }
    if (type == AssetTypes.NFT && setData) {
      updateAssetProperties(setData, "ERC721Assets", { address: data?.address, tokenId: data?.tokenId }, { security: ["Lock"] });
    }
    onClickClose();
  }

  const isValidAmount = (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }
    const regex = /^\d*(\.\d{1,18})?$/;
    if (regex.test(value) && parseFloat(value) > 0) {
      return true;
    }
    return false;
  }

  return (
    <Modal
      open={openModal}
      onClose={onClickClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="selection-modal-styles"
    >
      <ModalRoot>
        <ModalHeading>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {"Setup safeguards for " + data.asset.name}
          </Typography>
        </ModalHeading>

        <ModalHeading>
          <Typography {...TextStyle.blackMediumLabel} {...TextStyle.boldText}>
            {"Asset"}
          </Typography>
        </ModalHeading>

        <ModalSafeguardAssetInfo>
          {type == AssetTypes.Token ? <CoinId id={data.asset.name} /> : <AvatarId id={data.asset.name} image={data.asset.image} />}
          {type == AssetTypes.NFT && <div>
            <Typography
              {...TextStyle.headingColorMediumLabel}
              {...TextStyle.opacity}
            >
              COLLECTION
            </Typography>
            <Typography {...TextStyle.blackMediumLabel} {...TextStyle.boldText}>
              {data.collection}
            </Typography>
          </div>}
          {type == AssetTypes.Token && <div>
            <Typography
              {...TextStyle.headingColorMediumLabel}
              {...TextStyle.opacity}
            >
              BALANCE
            </Typography>
            <Typography {...TextStyle.blackMediumLabel} {...TextStyle.boldText}>
              {data.balance}
            </Typography>
          </div>}
        </ModalSafeguardAssetInfo>

        <ModalHeading>
          <Typography {...TextStyle.blackMediumLabel} {...TextStyle.boldText}>
            {"Choose type of safeguard (Security)"}
          </Typography>
        </ModalHeading>
        <Typography
          {...TextStyle.errorText}
        >
          {desiredThreshold && !isValidAmount(desiredThreshold) && "The amount entered is invalid!"}
        </Typography>
        <ModalSafeguardCards>
          {type == AssetTypes.Token && (
            <SafeguardCard
              type={AssetTypes.Token}
              subText="Trigger a transfer if a transaction exceeds a specified amount for this token."
              name={data.asset.name}
              presentThreshold={desiredThreshold}
              setDesiredThreshold={setDesiredThreshold}
            />
          )}
          {type == AssetTypes.NFT && (
            <SafeguardCard
              type={AssetTypes.NFT}
              subText="Locks the NFT and transfers it to your self-assigned backup wallet."
              name={"NFT-Lock"}
              presentThreshold={desiredThreshold}
              setDesiredThreshold={setDesiredThreshold}
            />
          )}
        </ModalSafeguardCards>
        <ActionButtons>
          <SelectionButtonContainer>
            <SimpleButton
              type="primary"
              disabled={type == AssetTypes.Token && !isValidAmount(desiredThreshold)}
              onClick={() => {
                if (!data?.isPreGuarded) {
                  dispatchNeedForSafeguard(setData)
                } else {
                  editSafeguardAPI(data.address, data.safeguardID, desiredThreshold);
                }
              }}
            >Confirm</SimpleButton>
          </SelectionButtonContainer>
          <SelectionButtonContainer>
            <SimpleButton
              type="default"
              onClick={onClickClose}>
              Cancel
            </SimpleButton>
          </SelectionButtonContainer>
        </ActionButtons>
      </ModalRoot>
    </Modal>
  );
};
