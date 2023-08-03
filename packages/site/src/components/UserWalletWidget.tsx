import React from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi'
import styled from 'styled-components';


const UserWalletContainer = styled.div`
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 315px;
  height: 204px;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
  `;

const UserWalletContainerTop = styled.div`
  display: flex;
  flex-direction:row;
  flex-grow:1;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const UserWalletContainerBottom = styled.div`
  display: flex;
  flex-direction:column;
  flex-grow:1;
  width: 100%;
  align-items: center;
  justify-content: space-around;
`;

const UserWalletValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  p{
    margin: 0;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #191919;
    opacity: 0.7;
  }
  .walletETHBalance {
    margin: 0;
    font-weight: 400;
    font-size: 28px;
    line-height: 110%;
    letter-spacing: -0.03em;
  }
  `;

const UserWalletNetworkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p{
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #191919;
    opacity: 0.7;
  }
  .networkName {
    margin: 0;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 150%;
    color: #191919;
  }
`;

const UserWalletSyncedWidget = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80px;
  height: 30px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
  b {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    text-align: center;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0E0D0D;
  }
`;

interface StatusCircleProps {
  color: string;
}

const StatusCircle = styled.div<StatusCircleProps>`
  display: flex;
  width: 10px;
  height: 10px;
  background: ${(props: StatusCircleProps) => props.color};
  border-radius: 50%;
  border: 1px solid #E5E5E5;
`;

export const UserWalletWidget = () => {
  const {
    address,
    isConnected
  } = useAccount();

  const {
    chain
  } = useNetwork();

  const {
    data,
    isFetching
  } = useBalance({
    address: address,
  });


  return (
    <UserWalletContainer>
      <UserWalletContainerTop>
        <UserWalletValueContainer>
          <p>Wallet</p>
          <div className="walletETHBalance">{isConnected && !isFetching ? `${parseFloat(data.formatted).toFixed(4)} ${data.symbol}` : ``}</div>
        </UserWalletValueContainer>
        <UserWalletSyncedWidget>
          <StatusCircle color={isConnected ? "#00FF00" : "#FF1500"}></StatusCircle>
          <b>{isConnected ? "SYNCED" : "NOT CONNECTED"}</b>
        </UserWalletSyncedWidget>
      </UserWalletContainerTop>
      <UserWalletContainerBottom>
        <UserWalletNetworkContainer>
          <p>Network</p>
          <div className="networkName">{chain ? chain.name : "Not Connected"}</div>
        </UserWalletNetworkContainer>
      </UserWalletContainerBottom>
    </UserWalletContainer>
  )
};