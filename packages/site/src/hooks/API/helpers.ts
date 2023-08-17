export const predefinedRequests = async (key: APICalls, urlParams = null, bodyParams = null) => {
  let req, data, status;
  const headers = {
    'Content-Type': 'application/json',
  };
  const credentials = "include";
  const DEV_API = "http://localhost:5433"
  const ALCHEMY_API_KEY = "Khsm5Voj_du9RXZe6CmhvqAZUY3DS6es"

  switch (key) {

    // Auth

    case APICalls.NONCE:
      req = await fetch(`${DEV_API}/nonce`, {
        method: "GET",
        credentials,
      });
      data = await req.text();
      status = req.status;
      return { data, status };

    case APICalls.VERIFY:
      req = await fetch(`${DEV_API}/verify`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      })
      data = await req.ok;
      status = req.status;
      return { data, status };

    case APICalls.SIGN_OUT:
      req = await fetch(`${DEV_API}/signout`, {
        method: "POST",
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // User Deployed Contracts

    case APICalls.CREATE_DEPLOYED_CONTRACT:
      req = await fetch(`${DEV_API}/createDeployedContract`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.GET_DEPLOYED_CONTRACT:
      req = await fetch(`${DEV_API}/getDeployedContract`, {
        method: "GET",
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // Assets

    case APICalls.GET_SUPPORTED_TOKENS:
      req = await fetch(`${DEV_API}/ethereum/v0/${urlParams.chainId}/supported_token`, {
        method: "GET",
        headers,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.GET_USER_NFTS:
      req = await fetch(`https://eth-goerli.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs?owner=${urlParams?.userWallet}&withMetadata=true&pageSize=100`, {
        method: "GET",
        headers,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // Safeguards

    case APICalls.GET_SAFEGUARDS:
      req = await fetch(`${DEV_API}/v0/getSafeguards`, {
        method: "GET",
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.ADD_SAFEGUARD:
      req = await fetch(`${DEV_API}/v0/safeguard/value_guard?blockchain=ethereum&network=goerli`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.EDIT_TOKEN_SAFEGUARD:
      req = await fetch(`${DEV_API}/v0/safeguard/${urlParams.safeGuardId}/ERC20`, {
        method: "PUT",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.EDIT_NFT_SAFEGUARD:
      req = await fetch(`${DEV_API}/v0/safeguard/${urlParams.safeGuardId}/ERC721`, {
        method: "DELETE",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.DELETE_TOKEN_SAFEGUARD:
      req = await fetch(`${DEV_API}/v0/safeguard/${urlParams.safeGuardId}/ERC20`, {
        method: "DELETE",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    default:
      throw new Error(`Unhandled API Call Key: ${key}`);
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
  ONE_MINUTE = 1000 * 60,
  ONE_HOUR = 1000 * 60 * 60,
  ONE_DAY = 1000 * 60 * 60 * 24,
}
