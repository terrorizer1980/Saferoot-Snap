
import * as React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Lottie from 'lottie-react';
import animationData from '../assets/loader.json';

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

export const LoaderModal = ({ open, message }) => {
    return (
        <Modal
            open={open}
            onClose={(reason) => { }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={modalStyle} style={{ display: 'flex', alignItems: 'center' }}>
                <Lottie
                    style={{ width: '300px', height: '300px' }}
                    animationData={animationData}
                />
                <Typography id="modal-modal-description" sx={{ mt: 2, flex: 1 }}>
                    {message}
                </Typography>
            </Box>
        </Modal>
    )
};