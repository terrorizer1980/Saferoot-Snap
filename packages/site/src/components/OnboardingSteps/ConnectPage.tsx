import React, { useEffect, useState } from "react";
import { Card } from "..";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useData } from "../../hooks/DataContext";
import { ActionType } from "../../hooks/actions";
import { AuthContext } from "../../hooks";
import { SimpleButton } from "../SimpleButton";
import { HttpStatusCode, NAVIGATION_PATHS } from "../../constants";
import { navigate } from "gatsby";
import { Container } from "./styles";
import { makeAPICall } from "../../hooks/API/helpers";
import { APICalls } from "../../hooks/API/types";
import { SnapModal } from "../newComponents/molecules/SnapModal";

const ConnectWalletImage = styled.img`
  padding-bottom: 80px;
`;

const ButtonGroupContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ConnectPage = () => {
  const { address, isConnected } = useAccount();
  const { dispatch, state } = useData();
  const { error } = state;
  const { authenticated } = React.useContext(AuthContext);
  const [open, setOpen] = useState(false)
  const setUserWallet = (address: string) => {
    dispatch({ type: ActionType.SET_USER_WALLET, payload: address });
  };

  const goToNextTab = () => {
    if (isConnected && authenticated) {
      navigate(NAVIGATION_PATHS.ONBOARDING);
    }
  };

  interface getDeployedContractResponse {
    id: number,
    contract_address: string
  }

  const checkOnboarded = async () => {
    try {
      const { data, status } = await makeAPICall(APICalls.GET_DEPLOYED_CONTRACT, null, null, dispatch)
      if (data.length > 0) {
        dispatch({ type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS, payload: data[0].contract_address })
      } else {
        navigate(NAVIGATION_PATHS.ONBOARDING);
      }
      if (status === HttpStatusCode.Unauthorized) {
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
    <Container>
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
              {!state.installedSnap && <SimpleButton
                onClick={() => { setOpen(true) }}
              >
                Enable MetaMask Snap
              </SimpleButton>}
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
        style={{ height: "auto", width: "450px" }}
      />
      <SnapModal openModal={open} setOpenModal={setOpen} />
    </Container>
  );
};
