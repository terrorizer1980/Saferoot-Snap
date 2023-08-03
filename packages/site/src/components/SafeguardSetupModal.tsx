
import * as React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Lottie from 'lottie-react';
import animationData from '../assets/loader.json';
import { ASSET_TYPE } from '../constants';
import { Container, Left, Right, RoundedWhiteContainer } from "./OnboardingSteps/styles"
import { NFTSetup, TokenSetup } from './OnboardingSteps/SafeguardSetup';
import { NFT_SUPPORT_ENABLED } from '../config/environmentVariable';
import { useData } from '../hooks/DataContext';
import { ActionType } from '../hooks/actions';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "800px",
    height: "600px",
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: '25px',
};

export const SafeguardSetupModal = ({ open, setOpen, currentAsset, tokenSafeguardsTemp, setTokenSafeguards, nftSafeguardsTemp, setNFTSafeguards }) => {
    const { dispatch } = useData();
    const closeModal = () => {
        setOpen(false)
        dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: null })
    }
    return (
        <>
            <Modal
                open={open}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{ ...modalStyle, minHeight: '80vh' }} style={{ display: 'flex' }}>
                    {currentAsset && currentAsset.assetType === ASSET_TYPE.TOKEN && (
                        <Right>
                            <TokenSetup
                                setShowSetupPage={setOpen}
                                currentAsset={currentAsset}
                                tokenSafeguards={tokenSafeguardsTemp}
                                setTokenSafeguards={setTokenSafeguards}
                            />
                        </Right>
                    )}
                    {NFT_SUPPORT_ENABLED && (currentAsset && currentAsset.assetType === ASSET_TYPE.NFT) && (
                        <Right>
                            <NFTSetup
                                setShowSetupPage={setOpen}
                                currentAsset={currentAsset}
                                nftSafeguards={nftSafeguardsTemp}
                                setNFTSafeguards={setNFTSafeguards}
                            />
                        </Right>
                    )}
                </Box>
            </Modal>
        </>
    )
};