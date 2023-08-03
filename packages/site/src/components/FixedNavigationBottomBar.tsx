import React from 'react';
import {
  FixedBar,
  FixedBarContents,
  FixedBarMessage,
  FixedBarButtons,
  FixedBarClearing
} from './OnboardingSteps/styles';

interface FixedNavigationBottomBarProps {
  message?: string;
  children?: React.ReactNode;
}
const FixedNavigationBottomBar: React.FC<FixedNavigationBottomBarProps> = ({ message = "", children = null }) => {
  return (
    <FixedBar>
      <FixedBarClearing />
      <FixedBarContents>
        <FixedBarMessage>
          <p>{message}</p>
        </FixedBarMessage>
        <FixedBarButtons>
          {children}
        </FixedBarButtons>
      </FixedBarContents>

    </FixedBar>
  );
};

export default FixedNavigationBottomBar;