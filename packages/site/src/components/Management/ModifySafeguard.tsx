import * as React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; import Modal from '@mui/material/Modal';
import { Heading } from '../../styling/styles';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import { useData } from '../../hooks/DataContext';
import { ActionType } from '../../hooks/actions';
import { SimpleButton } from '../SimpleButton';
import { ASSET_TYPE, HttpStatusCode } from '../../constants';
import { ethers } from 'ethers';
import { default as SaferootABI } from "../../blockchain/abi/SaferootABI.json";
import { useEffect } from 'react';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "800px",
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: '25px',
};

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export type callAPIProps = {
    should: boolean,
    asset: ASSET_TYPE,
    id: number,
}

export const DeleteSafeGuard = () => {

    const { state, dispatch } = useData();
    const { assetToModify } = state;
    const [open, setOpen] = React.useState(assetToModify !== null);
    const assetToModifyRef = React.useRef(null);
    const apiCallAllowed = React.useRef(false);

    useEffect(() => {
        assetToModifyRef.current = assetToModify ? { ...assetToModify } : null;
    }, [assetToModify]);

    React.useEffect(() => {
        setOpen(assetToModify !== null)
    }, [assetToModify]);

    function encodeKey(tokenType, id) {
        if (tokenType === undefined || id === undefined) {
            throw new Error('TokenType or ID is undefined');
        }
        tokenType = Number(tokenType);
        id = Number(id);
        if (isNaN(tokenType) || isNaN(id)) {
            throw new Error('TokenType or ID is not a number');
        }
        const tokenTypeBits = BigInt(tokenType) << BigInt(248);
        const idBits = BigInt(id);
        const key = tokenTypeBits | idBits;
        return '0x' + key.toString(16).padStart(64, '0');
    }

    const deleteSafeguard = async () => {
        dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Safeguard modification in progress" } })
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const deployedSaferootContract = new ethers.Contract(
                state.deployedSaferootAddress,
                SaferootABI,
                signer
            );
            const tx = await deployedSaferootContract.editSafeguard(
                [{
                    key: assetToModify.hash,
                    newAmount: 0,
                    newTokenId: assetToModify.assetType === ASSET_TYPE.NFT && assetToModify.enabled ? assetToModify.id : 0,
                }]
            );
            apiCallAllowed.current = true;
            await tx.wait();
        } catch (error) {
            console.log(error)
        }
    }

    function decodeKey(encodedKey: string): [ASSET_TYPE, number] {
        const key = BigInt(encodedKey);
        const tokenType = Number((key >> BigInt(248)) & BigInt(0xff));
        const id = Number(key & BigInt("0x0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
        return [tokenType, id];
    }

    const modifySafeguardAPI = async (tokenType, safeGuardId, enabled = null) => {
        try {
            const result = await fetch(
                `http://localhost:5433/v0/safeguard/${safeGuardId}/${tokenType}/`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        enabled: enabled,
                    }),
                    credentials: "include",
                }
            );

            if (result.status === HttpStatusCode.Unauthorized) {
                dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Unauthorized to process - please log in again." } })
                return;
            }

            if (result.status === HttpStatusCode.TooManyRequests) {
                dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Too many requests - please try again later." } })
                return;
            }

            if (result.status === HttpStatusCode.OK) {
                dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: null })
                dispatch({ type: ActionType.SET_LOADER, payload: { open: false, message: "" } })
                return;
            } else {
                dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Could not delete safeguard, please try again." } })
            }
        } catch (error) {
            dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: "Something went wrong on our end, please try again later." } })
        }
    };

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const deployedSaferootContract = new ethers.Contract(
            state.deployedSaferootAddress,
            SaferootABI,
            signer
        );
        deployedSaferootContract.on("ERC20SafeguardEdited", (eventData) => {
            const [tokenType, id] = decodeKey(eventData);
            if ((tokenType !== ASSET_TYPE.TOKEN) || (assetToModifyRef.current == null)) {
                return;
            }
            if (apiCallAllowed.current) {
                modifySafeguardAPI("ERC20", eventData)
            }
            apiCallAllowed.current = false
        });
        deployedSaferootContract.on("ERC721SafeguardEdited", (eventData) => {
            const [tokenType, id] = decodeKey(eventData);
            if ((tokenType !== ASSET_TYPE.NFT) || (assetToModifyRef.current == null)) {
                return;
            }
            if (apiCallAllowed.current) {
                modifySafeguardAPI("ERC721", eventData, assetToModifyRef.current.enabled)
            }
            apiCallAllowed.current = false
        });
    }, [])

    const closeModal = () => {
        setOpen(false)
        dispatch({ type: ActionType.SET_ASSET_TO_MODIFY, payload: null })
    }

    return (
        <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
                <Heading>
                    Confirm {assetToModify?.assetType == ASSET_TYPE.NFT ? ((!assetToModify?.enabled) ? "disable" : "enable") : "remove"} safeguard for {assetToModify?.assetType == ASSET_TYPE.NFT ? assetToModify.address : assetToModify?.symbol}? &nbsp;
                    <Tooltip title="Confirm these are the assets you will delete the safeguard for">
                        <HelpIcon />
                    </Tooltip>
                </Heading>
                <ActionButtonGroup>
                    <SimpleButton onClick={closeModal}>Cancel</SimpleButton>
                    <SimpleButton onClick={deleteSafeguard}>Confirm</SimpleButton>
                </ActionButtonGroup>
            </Box>
        </Modal>
    )
}