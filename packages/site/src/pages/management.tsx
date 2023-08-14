import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  Container,
} from '../styling/styles';
import { useAuth } from '../hooks';
import { getLocalStorage } from '../utils';
import { UserWalletWidget } from '../components/UserWalletWidget';
import AccountSummaryWidget from '../components/Management/AccountSummaryWidget';
import { AccountInformationTable } from '../components/Management/AccountInformationTable';
import { DeleteSafeGuard } from '../components/Management/ModifySafeguard';
import WalletSwitchErrorPage from '../components/WalletSwitchErrorPage';
import useAssetGuards from '../hooks/Assets/useAssetGuards';
import Dashboard from '../components/newComponents/organisms/Dashboard';
import { useContractInteraction } from '../hooks/ContractInteractions/useContractInteraction';

const ThreeComponentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
`;

const HeaderComponentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  height: 204px;
  width: 350px;
  background-color: #ffffff;
  border-radius: 8px;
  1px solid rgb(229, 229, 229);
  padding: 10px;
  `;


const Management = () => {
  useEffect(() => {
    const authenticatedAddress = getLocalStorage('authenticated-address');
    if (authenticatedAddress) {
      setAuthenticated(true);
    }
  }, []);
  // useContractInteraction();
  const { setAuthenticated } = useAuth();

  return (
    <Dashboard />
  );
};

export default Management;
