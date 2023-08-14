

export const predefinedRequests = (key, urlParams = null, bodyParams = null) => {
    // takes in a key (+params) and returns a request object
  
    switch (key) {
  
      /*
      *
      * Auth
      *   
      */
  
      case APICalls.NONCE:
        return {
          key: APICalls.NONCE,
          request: {
            url: `http://localhost:5433/nonce`,
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.VERIFY:
        return {
          key: APICalls.VERIFY,
          request: {
            url: `http://localhost:5433/verify`,
            method: "POST",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.SIGN_OUT:
        return {
          key: APICalls.SIGN_OUT,
          request: {
            url: `http://localhost:5433/signout`,
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      /*
      *
      * User Deployed Contracts
      * 
      */
  
      case APICalls.CREATE_DEPLOYED_CONTRACT:
        return {
          key: APICalls.CREATE_DEPLOYED_CONTRACT,
          request: {
            url: `http://localhost:5433/createDeployedContract`,
            method: "POST",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.GET_DEPLOYED_CONTRACT:
        return {
          key: APICalls.GET_DEPLOYED_CONTRACT,
          request: {
            url: `http://localhost:5433/getDeployedContract`,
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
          cacheDuration: DURATIONS.ONE_DAY,
        };
  
      /*
      *
      * Assets
      * 
      */
  
      case APICalls.GET_SUPPORTED_TOKENS:
        return {
          key: APICalls.GET_SUPPORTED_TOKENS,
          request: {
            url: `http://localhost:5433/ethereum/v0/${urlParams.chainId}/supported_token`,
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
          },
          cacheDuration: DURATIONS.ONE_DAY,
        };
  
      case APICalls.GET_USER_NFTS:
        return {
          key: APICalls.GET_USER_NFTS,
          request: {
            url: `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.GATSBY_REACT_APP_ALCHEMY_API_KEY}/getNFTs?owner=${state.userWallet}&withMetadata=true&pageSize=100`,
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
          },
        };
  
  
      /*
      *
      * Safeguards
      * 
      */
  
      case APICalls.GET_SAFEGUARDS:
        return {
          key: APICalls.GET_SAFEGUARDS,
          request: {
            url: `http://localhost:5433/v0/getSafeguards`,
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.ADD_SAFEGUARD:
        return {
          key: APICalls.ADD_SAFEGUARD,
          request: {
            url: `http://localhost:5433/v0/safeguard/value_guard?blockchain=ethereum&network=goerli`,
            method: "POST",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.EDIT_TOKEN_SAFEGUARD:
        return {
          key: APICalls.EDIT_TOKEN_SAFEGUARD,
          request: {
            url: `http://localhost:5433/v0/safeguard/${urlParams.safeGuardId}/ERC20`,
            method: "PUT",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.EDIT_NFT_SAFEGUARD:
        return {
          key: APICalls.EDIT_NFT_SAFEGUARD,
          request: {
            url: `http://localhost:5433/v0/safeguard/${urlParams.safeGuardId}/ERC721/`,
            method: "DELETE",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
      case APICalls.DELETE_TOKEN_SAFEGUARD:
        return {
          key: APICalls.DELETE_TOKEN_SAFEGUARD,
          request: {
            url: `http://localhost:5433/v0/safeguard/${urlParams.safeGuardId}/ERC20/`,
            method: "DELETE",
            body: JSON.stringify(bodyParams),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        };
  
    }
  
  };
  
  export enum APICalls {
    NONCE = "nonce",
    VERIFY = "verify",
    SIGN_OUT = "signOut",
    CREATE_DEPLOYED_CONTRACT = "createDeployedContract",
    GET_DEPLOYED_CONTRACT = "getDeployedContract",
    GET_SUPPORTED_TOKENS = "getSupportedTokens",
    GET_USER_NFTS = "getUserNFTs",
    GET_SAFEGUARDS = "getSafeguards",
    ADD_SAFEGUARD = "addSafeguard",
    EDIT_TOKEN_SAFEGUARD = "editTokenSafeguard",
    DELETE_TOKEN_SAFEGUARD = "deleteTokenSafeguard",
    EDIT_NFT_SAFEGUARD = "editNFTSafeguard",
  }
  
  export enum DURATIONS {
    // in milliseconds
  
    // 1 minute
    ONE_MINUTE = 1000 * 60,
  
    // 1 hour
    ONE_HOUR = 1000 * 60 * 60,
  
    // 1 day
    ONE_DAY = 1000 * 60 * 60 * 24,
  
  }