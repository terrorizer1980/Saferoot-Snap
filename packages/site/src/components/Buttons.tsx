import { ComponentProps } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

const ButtonText = styled.span`
  margin-left: 1rem;
`;

export const ConnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <ButtonText>Connect with Saferoot</ButtonText>
    </Button>
  );
};

export const ReconnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <ButtonText>Reconnect</ButtonText>
    </Button>
  );
};

export const EnableWalletBackup = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Approve and enable Saferoot</Button>;
};
