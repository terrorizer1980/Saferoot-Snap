import { Address, useWaitForTransaction } from "wagmi";
import { SafeguardEntry, addSafeguard, approve, approve721 } from "../../blockchain/functions";
import { ethers } from "ethers";
import { useData } from "../DataContext";
import { useEffect, useState } from "react";
import { ASSET_TYPE } from "../../constants";
import { ActionType } from "../actions";
import { createSaferootWithSafeguards, createSaferootWithSafeguardsProps } from "../../blockchain/functions/createSaferootWithSafeguards";
import { TokenType } from "../../blockchain/enums";

export interface AssetToApprove {
    assetType: ASSET_TYPE;
    address: Address;
    tokenId?: string;
}

export const useContractInteraction = ({ ERC20Assets, ERC721Assets }) => {

    const { state, dispatch } = useData();
    const { deployedSaferootAddress } = state;

    /*
    *
    * Approvals
    * 
    */

    const [assetAddress, setAssetAddress] = useState<Address>(null);
    const [tokenId, setTokenId] = useState<string>(null);

    const checkValidState = (assetType) => {
        return state.assetToApprove && state.assetToApprove.length > 0 && state.assetToApprove[0].assetType === assetType
    }

    const approveERC20 = approve({
        tokenAddress: assetAddress,
        saferootAddress: deployedSaferootAddress as Address,
        amount: ethers.constants.MaxUint256.toString()
    });

    const approveERC721 = approve721({
        to: assetAddress,
        saferootAddress: deployedSaferootAddress as Address,
        tokenId: tokenId
    });

    useEffect(() => {
        if (checkValidState(ASSET_TYPE.TOKEN)) {
            setAssetAddress(state.assetToApprove[0].address);
        }
        if (checkValidState(ASSET_TYPE.NFT)) {
            setAssetAddress(state.assetToApprove[0].address);
            setTokenId(state.assetToApprove[0].tokenId);
        }
    }, [state.assetToApprove]);

    useEffect(() => {
        if (assetAddress) {
            approveERC20.write?.()
            dispatch({ type: ActionType.SET_ASSET_TO_APPROVE, payload: state.assetToApprove.slice(1) })

        }
        if (tokenId) {
            approveERC721.write?.()
            dispatch({ type: ActionType.SET_ASSET_TO_APPROVE, payload: state.assetToApprove.slice(1) })
        }
    }, [assetAddress, tokenId]);

    const approveRes = useWaitForTransaction({
        hash: checkValidState(ASSET_TYPE.TOKEN) ? approveERC20.data?.hash : approveERC721.data?.hash,
        onSettled: (data, error) => {
            if (!error) {
                setAssetAddress(null);
                setTokenId(null);
            }
            return data;
        }
    });

    /*
    *
    * Create Saferoot Contract
    * 
    */

    const makeSafeguardEntries = () => {
        let combinedEntries = [...ERC20Assets, ...ERC721Assets];
        const contractObjects = combinedEntries.map((entry) => {
            if (entry.isSelected && !entry.isPreGuarded) {
                return {
                    tokenType: entry.collection ? TokenType.ERC721 : TokenType.ERC20,
                    contractAddress: entry.address,
                    tokenId: Number(entry.tokenId) || 0
                }
            }
        }).filter(Boolean) as SafeguardEntry[];
        return contractObjects
    }

    const createSaferootWithSafeguardsTx = createSaferootWithSafeguards({
        backup: state.backupWallet,
        safeguardEntries: makeSafeguardEntries()
    });

    /*
    *
    * Safeguards
    *   
    */

    const addSafeguardTx = addSafeguard({
        saferootAddress: deployedSaferootAddress as Address,
        callData: makeSafeguardEntries()
    });

    return {

        approveRes,

        createSaferootWithSafeguardsTx,

        addSafeguardTx,

    }
}