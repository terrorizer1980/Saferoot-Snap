import React, { useEffect, useRef } from "react";
import {
  InfoOption,
  InfoOptionHeading,
  InfoOptionValue,
  ReviewContainerRoot,
  ReviewInfoContainer,
} from "./styles";
import { Typography } from "../../atoms/Typography";
import { TextStyle } from "../../globalStyles";
import { UserId } from "../../atoms/UserID";
import { useNetwork, useWaitForTransaction } from "wagmi";
import { useData } from "../../../../hooks/DataContext";
import { SimpleButton } from "../../../SimpleButton";
import { useContractInteraction } from "../../../../hooks/ContractInteractions/useContractInteraction";
import { AssetGuards } from "../../../../hooks/Assets/useAssetGuards";
import { HttpStatusCode } from "../../../../constants";
import { ActionType } from "../../../../hooks/actions";
import { TokenType } from "../../../../blockchain/enums";
import { default as SaferootABI } from "../../../../blockchain/abi/SaferootABI.json";
import { ethers } from "ethers";
import { handleResponse } from "../SelectionModal";


export type ReviewData = {
  network: string;
  fee: string;
  user: { image: string; id: string }[];
};

export interface ReviewContainerProps {
  assetGuards: AssetGuards
  onSuccess: () => void;
}

// Review Container is the component that showcases everything on the approvals page. Add here for additional review info
export const ReviewContainer = (props: ReviewContainerProps) => {

  const {
    chain
  } = useNetwork();
  const { state, dispatch } = useData();
  const { deployedSaferootAddress, userWallet, backupWallet } = state
  const { assetGuards, onSuccess } = props;
  const contractDeployAPI = useRef(false)
  const assetAPICalled = useRef([])
  const { createSaferootWithSafeguardsTx, addSafeguardTx } = useContractInteraction(assetGuards)

  // Wait for transaction to be mined
  const res = useWaitForTransaction({
    hash: createSaferootWithSafeguardsTx.data?.hash
  });

  // save deployed contract address to context on success
  useEffect(() => {
    const saveDeployedContractAddress = async () => {
      try {
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
          return;
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    if (res.isSuccess) {
      onSuccess()
      dispatch({ type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS, payload: res.data.logs[0].address })
      if (contractDeployAPI) {
        contractDeployAPI.current = true
        saveDeployedContractAddress();
      }
    }
  }, [res.isSuccess]);

  // Wait for transaction to be mined
  const addRes = useWaitForTransaction({
    hash: addSafeguardTx.data?.hash
  });

  useEffect(() => {
    if (addRes.isSuccess) {
      onSuccess()
    }
  }, [addRes.isSuccess])

  function decodeSafeguardID(input) {
    const type = parseInt(input.substring(2, 4), 16);
    const address = "0x" + input.substring(26);
    return {
      type,
      address
    };
  }

  const createCeilingThresholds = (safeguardID: string) => {
    let ceilingThresholds = {
      "ERC20": [],
      "ERC721": [],
      "ERC1155": []
    }
    const decodedSafeguardID = decodeSafeguardID(safeguardID);
    const safeguardType = decodedSafeguardID.type;
    const safeguardAddress = decodedSafeguardID.address;

    switch (safeguardType) {
      case TokenType.ERC20:
        ceilingThresholds["ERC20"].push({
          contractAddress: safeguardAddress,
          value_limit: assetGuards.ERC20Assets.find((tokenSafeguard) => tokenSafeguard.address === safeguardAddress).safeguards[0].value.toString(),
        })
        break;
      case TokenType.ERC721:
        ceilingThresholds["ERC721"].push({
          contractAddress: safeguardAddress,
          tokenId: assetGuards.ERC721Assets.find((nftSafeguard) => nftSafeguard.address === safeguardAddress).tokenId.toString(),
          networkId: chain.id,
          chainId: chain.id,
        })
        break;
      default:
        break;
    }

    return [ceilingThresholds]
  }

  const createSafeguardAPI = async (safeguardID: string) => {
    if (assetAPICalled.current.includes(safeguardID)) {
      return;
    }
    assetAPICalled.current.push(safeguardID);
    try {
      const result = await fetch(
        `http://localhost:5433/v0/safeguard/value_guard?blockchain=ethereum&network=goerli`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            safeGuardId: safeguardID,
            networkId: chain.id,
            enabled: true,
            ceilingThresholds: createCeilingThresholds(safeguardID)
          }),
          credentials: "include",
        }
      );
      handleResponse(result, dispatch, () => {
        dispatch({ type: ActionType.SET_ASSET_TO_EDIT, payload: null });
      });
    } catch (error) {
      console.log(error)
    }
  }

  // Create the event listener once only, by creating it on mounting
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const deployedSaferootContract = new ethers.Contract(
      deployedSaferootAddress,
      SaferootABI,
      provider
    );

    deployedSaferootContract.on("ERC20SafeguardAdded", (safeguardID) => {
      setTimeout(() => {
        createSafeguardAPI(safeguardID);
      }, 2000);
    });

    deployedSaferootContract.on("ERC721SafeguardAdded", (safeguardID) => {
      setTimeout(() => {
        createSafeguardAPI(safeguardID);
      }, 2000);
    });

  }, []);

  const deployContract = () => {
    createSaferootWithSafeguardsTx.write?.()
  }

  const handleDeployContract = async () => {
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: { snapId: 'local:http://localhost:8080', request: { method: 'deployContract' } },
    });
    if (deployedSaferootAddress) {
      addSafeguardTx.write?.()
    } else {
      deployContract()
    }
  }

  return (
    <ReviewContainerRoot>
      <Typography {...TextStyle.blackLargeLabel} {...TextStyle.boldText}>
        Review
      </Typography>
      <ReviewInfoContainer>

        <InfoOption>
          <InfoOptionHeading>
            <Typography {...TextStyle.blackSmallLabel}>Network</Typography>
          </InfoOptionHeading>
          <InfoOptionValue>
            <Typography {...TextStyle.oceanGreenSmallLabel}>
              {chain ? chain.name : "Not Connected"}
            </Typography>
          </InfoOptionValue>
        </InfoOption>

        <InfoOption>
          <InfoOptionHeading>
            <Typography {...TextStyle.blackSmallLabel}>Protected Wallet</Typography>
          </InfoOptionHeading>
          <InfoOptionValue>
            <UserId id={userWallet} image={''} />
          </InfoOptionValue>
        </InfoOption>

        <InfoOption>
          <InfoOptionHeading>
            <Typography {...TextStyle.blackSmallLabel}>Backup Wallet</Typography>
          </InfoOptionHeading>
          <InfoOptionValue>
            <UserId id={backupWallet} image={''} />
          </InfoOptionValue>
        </InfoOption>

        <SimpleButton
          disabled={res.isLoading || res.isSuccess || addRes.isLoading || addRes.isLoading}
          type="primary"
          onClick={handleDeployContract}>
          {(res.isLoading || addRes.isLoading) ? "Deploying..." : ((res.isSuccess || addRes.isLoading) ? "Deployed" : "Deploy")}
        </SimpleButton>
      </ReviewInfoContainer>
    </ReviewContainerRoot>
  );
};
