import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Heading, Subtitle } from '../styling/styles';
import { useData } from '../hooks/DataContext';
import { watchAccount } from '@wagmi/core'

import { useAuth } from '../hooks';
import Cookies from "js-cookie";
import { navigate } from 'gatsby';
import { NAVIGATION_PATHS } from '../constants';
import { ActionType, Page } from '../hooks/actions';
import { SimpleButton } from './SimpleButton';


const FullScreenError = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  z-index: 1000;
`;

const FullScreenErrorContainer = styled.div`
width: 50%;`

const WalletSwitchErrorPage = () => {
  const { state, dispatch } = useData();
  const { authenticated } = useAuth();
  const { userWallet } = state;
  const [currentUserAddress, setCurrentUserAddress] = useState(null);
  const [open, setOpen] = useState(false);
  // In the case that currentUserAddress is null, we set it to the address of the wallet as
  useEffect(() => {
    if (authenticated && currentUserAddress === null) {
      setCurrentUserAddress(userWallet);
    }
  }, [authenticated]);

  watchAccount((account) => {
    Cookies.set('activeAddress', account.address, { expires: 1 / 288, sameSite: 'strict', secure: true });
    if (currentUserAddress && (account.address !== currentUserAddress) && authenticated) {
      setOpen(true);
      dispatch({ type: ActionType.SET_SELECTED_TAB, payload: Page.Success })
      navigate(NAVIGATION_PATHS.ONBOARDING)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setOpen(false);
    }
  });

  useEffect(() => {
    if (currentUserAddress === Cookies.get('activeAddress')) {
      setOpen(false);
    }
  }, [currentUserAddress]);

  return (
    <>
      {open ? (
        <FullScreenError>
          <FullScreenErrorContainer>
            <Heading>Looks like you switched accounts on your wallet, did you mean to do that?</Heading>
            <br />
            <Subtitle>Change back to your original account {currentUserAddress} to continue</Subtitle>
            <br />
            <Subtitle>If you meant to protect this account instead of the account you started with, click on restart below to start with this account</Subtitle>
            <br />
            <a href="./">
              <SimpleButton>Restart with your new wallet</SimpleButton>
            </a>
            <br />
          </FullScreenErrorContainer>
        </FullScreenError>
      ) : <></>}
    </>
  );
};

export default WalletSwitchErrorPage;