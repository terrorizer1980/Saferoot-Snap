import React from "react";
import { Address, useAccount, useContractRead } from "wagmi";
import { useWaitForTransaction } from 'wagmi';
import { ethers } from "ethers";
import { useData } from '../../../hooks/DataContext';
import {
  approve
} from '../../../blockchain/functions';
import { approve721 } from "../../../blockchain/functions";
import { AssetApprovedState } from "../DeployContractPage";
import { default as TokenABI } from "../../../blockchain/abi/ERC20TokensABI.json";
import { default as ERC721ABI } from "../../../blockchain/abi/ERC721NFTABI.json";
import { SimpleButton } from "../../SimpleButton";

interface TokenSetupProps {
  tokenAddress: Address;
  upgradeAble?: boolean; // adding a boolean flag to check if the token approval is resetable via dashboard,
  approvalStates: AssetApprovedState[];
  setApprovalStates: (approvalStates: AssetApprovedState[]) => void;
}

// This is the component that allows a user to setup a single token's safeguards
export const TokenApprovalAndBackupSetup: React.FC<TokenSetupProps> = ({ tokenAddress, approvalStates, setApprovalStates, upgradeAble = false }) => {
  const { state } = useData();
  const { deployedSaferootAddress } = state;
  const [ethAmount, setEthAmount] = React.useState(0);
  const { address } = useAccount();

  // Transaction Hooks
  const approveTx = approve({
    tokenAddress: tokenAddress,
    saferootAddress: deployedSaferootAddress as Address,
    amount: ethers.constants.MaxUint256.toString()
  });

  const { refetch } = useContractRead({
    address: tokenAddress,
    abi: TokenABI,
    functionName: 'allowance',
    args: [address, deployedSaferootAddress],
    onSettled: (data) => {
      const approvedAmount = data as bigint;
      if (approvedAmount > 0) {
        setEthAmount(Number(ethers.utils.formatEther(approvedAmount)));
      }
      const approvalStateHasAsset = approvalStates?.find((approvalState) => {
        return approvalState.address === tokenAddress;
      });
      if (!approvalStateHasAsset) {
        setApprovalStates([...approvalStates, {
          address: tokenAddress,
          tokenId: "",
          approvedAmount: "",
          approved: approvedAmount > 0
        }]);
      } else {
        const newApprovalStates = approvalStates?.map((approvalState) => {
          if (approvalState.address === tokenAddress) {
            return {
              ...approvalState,
              approved: approvedAmount > 0
            };
          }
          return approvalState;
        });
        setApprovalStates([...newApprovalStates]);
      }
    }
  });

  // Tx Results
  const approveRes = useWaitForTransaction({
    hash: approveTx.data?.hash,
    onSettled: (data, error) => {
      refetch();
    }
  });

  return (
      <SimpleButton
        type={upgradeAble ? 'primary' : ethAmount > 0 ? 'secondary' : 'primary'}
        disabled={upgradeAble ? !upgradeAble : (approveRes.isLoading || ethAmount > 0)}
        onClick={() => {
          approveTx.write?.();
        }}> {
          approveRes.isLoading
            ? 'Approving...'
            : ethAmount > 0 ? 'Approved' : 'Approve'
        }</SimpleButton >
  );
};

interface NFTSetupProps {
  assetContractAddress: Address;
  tokenId: string;
  approvalStates: AssetApprovedState[];
  setApprovalStates: (approvalStates: AssetApprovedState[]) => void;
  upgradeAble?: boolean; // adding a boolean flag to check if the token approval is resetable via dashboard,
}
export const NFTApprovalAndBackupSetup: React.FC<NFTSetupProps> = (
  { assetContractAddress,
    tokenId,
    approvalStates,
    setApprovalStates,
    upgradeAble = false, }) => {
  const { state } = useData();
  const { deployedSaferootAddress } = state;
  // Transaction Hooks
  const approveTx = approve721({
    to: assetContractAddress,
    saferootAddress: deployedSaferootAddress as Address,
    tokenId: tokenId
  });

  const { data, refetch } = useContractRead({
    address: assetContractAddress,
    abi: ERC721ABI,
    functionName: 'getApproved',
    watch: true,
    args: [tokenId],
    onSettled: (data, error) => {
      const approvedAddress = data as Address;
      const approvalStateHasAsset = approvalStates.find((approvalState) => {
        return approvalState.address === assetContractAddress && approvalState.tokenId === tokenId;
      });
      if (!approvalStateHasAsset) {
        setApprovalStates([...approvalStates, {
          address: assetContractAddress,
          tokenId: tokenId,
          approvedAmount: "",
          approved: approvedAddress === deployedSaferootAddress
        }]);
      } else {
        const newApprovalStates = approvalStates.map((approvalState) => {
          if (approvalState.address === assetContractAddress && approvalState.tokenId === tokenId) {
            return {
              ...approvalState,
              approved: approvedAddress === deployedSaferootAddress
            };
          }
          return approvalState;
        });
        setApprovalStates([...newApprovalStates]);
      }
    }
  });

  // Tx Results
  const approveRes = useWaitForTransaction({
    hash: approveTx.data?.hash,
    onSettled: (data, error) => {
      refetch();
    }
  });

  return (
    <SimpleButton
      type={upgradeAble ? 'primary' : data === deployedSaferootAddress ? 'secondary' : 'primary'}
      disabled={upgradeAble ? !upgradeAble : (approveRes.isLoading || data === deployedSaferootAddress)}
      onClick={() => {
        approveTx.write?.();
      }}> {
        approveRes.isLoading
          ? 'Approving...'
          : data === deployedSaferootAddress ? 'Approved' : 'Approve'
      }</SimpleButton >
  );
};