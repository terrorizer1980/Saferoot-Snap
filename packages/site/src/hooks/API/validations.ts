import Joi from 'joi';

const regexes = {
    contractAddress: /^0x[a-fA-F0-9]{40}$/,
    safeGuardId: /^0x[a-fA-F0-9]{64}$/,
};

const isNumber = Joi.number().required()

const isString = Joi.string().required()

const isNull = Joi.any().valid(null).required()

const isBoolean = Joi.boolean().required()

export const schemas = {
    basic: Joi.object({
        body: isNull,
        url: isNull,
    }),
    verify: Joi.object({
        body: Joi.object({
            message: Joi.object().required(),
            signature: isString,
        }),
        url: isNull,
    }),
    createDeployedContract: Joi.object({
        body: Joi.object({
            chainId: isNumber,
            networkId: isNumber,
            contractAddress: Joi.string().pattern(regexes.contractAddress).required(),
            userWalletAddress: Joi.string().pattern(regexes.contractAddress).required(),
        }),
        url: isNull,
    }),
    getSupportedTokens: Joi.object({
        body: isNull,
        url: Joi.object({
            chainId: isNumber,
        }),
    }),
    getUserNFTs: Joi.object({
        body: isNull,
        url: Joi.object({
            chainId: isNumber,
        }),
    }),
    addSafeguard: Joi.object({
        body: Joi.object({
            safeGuardId: Joi.string().pattern(regexes.safeGuardId).required(),
            networkId: isNumber,
            enabled: isBoolean,
            ceilingThresholds: Joi.array().required(),
        }),
        url: isNull,
    }),
    editTokenSafeguard: Joi.object({
        body: Joi.object({
            contractAddress: Joi.string().pattern(regexes.contractAddress).required(),
            value_limit: isString,
        }),
        url: Joi.object({
            safeGuardId: Joi.string().pattern(regexes.safeGuardId).required(),
        }),
    }),
    toggleSafeguard: Joi.object({
        body: Joi.object({
            enabled: isBoolean,
        }),
        url: Joi.object({
            safeGuardId: Joi.string().pattern(regexes.safeGuardId).required(),
        }),
    }),
};

export const supportedTokensSchema = Joi.array().items(
    Joi.object({
        address: Joi.string().pattern(regexes.contractAddress).required(),
        chain_id: isNumber,
        last_updated: isString,
        name: isString,
        network_id: isNumber,
        price: isNumber,
        symbol: isString,
        token_image_url: Joi.string().allow('').required(),
    })
);

export const ERC20SafeguardSchema = Joi.array().items(
    Joi.object({
        activation_hash: Joi.string().pattern(regexes.safeGuardId).required(),
        address: Joi.string().pattern(regexes.contractAddress).required(),
        name: isString,
        price: isNumber,
        supported_token_id: isNumber,
        symbol: isString,
        threshold_value: isString,
    }));

export const ERC721SafeguardSchema = Joi.array().items(
    Joi.object({
        activation_hash: Joi.string().pattern(regexes.safeGuardId).required(),
        chain_id: isNumber,
        contract_address: Joi.string().pattern(regexes.contractAddress).required(),
        enabled: isBoolean,
        id: isNumber,
        network_id: isNumber,
        safeguard_type: isString,
        token_id: isString,
    }));