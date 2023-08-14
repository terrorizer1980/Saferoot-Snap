import React, { useEffect, useState } from 'react';
import { useData } from '../hooks/DataContext';
import { ActionType } from '../hooks/actions';
import styled from 'styled-components';
import { Page } from '../hooks/actions';

const NavigationContainer = styled.div`
  display: contents;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  max-width: 1000px;
`;
const NavigationStationContainer = styled.div`
  display: flex;
  position: relative;
  top: -11.5px;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
  width: 100%;
  height: 100px;
`;

const NavigationItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  cursor: pointer; 
`;

const NavigationItemTitle = styled.div`
  text-align: center;
  transition: background-color 0.3s ease-out; // Add a transition for smooth effect
  &:hover {
    background-color: #f4f4f4; // Light gray color on hover
  }
`;
const ProgressBarContainer = styled.div`
  display: block;
  width: 90%;
  margin: auto;
  height: 2px;
  background-color: #eee;
  border-radius: 5px;
`;

interface ProgressBarProps {
  width: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  display: block;
  width: ${props => props.width}%;
  height: 2px;
  background-color: #000;
  border-radius: 5px;
  transition: width 0.3s ease-out; // Add a transition to the width property
`;

interface CircleProps {
  selectedTab: Page;
  completed: boolean;
}

const Circle = styled.div <CircleProps>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: ${props => props.selectedTab || props.completed ? '#000' : '#eee'};

  &:hover {
    background-color: ${props => props.selectedTab ? '#000' : props.completed ? '#000' : '#eee'};
    color: ${props => props.selectedTab || props.completed ? '#000' : '#000'};
  }
`;

export interface Step {
  step: number;
  pageType: Page;
  disabled: boolean;
  completed: boolean;
}

const NavigationItem = ({ label, title, onClick, selectedTab, completed }) => {
  return (
    <NavigationItemContainer onClick={onClick}>
      <Circle selectedTab={selectedTab} completed={completed}>
        {completed ? '✓' : label}
      </Circle>
      <NavigationItemTitle>{title}</NavigationItemTitle>
    </NavigationItemContainer>
  );
};

const Navigation = () => {
  const [progress, setProgress] = useState(0);
  const { state, dispatch } = useData();
  const { selectedTab, steps } = state;
  // The order of this below is important to the calculation of the progress bar
  const pages = [Page.UserWallet, Page.Tokens, Page.Safeguards, Page.BackupWallet, Page.DeployContract];

  useEffect(() => {
    setProgress((pages.indexOf(selectedTab) / (pages.length - 1)) * 100);
  }, [selectedTab]);

  const setSelectedTab = (selectedTab: Page) => {
    const stepObject = steps.find(step => step.pageType === selectedTab);
    if (stepObject && !stepObject.disabled) {
      dispatch({ type: ActionType.SET_SELECTED_TAB, payload: selectedTab });
    }
  };

  return (
    <NavigationContainer>
      <ProgressBarContainer>
        <ProgressBar width={progress} />
      </ProgressBarContainer>
      <NavigationStationContainer>
        <NavigationItem label={"2"} completed={steps[1].completed} title={"User Wallet"} onClick={() => setSelectedTab(Page.UserWallet)} selectedTab={selectedTab === Page.UserWallet} />
        <NavigationItem label={"3"} completed={steps[2].completed} title={"Token Selection"} onClick={() => setSelectedTab(Page.Tokens)} selectedTab={selectedTab === Page.Tokens} />
        <NavigationItem label={"4"} completed={steps[3].completed} title={"Safeguard Setup"} onClick={() => setSelectedTab(Page.Safeguards)} selectedTab={selectedTab === Page.Safeguards} />
        <NavigationItem label={"5"} completed={steps[4].completed} title={"Backup Wallet"} onClick={() => setSelectedTab(Page.BackupWallet)} selectedTab={selectedTab === Page.BackupWallet} />
        <NavigationItem label={"6"} completed={steps[5].completed} title={"Deploy Contract"} onClick={() => setSelectedTab(Page.DeployContract)} selectedTab={selectedTab === Page.DeployContract} />
      </NavigationStationContainer>
    </NavigationContainer>
  );
};

export default Navigation;