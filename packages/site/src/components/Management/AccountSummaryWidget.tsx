import React from 'react';
import styled from 'styled-components';
import { SimpleButton } from '../SimpleButton';
import { useData } from '../../hooks/DataContext';


const AssetsProtectedParentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;  // You can adjust this value to create space between the grid items
`;

const AssetsProtectedContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1
  .label {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    /* identical to box height, or 18px */

    letter-spacing: -0.02em;

    /* Primary/Black */

    color: #000000;
    opacity: 0.7;
    width: 100%;
  }
  .assetNumbers {
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 100%;
    /* or 36px */

    letter-spacing: -0.03em;

    color: #000000;
  }
  .text {
    /* Body/Body Text - Regular */
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    /* identical to box height, or 24px */

    letter-spacing: -0.02em;

    color: #191919;
  }
  .assetLabels {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    /* or 18px */

    letter-spacing: -0.02em;

    /* Primary/Orchid Purple */

    color: #963484;
  }
  .assetContainer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    width: 40%;
  }`;


const AccountSummaryWidget = () => {
  // Use context to retrieve the necessary data for this widget
  const { state } = useData();
  return (
    <AssetsProtectedParentContainer>
      <AssetsProtectedContainer>
        <div className="label">Assets Protected</div>
        <div className="assetContainer">
          <div className="assetNumbers">{state.tokenSafeguards.length}</div>
          <div className="assetLabels">Token(s)</div>
        </div>
        <div className="assetContainer">
          <div className="assetNumbers">{state.nftSafeguards.length}</div>
          <div className="assetLabels">NFT(s)</div>
        </div>
      </AssetsProtectedContainer>
      <AssetsProtectedContainer>
        <SimpleButton type="default" onClick={() => {
         if (state.deployedSaferootAddress) {
          const etherscanURL = `https://goerli.etherscan.io/address/${state.deployedSaferootAddress}`;
          window.open(etherscanURL, '_blank');
        }
        }}>View Contract</SimpleButton>
      </AssetsProtectedContainer>
    </AssetsProtectedParentContainer>
  );
};

export default AccountSummaryWidget;