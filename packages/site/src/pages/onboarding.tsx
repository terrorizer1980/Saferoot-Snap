import React, { useEffect } from 'react';
import {
  Container,
  CardContainer,
  StepsPages,
} from '../styling/styles';
import Navigation, { Step } from '../components/Navigation';
import { Page } from '../hooks/actions';
import { useData } from "../hooks/DataContext";
import { ActionType } from "../hooks/actions";
import {
  UserWalletPage,
  BackupWalletPage,
  TokenSelectionPage,
  SafeguardSelectionPage,
  SuccessPage,
} from '../components/OnboardingSteps';
import WalletSwitchErrorPage from '../components/WalletSwitchErrorPage';
import { navigate } from 'gatsby';
import "../styling/font.css";
import { NAVIGATION_PATHS } from '../constants';
import useAssetGuards from '../hooks/Assets/useAssetGuards';
import DeployContractApproval from '../components/newComponents/organisms/DeployContractApproval';
import { useContractInteraction } from '../hooks/ContractInteractions/useContractInteraction';

const Onboarding = () => {
  const { state, dispatch } = useData();
  const { selectedTab, steps, assetToEdit } = state;

  function changeDisabledStatus(array: Step[], nextPageType: Page, currentPageType: Page, newDisabledStatus: boolean) {
    return array.map(item => {
      if (item.pageType === nextPageType) {
        return { ...item, disabled: newDisabledStatus };
      } else if (item.pageType === currentPageType) {
        return { ...item, completed: true, disabled: false }
      } else {
        return item;
      }
    });
  }
  const setSelectedTabAndMarkAsCompleted = (nextTab: Page, currentTab: Page) => {
    const newStatuses = changeDisabledStatus(steps, nextTab, currentTab, false);
    dispatch({ type: ActionType.SET_STEP_STATUS, payload: newStatuses });
    dispatch({ type: ActionType.SET_SELECTED_TAB, payload: nextTab });
  };

  const setSelectedTab = (tab: Page) => {
    dispatch({ type: ActionType.SET_SELECTED_TAB, payload: tab });
  };

  useEffect(() => {
    // if selectedTab === Page.Success, 
    // then we need to navigate() the user to /management page
    // after 3 seconds
    if (selectedTab === Page.Success) {
      setTimeout(() => {
        navigate(NAVIGATION_PATHS.DASHBOARD);
      }, 3000)
    }
  }, [selectedTab]);

  const { assetGuards, setAssetGuards } = useAssetGuards()
  const { createSaferootWithSafeguardsTx, addSafeguardTx } = useContractInteraction(assetGuards)

  return (
    <Container>
      <WalletSwitchErrorPage />
      <CardContainer>
        {!(assetToEdit || selectedTab === Page.Success || selectedTab === Page.Connect) ? <Navigation /> : <></>}
        <StepsPages>
          {selectedTab === Page.UserWallet ? <UserWalletPage
            prevTab={() => setSelectedTab(Page.Connect)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.Tokens, Page.UserWallet)} /> : null}
          {selectedTab === Page.Tokens ? <TokenSelectionPage
            assetGuards={assetGuards}
            setAssetGuards={setAssetGuards}
            prevTab={() => setSelectedTab(Page.UserWallet)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.Safeguards, Page.Tokens)} /> : null}
          {selectedTab === Page.Safeguards ? <SafeguardSelectionPage
            assetGuards={assetGuards}
            setAssetGuards={setAssetGuards}
            prevTab={() => setSelectedTab(Page.Tokens)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.BackupWallet, Page.Safeguards)} /> : null}
          {selectedTab === Page.BackupWallet ? <BackupWalletPage
            prevTab={() => setSelectedTab(Page.Safeguards)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.DeployContract, Page.BackupWallet)} /> : null}
          {selectedTab === Page.DeployContract && assetGuards ? <DeployContractApproval
            createSaferootWithSafeguardsTx={createSaferootWithSafeguardsTx}
            addSafeguardTx={addSafeguardTx}
            assetGuards={assetGuards}
            setAssetGuards={setAssetGuards}
            prevTab={() => setSelectedTab(Page.BackupWallet)}
            nextTab={() => navigate(NAVIGATION_PATHS.DASHBOARD)} /> : null}
          {selectedTab === Page.Success ? <SuccessPage /> : null}
        </StepsPages>
      </CardContainer>
    </Container >
  );
};

export default Onboarding;
