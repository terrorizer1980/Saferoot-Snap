import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../hooks';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 36px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = () => {
  const { authenticated, signOutHandler } = useAuth();

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <img src="/saferoot.png" alt="SafeRoot" height="36" />
      </LogoWrapper>
      <RightContainer>
        <ConnectButton />
      </RightContainer>
    </HeaderWrapper>
  );
};
