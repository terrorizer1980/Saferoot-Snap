
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

export type AssetType = 'ERC20Assets' | 'ERC721Assets';
export interface IdentificationConditions { [key: string]: string | number }
export interface PropertyReplacements { [key: string]: unknown }

export interface ERC20Safeguard {
    activation_hash: string;
    address: string;
    name: string;
    price: number;
    supported_token_id: number;
    symbol: string;
    threshold_value: string;
}

export interface ERC721Safeguard {
    activation_hash: string;
    chain_id: number;
    contract_address: string;
    enabled: boolean;
    id: number;
    network_id: number;
    safeguard_type: string;
    token_id: string;
}

export interface Balance {
    address: string;
    balance: number;
    image: string;
    price: number;
    symbol: string;
    totalValue: number;
}

export interface AssetContract {
    address: string;
    assetContractType: string;
}

export interface Collection {
    name: string;
}

export interface NFTDetail {
    assetContract: AssetContract;
    collection: Collection;
    id: string;
    imageUrl: string;
    name: string;
    tokenId: string;
}
