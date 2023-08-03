import { FunctionComponent, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { Header, AuthenticationAdapter } from './components';
import { MuiTheme } from './styling/muiTheme';
import { ThemeProvider } from '@mui/material/styles';

import { GlobalStyle } from './config/theme';

import {
  getDefaultWallets,
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import { mainnet, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { useAuth } from './hooks'; // Import the AuthProvider
import { DataProvider } from './hooks/DataContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const { chains, provider } = configureChains(
    [mainnet, goerli],
    [
      publicProvider()
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: 'Saferoot App',
    projectId: 'f53502cad5e69e2fef93a5818918311a',
    chains
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  const { authenticated, onAuthenticated, signOutHandler } = useAuth();
  const authAdapter = AuthenticationAdapter(onAuthenticated);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <DataProvider>
          <WagmiConfig client={wagmiClient}>
            <ThemeProvider theme={MuiTheme}>
              <RainbowKitAuthenticationProvider adapter={authAdapter}
                status={authenticated ? "authenticated" : "unauthenticated"}>
                <RainbowKitProvider chains={chains}>
                  <Header />
                  {children}
                </RainbowKitProvider>
              </RainbowKitAuthenticationProvider>
            </ThemeProvider>
          </WagmiConfig>
        </DataProvider>
      </Wrapper>
    </>
  );
};
