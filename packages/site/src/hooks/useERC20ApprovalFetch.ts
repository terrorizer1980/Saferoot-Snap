import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { useData } from './DataContext';
import { default as ERC20ABI } from "../blockchain/abi/ERC20TokensABI.json";
import { Address } from "wagmi";
import { ActionType } from './actions';
import { HttpStatusCode } from '../constants';

interface getDeployedContractResponse {
    id: number,
    contract_address: string
}


export const useApprovalFetch = (approveRes: any = {}) => {

    const [allApproved, setAllApproved] = useState<boolean>(false) //initiated to true instead of false to avoid flashing of the "Approve" button
    const [tokenAllowances, setTokenAllowances] = useState<Object>({})
    const { state, dispatch } = useData();
    const { selectedTokens, deployedSaferootAddress } = state;

    useEffect(() => {
        if (deployedSaferootAddress === "") {
            fetchData();
        }
    }, []);

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
                dispatch({ type: ActionType.SET_DEPLOYED_SAFEROOT_ADDRESS, payload: data[0].contract_address as Address })
            }
            if (result.status === HttpStatusCode.Unauthorized) {
                //   setErrorMessage("Please ensure you have the correct wallet in focus and have been authenticated.");
                return;
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };
    // fetch saferoot contract address for the user wallet

    async function getAllowance(userWalletAddress: Address, contractAddress: Address, tokenAddress: Address) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
            const allowance = await tokenContract.allowance(userWalletAddress, contractAddress);
            return allowance;
        } catch (error) {
            console.error('Failed to fetch allowance:', error);
            throw error;  // Rethrowing the error so it can be caught higher up if needed
        }
    }

    async function checkAllowance() {
        // 
        // Array to store promises
        let promises = [];
        for (let i = 0; i < selectedTokens.length; i++) {
            const promise = getAllowance(window.ethereum.selectedAddress, deployedSaferootAddress, selectedTokens[i]);
            promises.push(promise);
        }
        try {
            // 
            // Await all promises
            const allowances = await Promise.all(promises);

            let approved = true;
            let tokenAllowance = {}; // { tokenAddress: allowance }

            for (let i = 0; i < selectedTokens.length; i++) {
                if (allowances[i] > 0) {
                    tokenAllowance[selectedTokens[i]] = ethers.utils.formatEther(allowances[i]);
                } else {
                    tokenAllowance[selectedTokens[i]] = 0;
                    approved = false;
                }
            }
            setAllApproved(approved); // quickly catches the case where all tokens are not approved
            setTokenAllowances(tokenAllowance);
        } catch (error) {
            console.error('Error while checking allowances:', error);
        }
    }

    useEffect(() => {
        if (window.ethereum.selectedAddress && deployedSaferootAddress !== "" && selectedTokens && Object.keys(tokenAllowances).length === 0) {
            checkAllowance();
        }
    }, [selectedTokens, deployedSaferootAddress, approveRes])


    return {

        allApproved,
        // allApproved is a boolean that indicates whether all selected tokens are approved
        // on the saferoot contract deployed by user

        tokenAllowances
        // tokenAllowances is an object that contains the allowance for each user-selected token

    }
}