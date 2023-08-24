import { useEffect, useState } from "react";
import { makeAPICall } from "../API/helpers";
import { APICalls } from "../API/types";
import { NFTData, TokenBalance, fetchSupportedTokensAndBalances } from "../../components/OnboardingSteps/Tables/gridhelper";
import { ethers } from "ethers";
import { Address, useNetwork } from "wagmi";
import { default as ERC721ABI } from "../../blockchain/abi/ERC721NFTABI.json";
import { default as ERC20ABI } from "../../blockchain/abi/ERC20TokensABI.json";

import { useData } from "../DataContext";
import { ETHEREUM_TOKEN_STANDARD, HttpStatusCode } from "../../constants";
import { AssetGuards, AssetType, IdentificationConditions, PropertyReplacements, approvals, ERC20Safeguard, ERC721Safeguard, AssetGuard } from "./types";


export const updateAssetProperties = (
    setData: React.Dispatch<React.SetStateAction<AssetGuards>>,
    assetType: AssetType,
    identificationConditions: IdentificationConditions,
    propertyReplacements: PropertyReplacements
): void => {
    setData((prev) => {
        return {
            ...prev,
            [assetType]: prev[assetType].map((asset) => {
                let shouldUpdate = true;
                for (const key in identificationConditions) {
                    if (asset[key] !== identificationConditions[key]) {
                        shouldUpdate = false;
                        break;
                    }
                }
                if (shouldUpdate) {
                    return {
                        ...asset,
                        ...propertyReplacements,
                    };
                }
                return asset;
            })
        };
    });
};

interface UseAssetGuardsReturnType {
    assetGuards: AssetGuards;
    setAssetGuards: React.Dispatch<React.SetStateAction<AssetGuards>>;
    refetch: () => Promise<void>;
}

const useAssetGuards = (): UseAssetGuardsReturnType => {
    const { chain } = useNetwork();
    const { state, dispatch } = useData();

    const [assetGuards, setAssetGuards] = useState<AssetGuards>({
        ERC20Assets: [],
        ERC721Assets: [],
    });
    const [NFTDetails, setNFTDetails] = useState<NFTData[] | null>([]);
    const [approvals, setApprovals] = useState<approvals>({});
    const [balances, setBalances] = useState<TokenBalance[] | null>([]);
    const [safeguards, setSafeguards] = useState({
        ERC20Safeguards: [],
        ERC721Safeguards: [],
    })

    const getSafegaurds = async (): Promise<void> => {
        const { data, status } = await makeAPICall(APICalls.GET_SAFEGUARDS, null, null, dispatch)
        if (status === HttpStatusCode.OK) {
            setSafeguards(data as { ERC20Safeguards: never[]; ERC721Safeguards: never[]; })
        }
    }

    const fetchAlchemyNFTs = async (): Promise<void> => {
        try {
            const { data: nftCollection } = await makeAPICall(APICalls.GET_USER_NFTS, { userWallet: state.userWallet as Address }, null, dispatch)
            const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            if (nftCollection?.ownedNfts?.length > 0) {
                const assets = await Promise.all(nftCollection.ownedNfts.map(async (asset) => {
                    if (asset.contractMetadata.tokenType !== ETHEREUM_TOKEN_STANDARD.ERC721) return null;

                    const contract = new ethers.Contract(asset.contract.address, ERC721ABI, provider);
                    const owner = await contract.ownerOf(asset.id.tokenId);
                    if (ethers.utils.getAddress(owner) !== ethers.utils.getAddress(state.userWallet)) return null;

                    let imageUrl = asset.metadata.image;
                    if (imageUrl?.startsWith('ipfs://')) {
                        imageUrl = `https://gateway.pinata.cloud/ipfs/${imageUrl.slice(7)}`;
                    }

                    return {
                        name: asset.metadata.name,
                        id: parseInt(asset.id.tokenId, 16).toString(),
                        imageUrl: asset.media[0].thumbnail || imageUrl,
                        tokenId: parseInt(asset.id.tokenId, 16).toString(),
                        collection: { name: asset.metadata.collection },
                        assetContract: {
                            address: asset.contract.address,
                            assetContractType: asset.contractMetadata.tokenType,
                        },
                    };
                }));

                const userNFTArrayCombined = [...assets.filter(Boolean)].reduce((acc, asset) => {
                    const index = acc.findIndex(nft => nft.tokenId === asset.tokenId && nft.assetContract.address === asset.assetContract.address);
                    if (index !== -1) {
                        acc[index] = asset;
                    } else {
                        acc.push(asset);
                    }
                    return acc;
                }, []);

                setNFTDetails(userNFTArrayCombined);
            }
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            setNFTDetails(null)
        }
    };

    const checkERC20Approvals = async (asset: ERC20Safeguard | ERC721Safeguard): Promise<string> => {
        try {
            const { address: tokenAddress } = asset as ERC20Safeguard;
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const tokenContract: ethers.Contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
            const allowance: string = await tokenContract.allowance(state.userWallet, state.deployedSaferootAddress) as string;
            return allowance;
        } catch (error) {
            console.error('Failed to fetch allowance:', error);
            throw error;
        }
    }

    const checkERC721Approvals = async (asset: ERC721Safeguard | ERC20Safeguard): Promise<string> => {
        try {
            const { contract_address: nftAddress, token_id: tokenId } = asset as ERC721Safeguard;
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const nftContract: ethers.Contract = new ethers.Contract(nftAddress, ERC721ABI, provider);
            const approvedAddress: string = await nftContract.getApproved(tokenId) as string;
            return approvedAddress;
        } catch (error) {
            console.error('Failed to check approval:', error);
            throw error;
        }
    }

    const getBalances = async (): Promise<void> => {
        const fetchedBalances = await fetchSupportedTokensAndBalances(chain?.id as number)
        setBalances(fetchedBalances.balances)
    };


    useEffect(() => {
        if (safeguards) {
            const checkAndSetApprovals = async (safeguard: ERC20Safeguard | ERC721Safeguard, checkFn: (asset: ERC20Safeguard | ERC721Safeguard) => Promise<string>) => {
                try {
                    const result = await checkFn(safeguard);
                    if ('address' in safeguard) {
                        return {
                            [safeguard.address]: {
                                isApproved: result.toString() !== '0',
                                allowance: result.toString(),
                            }
                        };
                    }
                    return {
                        [safeguard.contract_address]: {
                            isApproved: result.toString() !== null,
                        }
                    };
                } catch (error) {
                    console.error('Failed to check approval:', error);
                    return {};
                }
            };

            const approvalPromises = [
                ...safeguards.ERC20Safeguards.map(safeguard => checkAndSetApprovals(safeguard, checkERC20Approvals)),
                ...safeguards.ERC721Safeguards.map(safeguard => checkAndSetApprovals(safeguard, checkERC721Approvals))
            ];

            Promise.all(approvalPromises)
                .then(approvalResults => {
                    const newApprovals: approvals = Object.assign({}, ...approvalResults);
                    setApprovals(newApprovals);
                });
        }
    }, [safeguards]);

    useEffect(() => {
        fetchAlchemyNFTs();
        getBalances();
        getSafegaurds();
    }, []);

    useEffect(() => {
        if (safeguards && NFTDetails && approvals && balances) {
            const { ERC20Safeguards, ERC721Safeguards } = safeguards;
            let newAssetGuards = { ...assetGuards };

            const ERC20Assets = balances.map((ERC20Asset: TokenBalance) => {
                const ERC20Safeguard = ERC20Safeguards.find((safeguard: ERC20Safeguard) => safeguard.address === ERC20Asset.address)
                if (ERC20Asset.balance > 0) {
                    return {
                        asset: {
                            name: ERC20Asset.symbol.toUpperCase(),
                            image: "",
                        },
                        balance: ERC20Asset.balance,
                        security: ERC20Safeguard && Number(ethers.utils.formatEther((ERC20Safeguard as ERC20Safeguard).threshold_value)) > 0 ? ["Threshold Value: " + ethers.utils.formatEther((ERC20Safeguard as ERC20Safeguard).threshold_value)] : [],
                        status: {
                            isProtected: ERC20Safeguard && Number((ERC20Safeguard as ERC20Safeguard).threshold_value) > 0 ? true : false,
                            time: "",
                        },
                        address: ERC20Asset.address,
                        safeguardID: ERC20Safeguard ? (ERC20Safeguard as ERC20Safeguard).activation_hash : null,
                        safeguards: ERC20Safeguard ? [{ type: "threshold", value: (ERC20Safeguard as ERC20Safeguard)?.threshold_value }] : [],
                        isPreGuarded: !!ERC20Safeguard,
                        isSelected: false,
                        isApproved: ERC20Safeguard ? approvals[ERC20Asset.address]?.isApproved : false,
                        allowance: ERC20Safeguard ? approvals[ERC20Asset.address]?.allowance : '0',
                    }
                }
            }).filter(Boolean);

            const ERC721Assets = NFTDetails.map((ERC721Asset: NFTData) => {
                const ERC721Safeguard = ERC721Safeguards.find((safeguard: ERC721Safeguard) => (safeguard.contract_address === ERC721Asset.assetContract.address && safeguard.token_id === ERC721Asset.tokenId));
                return {
                    asset: {
                        name: ERC721Asset.name + " #" + ERC721Asset.id,
                        image: ERC721Asset.imageUrl,
                    },
                    collection: ERC721Asset.collection.name,
                    security: ERC721Safeguard && (ERC721Safeguard as ERC721Safeguard).enabled ? ["Lock"] : [],
                    status: {
                        isProtected: ERC721Safeguard ? (ERC721Safeguard as ERC721Safeguard).enabled : false,
                        time: "",
                    },
                    address: ERC721Asset.assetContract.address,
                    tokenId: ERC721Asset.id.toString(),
                    safeguardID: ERC721Safeguard ? (ERC721Safeguard as ERC721Safeguard).activation_hash : null,
                    safeguards: ERC721Safeguard ? [{ type: "lock", enabled: (ERC721Safeguard as ERC721Safeguard).enabled }] : [],
                    isPreGuarded: !!ERC721Safeguard,
                    isSelected: false,
                    isApproved: ERC721Safeguard ? approvals[(ERC721Safeguard as ERC721Safeguard).contract_address].isApproved : false,
                }
            }).filter(Boolean)

            newAssetGuards = {
                ERC20Assets: ERC20Assets as AssetGuard[],
                ERC721Assets: ERC721Assets as AssetGuard[],
            };

            setAssetGuards(newAssetGuards);
        }
    }, [NFTDetails, approvals, balances]);

    return {
        assetGuards,
        setAssetGuards,
        refetch: async (): Promise<void> => { await getSafegaurds() },
    }
};

export default useAssetGuards;