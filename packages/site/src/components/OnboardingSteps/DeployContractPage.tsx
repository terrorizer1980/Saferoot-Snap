import React, { useEffect, useState } from 'react';
import { Subtitle, Heading, ErrorMessage } from '../../styling/styles';
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../../hooks';
import { Address, useAccount, useNetwork, useWaitForTransaction } from 'wagmi';
import { createSaferoot } from '../../blockchain/functions';
import { useData } from '../../hooks/DataContext';
import { ActionType } from '../../hooks/actions';
import { Mainnet_NETWORK_ID, Goerli_NETWORK_ID } from '../../blockchain/enums/networkID';
import { UserWalletWidget } from '../UserWalletWidget';
import { ethers } from 'ethers';
import { Container, Left, Right, RoundedGrayContainers, RoundedWhiteContainer } from './styles';
import { simpleEthereumAddressValidator } from '../EthereumAddressInput';
import styled from "styled-components";
import FixedNavigationBottomBar from '../FixedNavigationBottomBar';
import Typography from '@mui/material/Typography';
import { TokenGridColumnsDefinition, NFTGridColumnsDefinition } from './Tables/columnDefinitions';
import { TokenApprovalAndBackupSetup, NFTApprovalAndBackupSetup } from './SafeguardSetup/TokenApprovalAndBackupSetup';
import { NFTData, SelectedNFTToken, TokenBalance } from './Tables/gridhelper';
import { Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { HttpStatusCode } from '../../constants';
import { useLoader } from '../../hooks/useLoader';
import { LoaderModal } from '../LoaderModal';
import { SimpleButton } from '../SimpleButton';

// Token grid definition for approvals
const TokenGridSafeguardsColumnDefinition = (approvalStates, setApprovalStates) => [
  ...TokenGridColumnsDefinition,
  {
    field: "Approve Tokens",
    headerName: "Approve Tokens",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const tokenBalance: TokenBalance = row as TokenBalance;

      return (
        <TokenApprovalAndBackupSetup
          tokenAddress={tokenBalance.address as Address}
          approvalStates={approvalStates}
          setApprovalStates={setApprovalStates}
        />
      );
    },
  }
];

interface TokenGridProps {
  balances: TokenBalance[];
  selectedTokens?: string[];
  approvalStates: AssetApprovedState[];
  setApprovalStates: (approvalStates: AssetApprovedState[]) => void;
}

const TokenGrid: React.FC<TokenGridProps> = ({
  balances,
  selectedTokens = [],
  approvalStates,
  setApprovalStates }) => {
  if (selectedTokens.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom component="div">
          No tokens selected
        </Typography>
      </div>
    )
  }

  return (
    <div>
      <DataGrid
        autoHeight
        style={{ width: '1050px' }}
        columns={TokenGridSafeguardsColumnDefinition(approvalStates, setApprovalStates)}
        rows={balances.filter(row => selectedTokens.includes(row.address))}
        getRowId={(row) => row.address}
      />
    </div>
  )
};

// Token grid definition for approvals
const NFTGridSafeguardsColumnDefinition = (approvalStates, setApprovalStates) => [
  ...NFTGridColumnsDefinition,
  {
    field: "Approve Tokens",
    headerName: "Approve Tokens",
    width: 300,
    renderCell: (params) => {
      const { row } = params;
      const nftItem: NFTData = row as NFTData;

      return (
        <NFTApprovalAndBackupSetup
          assetContractAddress={nftItem.assetContract.address as Address}
          tokenId={nftItem.tokenId.toString()}
          approvalStates={approvalStates}
          setApprovalStates={setApprovalStates}
        />
      );
    },
  }
];
interface NFTGridProps {
  nfts: NFTData[];
  selectedNFTs?: SelectedNFTToken[];
  approvalStates: AssetApprovedState[];
  setApprovalStates: (approvalStates: AssetApprovedState[]) => void;
}
const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  selectedNFTs = [],
  approvalStates,
  setApprovalStates }) => {
  if (selectedNFTs.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom component="div">
          No NFTs selected
        </Typography>
      </div>
    )
  }
  return (
    <div>
      <DataGrid
        autoHeight
        columns={NFTGridSafeguardsColumnDefinition(approvalStates, setApprovalStates)}
        rows={nfts.filter((row) => selectedNFTs.filter((selectedNFT) => selectedNFT.address === row.assetContract.address && row.tokenId === selectedNFT.tokenId).length > 0)}
        getRowId={(row) => row.assetContract.address + row.tokenId}
      />
    </div>
  )
}
const ProgressBar = ({ stepOfContractDeployment, totalSteps }) => {

  // consolidated completed steps / 2 to account for the two steps per step
  const completedSteps = Object.values(stepOfContractDeployment).filter(step => step).length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div style={{ width: '100%', height: '8px', backgroundColor: '#0000001A' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#27FB6B',
          transition: 'width 0.3s ease',
        }}
      />
      <div style={{ marginTop: '8px' }}>
        {completedSteps}/{totalSteps} steps completed
      </div>
    </div>
  );
};

// TypeScript interface for Step props
interface StepProps {
  number: number;
  title: string;
  subtitle: string;
  completed: boolean;
  disabled: boolean;
}

// Numbered Multi-State Bulletin component
const NumberedMultiStateBulletin = styled.div<{ completed: boolean; disabled: boolean }>`
  width: 18px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => (props.disabled ? "gray" : "black")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  margin-top: 30px;
  margin-right: 20px;
`;

// Container for Step Title and Subtitle
const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

// Usage
const Step: React.FC<StepProps> = ({ number, title, subtitle, completed, disabled }) => {
  return (
    <StepContainer>
      <NumberedMultiStateBulletin disabled={disabled} completed={completed}>
        {completed ? "✔️" : number}
      </NumberedMultiStateBulletin>
      <div>
        <h2 style={{ textAlign: "left" }}>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </StepContainer>
  );
};

interface getDeployedContractResponse {
  id: number,
  contract_address: string
}

export interface AssetApprovedState {
  address: string;
  approved: boolean;
  approvedAmount: string;
  tokenId?: string;
}

export const DeployContractPage = ({ nextTab, prevTab }) => {
  const [assetApprovalStates, setAssetApprovalStates] = useState<AssetApprovedState[]>([]);
  const { authenticated } = React.useContext(AuthContext);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { state, dispatch } = useData();
  const { userWallet,
    backupWallet,
    deployedSaferootAddress,
    selectedTokens,
    userTokenBalances,
    userNFTs,
    selectedNFTs } = state;
  const [errorMessage, setErrorMessage] = useState("");
  const { setMessage, setOpen, open, message } = useLoader()
  const [deployedSaferootAddressFetched, setDeployedSaferootAddressFetched] = useState(false);

  // Hooks
  const createSaferootTx = createSaferoot({ backup: backupWallet });
  const res = useWaitForTransaction({
    hash: createSaferootTx.data?.hash
  });
  // Run this effect whenever assetApprovalStates changes
  const [allApproved, setAllApproved] = useState(false);
  useEffect(() => {
    const approval = assetApprovalStates.length > 0 && assetApprovalStates.every(state => state.approved);
    setAllApproved(approval);
  }, [assetApprovalStates]);

  useEffect(() => {
    const fetchData = async () => {
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
        }
        setDeployedSaferootAddressFetched(true);
        if (result.status === HttpStatusCode.Unauthorized) {
          setErrorMessage("Please ensure you have the correct wallet in focus and have been authenticated.");
          return;
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, []);

  // save deployed contract address to context on success
  useEffect(() => {
    const fetchData = async () => {
      try {
        // sends a post request to the API endpoint to save the deployed contract address
        const result = await fetch(`http://localhost:5433/createDeployedContract`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chainId: chain.id,
            networkId: chain.id,
            contractAddress: res.data.logs[0].address,
            userWalletAddress: userWallet
          }),
          credentials: "include",
        });
        if (result.status === HttpStatusCode.Unauthorized) {
          setErrorMessage("Please ensure you have the correct wallet in focus and have been authenticated.");
          return;
        }
      } catch (error) {
        console.error("Error: ", error);
        setErrorMessage("The contract was not saved correctly, please maintain a copy of your contract address. And contact support")
      }
    }
    if (res.isSuccess) {
      // get deployed address read from event logs
      dispatch({ type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS, payload: res.data.logs[0].address })
      fetchData();
    }
  }, [res.isSuccess]);

  useEffect(() => {
    switch (true) {
      case res.isLoading:
        setMessage("Deploying your Saferoot contract...");
        setOpen(true);
        break;
      case !res.isSuccess:
        setMessage("The contract was not saved correctly, please maintain a copy of your contract address. And contact support.");
        break;
      default:
        setMessage("");
        setOpen(false);
        break;
    }
  }, [res])

  const [stepOfContractDeployment, setStepOfContractDeployment] = useState({
    step1: false,
    step2: false,
  });

  useEffect(() => {
    if (simpleEthereumAddressValidator(deployedSaferootAddress) && deployedSaferootAddress !== "") {
      setStepOfContractDeployment({
        ...stepOfContractDeployment,
        step1: true,
      })
    }
  }, [deployedSaferootAddress]);

  const nextTabHandler = () => {
    if (ethers.utils.isAddress(deployedSaferootAddress)) {
      nextTab();
    }
  }

  useEffect(() => {
    if (allApproved) {
      setStepOfContractDeployment({
        ...stepOfContractDeployment,
        step2: true
      })
    }
  }, [allApproved])

  const step1: StepProps = {
    number: 1,
    title: "Deploy your Saferoot contract",
    subtitle: "Ensure that the wallet you want to protect is listed below. Saferoot will deploy a smart contract linked to that wallet address.",
    completed: stepOfContractDeployment.step1,
    disabled: false,
  };

  const step2: StepProps = {
    number: 2,
    title: "Approve your contract to move your assets",
    subtitle: "Approvals are required for Saferoot to move these assets on your behalf to your backup wallet.",
    completed: stepOfContractDeployment.step2,
    disabled: false,
  };

  const handleContractDeploy = async () => {
    if (deployedSaferootAddress === "") {
      createSaferootTx.write?.()
    }
  }

  return (
    <Container>
      <LoaderModal open={open} message={message} />
      <Left>
        <UserWalletWidget />
      </Left>
      <Right>
        <RoundedWhiteContainer>
          <Heading>Deploy your own Saferoot Smart Contract &nbsp;
            <Tooltip title="By deploying your own Saferoot contract, you will have exclusive custody of your assets. Saferoot will only have the ability to move assets on your behalf and will never have custody over them. This guide will assist you in deploying your own contract. ">
              <HelpIcon />
            </Tooltip>
          </Heading>
          <Subtitle>When you deploy your Saferoot contract, you have full ownership and control of your assets. The contract can only facilitate asset movement on your behalf and does not hold custody.</Subtitle>
          <br />
          <ProgressBar stepOfContractDeployment={stepOfContractDeployment} totalSteps={2} />
          <br />
          {errorMessage && (
            <ErrorMessage>
              {errorMessage}
            </ErrorMessage>
          )}
          <Step {...step1} />
          {!stepOfContractDeployment.step1 && deployedSaferootAddress == "" && (
            <RoundedGrayContainers>
              <p>
                Your wallet address: {userWallet}
              </p>
              <p>
                Your backup wallet address: {backupWallet}
              </p>
              {res.isSuccess && deployedSaferootAddress !== "" && (
                <>
                  <Subtitle>
                    Successfully deployed Saferoot contract to{' '}
                    {res.data.logs[0].address}{' '}
                    <a
                      href={`https://goerli.etherscan.io/tx/${createSaferootTx.data?.hash}`}
                    >
                      View on Etherscan
                    </a >
                  </Subtitle >
                </>
              )}
              { deployedSaferootAddress === "" && deployedSaferootAddressFetched &&
                (
                  <SimpleButton
                    onClick={handleContractDeploy}
                    type="primary"
                    disabled={deployedSaferootAddress !== "" || !authenticated || !isConnected
                      || (chain.id !== Mainnet_NETWORK_ID && chain.id !== Goerli_NETWORK_ID) 
                      && res.isLoading
                    }
                  >
                    {res.isLoading ? 'Deploying...' : 'Deploy Contract'}
                  </SimpleButton>
                )
              }
            </RoundedGrayContainers>
          )}
          {stepOfContractDeployment.step1 && deployedSaferootAddress != "" && (
            <RoundedGrayContainers>
              <Subtitle>
                Deployed Saferoot contract address: {deployedSaferootAddress}
              </Subtitle>
            </RoundedGrayContainers>
          )}
          <Step {...step2} />
          {stepOfContractDeployment.step1 && (
            <RoundedGrayContainers>
              <TokenGrid
                balances={userTokenBalances}
                selectedTokens={selectedTokens}
                approvalStates={assetApprovalStates}
                setApprovalStates={setAssetApprovalStates} />
              <NFTGrid
                nfts={userNFTs}
                selectedNFTs={selectedNFTs}
                approvalStates={assetApprovalStates}
                setApprovalStates={setAssetApprovalStates} />
            </RoundedGrayContainers>
          )}
        </RoundedWhiteContainer>
      </Right>

      <FixedNavigationBottomBar>
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton
          onClick={nextTabHandler}
          type={!allApproved ? "secondary" : "primary"}
          disabled={!allApproved}>
          Next
        </SimpleButton>
      </FixedNavigationBottomBar>
    </Container>
  );
};