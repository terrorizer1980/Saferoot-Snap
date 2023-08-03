import React, { useEffect } from "react";
import { Card } from "..";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useData } from "../../hooks/DataContext";
import { ActionType } from "../../hooks/actions";
import { AuthContext } from "../../hooks";
import { SnapsConnectButton } from "../Snaps";
import { SimpleButton } from "../SimpleButton";
import { HttpStatusCode, NAVIGATION_PATHS } from "../../constants";
import { navigate } from "gatsby";

const ConnectWalletImage = styled.img`
  padding-bottom: 80px;
`;

const ButtonGroupContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ConnectPage = ({ nextTab }) => {
  const { address, isConnected } = useAccount();
  const { dispatch, state } = useData();
  const { error } = state;
  const { authenticated } = React.useContext(AuthContext);
  const setUserWallet = (address: string) => {
    dispatch({ type: ActionType.SET_USER_WALLET, payload: address });
  };

  const goToNextTab = () => {
    if (isConnected && authenticated) {
      nextTab();
    }
  };

  interface getDeployedContractResponse {
    id: number,
    contract_address: string
  }

  const checkOnboarded = async () => {
    try {
      const result = await fetch(`http://localhost:5433/getDeployedContract`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });
      // process your data here
      const data: getDeployedContractResponse[] = await result.json();
      if (data.length > 0) {
        dispatch({ type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS, payload: data[0].contract_address })
      } else {
        nextTab();
      }
      if (result.status === HttpStatusCode.Unauthorized) {
        return;
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    if (state.deployedSaferootAddress !== "") {
      navigate(NAVIGATION_PATHS.DASHBOARD)
    }
  }, [state.deployedSaferootAddress])

  useEffect(() => {
    if (isConnected) {
      setUserWallet(address);
    }
    if (isConnected && authenticated) {
      checkOnboarded();
    }
  }, [isConnected, address, authenticated]);

  return (
    <div>
      <Card
        content={{
          image: (
            <ConnectWalletImage
              src="/connect-wallet-image.png"
              alt="SafeRoot"
              height="350"
            />
          ),
          title: !authenticated ? "Keeping your assets safe takes only 5 minutes!" : "Wallet Connected",
          description: !authenticated
            ? "Start by connecting your wallet with Saferoot"
            : "Press next to continue",
          button: (
            <ButtonGroupContainer>
              {error && <p style={{ color: "red" }}>{error.message}</p>}
              <SnapsConnectButton />
              <br />
              {!authenticated && <ConnectButton />}
              {isConnected && authenticated && (
                <SimpleButton
                  onClick={goToNextTab}
                >
                  Next
                </SimpleButton>
              )}
            </ButtonGroupContainer>
          ),
        }}
        style={{ height: "auto", width: "450px", marginTop: "-5rem" }}
      />
    </div>
  );
};
