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
  ConnectPage,
  UserWalletPage,
  BackupWalletPage,
  TokenSelectionPage,
  SafeguardSelectionPage,
  ReviewPage,
  SuccessPage,
  DeployContractPage
} from '../components/OnboardingSteps';
import WalletSwitchErrorPage from '../components/WalletSwitchErrorPage';
import { navigate } from 'gatsby';
import "../styling/font.css";
import styled from 'styled-components';
import { NAVIGATION_PATHS } from '../constants';

const CustomText = styled.p`
  font-family: Stolzl-Regular;
  font-size: 40px;
`;

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

  const resetFrontRoute = () => {
    if (true) { // placeholder condition to enable faster asset addition 
      setSelectedTabAndMarkAsCompleted(Page.BackupWallet, Page.Safeguards)
    } else {
      setSelectedTabAndMarkAsCompleted(Page.Review, Page.Safeguards)
    }
  }

  const resetBackRoute = () => {
    if (true) { // placeholder condition to enable faster asset addition
      setSelectedTab(Page.DeployContract)
    } else {
      setSelectedTab(Page.Safeguards)
    }
  }

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

  return (
    <Container>
      <WalletSwitchErrorPage />
      <CardContainer>
        {!(assetToEdit || selectedTab === Page.Success || selectedTab === Page.Connect) ? <Navigation /> : <></>}
        <StepsPages>
          {selectedTab === Page.Connect ? <ConnectPage
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.UserWallet, Page.Connect)} /> : null}
          {selectedTab === Page.UserWallet ? <UserWalletPage
            prevTab={() => setSelectedTab(Page.Connect)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.Tokens, Page.UserWallet)} /> : null}
          {selectedTab === Page.Tokens ? <TokenSelectionPage
            prevTab={() => setSelectedTab(Page.UserWallet)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.Safeguards, Page.Tokens)} /> : null}
          {selectedTab === Page.Safeguards ? <SafeguardSelectionPage
            prevTab={() => setSelectedTab(Page.Tokens)}
            nextTab={() => resetFrontRoute()} /> : null}
          {selectedTab === Page.BackupWallet ? <BackupWalletPage
            prevTab={() => setSelectedTab(Page.Safeguards)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.DeployContract, Page.BackupWallet)} /> : null}
          {selectedTab === Page.DeployContract ? <DeployContractPage
            prevTab={() => setSelectedTab(Page.BackupWallet)}
            nextTab={() => setSelectedTabAndMarkAsCompleted(Page.Review, Page.DeployContract)} /> : null}
          {selectedTab === Page.Review ? <ReviewPage
            prevTab={() => resetBackRoute()}
            setSelectedTab={setSelectedTabAndMarkAsCompleted} /> : null}
          {selectedTab === Page.Success ? <SuccessPage /> : null}
        </StepsPages>
      </CardContainer>
    </Container >
  );
};

export default Onboarding;
