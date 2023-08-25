import { Address, useWaitForTransaction } from "wagmi";
import { SafeguardEntry, addSafeguard, approve, approve721 } from "../../blockchain/functions";
import { ethers } from "ethers";
import { useData } from "../DataContext";
import { useEffect, useState } from "react";
import { ASSET_TYPE } from "../../constants";
import { ActionType } from "../actions";
import { createSaferootWithSafeguards } from "../../blockchain/functions/createSaferootWithSafeguards";
import { TokenType } from "../../blockchain/enums";
import { AssetGuard } from "../Assets/types";

export interface AssetToApprove {
    assetType: ASSET_TYPE;
    address: Address;
    tokenId?: string;
}

interface UseContractInteractionProps {
    ERC20Assets: AssetGuard[];
    ERC721Assets: AssetGuard[];
}

interface contractInteractionHookProps {
    approveRes: ReturnType<typeof useWaitForTransaction>
    createSaferootWithSafeguardsTx: ReturnType<typeof createSaferootWithSafeguards>
    addSafeguardTx: ReturnType<typeof addSafeguard>
}

export const useContractInteraction = ({ ERC20Assets, ERC721Assets }: UseContractInteractionProps): contractInteractionHookProps => {

    const { state, dispatch } = useData();
    const { deployedSaferootAddress } = state;

    /*
    *
    * Approvals
    * 
    */

    const [assetAddress, setAssetAddress] = useState<Address | null>(null);
    const [tokenId, setTokenId] = useState<string | null>(null);

    const checkValidState = (assetType: ASSET_TYPE): boolean => {
        const validState = state.assetToApprove &&
            state.assetToApprove.length > 0 &&
            state.assetToApprove[0].assetType === assetType
        return validState as boolean
    }

    const approveERC20 = approve({
        tokenAddress: assetAddress as Address,
        saferootAddress: deployedSaferootAddress as Address,
        amount: ethers.constants.MaxUint256.toString()
    });

    const approveERC721 = approve721({
        to: assetAddress as Address,
        saferootAddress: deployedSaferootAddress as Address,
        tokenId: tokenId as string
    });

    useEffect(() => {
        if (checkValidState(ASSET_TYPE.TOKEN) && state.assetToApprove) {
            setAssetAddress(state.assetToApprove[0].address);
        }
        if (checkValidState(ASSET_TYPE.NFT) && state.assetToApprove) {
            setAssetAddress(state.assetToApprove[0].address);
            setTokenId(state.assetToApprove[0].tokenId as string);
        }
    }, [state.assetToApprove]);

    useEffect(() => {
        if (assetAddress != null && assetAddress as string !== '' && state.assetToApprove) {
            approveERC20.write?.();
            dispatch({ type: ActionType.SET_ASSET_TO_APPROVE, payload: state.assetToApprove.slice(1) });
        }
        if (tokenId != null && tokenId !== '' && state.assetToApprove) {
            approveERC721.write?.();
            dispatch({ type: ActionType.SET_ASSET_TO_APPROVE, payload: state.assetToApprove.slice(1) });
        }
    }, [assetAddress, tokenId]);

    const approveRes = useWaitForTransaction({
        hash: checkValidState(ASSET_TYPE.TOKEN) ? approveERC20.data?.hash : approveERC721.data?.hash,
    });

    /*
    *
    * Create Saferoot Contract
    * 
    */

    const makeSafeguardEntries = (): SafeguardEntry[] => {
        const combinedEntries = [...ERC20Assets, ...ERC721Assets];
        const contractObjects = combinedEntries.map((entry) => {
            if (entry.isSelected && !entry.isPreGuarded) {
                return {
                    tokenType: entry.collection != null && entry.collection !== '' ? TokenType.ERC721 : TokenType.ERC20,
                    contractAddress: entry.address,
                    tokenId: Number(entry.tokenId) || 0
                }
            }
            return null;
        }).filter(Boolean) as SafeguardEntry[];
        return contractObjects;
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