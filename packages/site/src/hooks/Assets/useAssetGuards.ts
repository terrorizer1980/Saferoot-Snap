import { useEffect, useState } from "react";
import { APICalls, predefinedRequests } from "../API/helpers";
import { NFTData, TokenBalance, fetchSupportedTokensAndBalances } from "../../components/OnboardingSteps/Tables/gridhelper";
import { ethers } from "ethers";
import { useNetwork } from "wagmi";
import { default as ERC721ABI } from "../../blockchain/abi/ERC721NFTABI.json";
import { default as ERC20ABI } from "../../blockchain/abi/ERC20TokensABI.json";

import { useData } from "../DataContext";
import { ETHEREUM_TOKEN_STANDARD, HttpStatusCode } from "../../constants";

export interface AssetGuard {
    asset: {
        name: string;
        image: string;
    }
    collection?: string;
    tokenId?: string;
    balance?: number;
    security: string[];
    status: {
        isProtected: boolean;
        time: string;
    }
    address: string;
    safeguardID: string;
    safeguards: {
        type: string;
        value?: string;
        enabled?: boolean;
    }[];
    isPreGuarded: boolean;
    isSelected: boolean;
    isApproved: boolean;
    allowance?: string;
}

export interface AssetGuards {
    ERC20Assets: AssetGuard[];
    ERC721Assets: AssetGuard[];
}

export interface approvals {
    [key: string]: {
        isApproved?: boolean;
        allowance?: string;
    };
}

export const updateAssetProperties = (setData, assetType, identificationConditions, propertyReplacements) => {
    setData((prev) => {
        return {
            ...prev,
            [assetType]: prev[assetType].map((asset) => {
                let shouldUpdate = true;
                for (let key in identificationConditions) {
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

const useAssetGuards = () => {
    const { chain } = useNetwork();
    const { state } = useData();

    const [assetGuards, setAssetGuards] = useState<AssetGuards>({
        ERC20Assets: [],
        ERC721Assets: [],
    });
    const [NFTDetails, setNFTDetails] = useState<NFTData[]>([]);
    const [approvals, setApprovals] = useState<approvals>({});
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [safeguards, setSafeguards] = useState({
        ERC20Safeguards: [],
        ERC721Safeguards: [],
    })

    const getSafegaurds = async () => {
        const { data, status } = await predefinedRequests(APICalls.GET_SAFEGUARDS)
        if (status === HttpStatusCode.OK) {
            setSafeguards(data)
        }
    }

    const fetchAlchemyNFTs = async () => {
        try {
            const { data: nftCollection } = await predefinedRequests(APICalls.GET_USER_NFTS, { userWallet: state.userWallet })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
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

    async function checkERC20Approvals(asset) {
        try {
            const { address: tokenAddress } = asset;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
            const allowance = await tokenContract.allowance(state.userWallet, state.deployedSaferootAddress);
            return allowance;
        } catch (error) {
            console.error('Failed to fetch allowance:', error);
            throw error;
        }
    }

    async function checkERC721Approvals(asset) {
        try {
            const { contract_address: nftAddress, token_id: tokenId } = asset;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const nftContract = new ethers.Contract(nftAddress, ERC721ABI, provider);
            const approvedAddress = await nftContract.getApproved(tokenId);
            return approvedAddress;
        } catch (error) {
            console.error('Failed to check approval:', error);
            throw error;
        }
    }

    const getBalances = async () => {
        const fetchedBalances = await fetchSupportedTokensAndBalances(chain.id)
        setBalances(fetchedBalances.balances)
    };


    useEffect(() => {
        if (safeguards) {
            const checkAndSetApprovals = async (safeguard, checkFn) => {
                try {
                    const result = await checkFn(safeguard);
                    if (safeguard.address) {
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
                ...safeguards.ERC20Safeguards?.map(safeguard => checkAndSetApprovals(safeguard, checkERC20Approvals)),
                ...safeguards.ERC721Safeguards?.map(safeguard => checkAndSetApprovals(safeguard, checkERC721Approvals))
            ];

            Promise.all(approvalPromises)
                .then(approvalResults => {
                    const newApprovals = Object.assign({}, ...approvalResults);
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

            const ERC20Assets = balances.map((ERC20Asset: any) => {
                const ERC20Safeguard = ERC20Safeguards.find((safeguard: any) => safeguard.address === ERC20Asset.address);
                if (ERC20Asset.balance > 0) {
                    return {
                        asset: {
                            name: ERC20Asset.symbol.toUpperCase(),
                            image: "",
                        },
                        balance: ERC20Asset.balance,
                        security: ERC20Safeguard && Number(ethers.utils.formatEther(ERC20Safeguard?.threshold_value)) > 0 ? ["Threshold Value: " + ethers.utils.formatEther(ERC20Safeguard?.threshold_value)] : [],
                        status: {
                            isProtected: ERC20Safeguard ? ERC20Safeguard?.threshold_value > 0 : false,
                            time: "",
                        },
                        address: ERC20Asset.address,
                        safeguardID: ERC20Safeguard?.activation_hash || null,
                        safeguards: ERC20Safeguard ? [{ type: "threshold", value: ERC20Safeguard?.threshold_value }] : [],
                        isPreGuarded: !!ERC20Safeguard,
                        isSelected: false,
                        isApproved: ERC20Safeguard ? approvals[ERC20Asset.address]?.isApproved : false,
                        allowance: ERC20Safeguard ? approvals[ERC20Asset.address]?.allowance : '0',
                    }
                }
            }).filter(Boolean);

            const ERC721Assets = NFTDetails.map((ERC721Asset: any) => {
                const ERC721Safeguard = ERC721Safeguards.find((safeguard: any) => (safeguard.contract_address === ERC721Asset.assetContract.address && safeguard.token_id === ERC721Asset.tokenId));
                return {
                    asset: {
                        name: ERC721Asset.name + " #" + ERC721Asset.id,
                        image: ERC721Asset.imageUrl,
                    },
                    collection: ERC721Asset.collection.name,
                    security: ERC721Safeguard?.enabled ? ["Lock"] : [],
                    status: {
                        isProtected: ERC721Safeguard?.enabled,
                        time: "",
                    },
                    address: ERC721Asset.assetContract.address,
                    tokenId: ERC721Asset.id,
                    safeguardID: ERC721Safeguard?.activation_hash || null,
                    safeguards: ERC721Safeguard ? [{ type: "lock", enabled: ERC721Safeguard?.enabled }] : [],
                    isPreGuarded: !!ERC721Safeguard,
                    isSelected: false,
                    isApproved: ERC721Safeguard ? approvals[ERC721Safeguard?.contract_address]?.isApproved : false,
                }
            }).filter(Boolean)

            newAssetGuards = {
                ERC20Assets: ERC20Assets,
                ERC721Assets: ERC721Assets,
            };

            setAssetGuards(newAssetGuards);
        }
    }, [NFTDetails, approvals, balances]);

    return {
        assetGuards,
        setAssetGuards,
        refetch: () => { getSafegaurds() },
    }
};

export default useAssetGuards;