import { HttpStatusCode } from "../../constants";
import { Action, ActionType } from "../actions";
import { HAS_INVALID_PARAMS, UNEXPECTED_STATUS_CODE } from "./errors";
import { APICalls, API_PARAMS } from "./types";
import { schemas, ERC20SafeguardSchema, ERC721SafeguardSchema, supportedTokensSchema } from "./validations";

type DispatchType = React.Dispatch<Action>

const DEV_API_URL = "http://localhost:5433"

interface ValidateParamsType<T extends APICalls> {
  body: API_PARAMS[T]['body'] | null;
  url: API_PARAMS[T]['url'] | null;
}

export const makeAPICall = async <T extends APICalls>(
  key: T,
  urlParams: API_PARAMS[T]['url'] = null,
  bodyParams: API_PARAMS[T]['body'] = null,
  dispatch?: DispatchType 
): Promise<{ data: object | Array<object>, status: HttpStatusCode }> => {

  try {

    if (!validateParams(key, { body: bodyParams, url: urlParams })) {
      HAS_INVALID_PARAMS()
    }

    const { data, status } = await predefinedRequests(key, urlParams, bodyParams);
    if (status === HttpStatusCode.Created || status === HttpStatusCode.OK) {
      return { data, status };
    } else {
      UNEXPECTED_STATUS_CODE()
    }

  } catch (e) {
    throwModalError(dispatch, e);
    return { data: null, status: HttpStatusCode.BadRequest };
  }

}

export const predefinedRequests = async <T extends APICalls>(
  key: T,
  urlParams: API_PARAMS[T]['url'] = null,
  bodyParams: API_PARAMS[T]['body'] = null,
  dispatch: DispatchType | null = null
): Promise<{ data: unknown, status: HttpStatusCode }> => {

  let req, data, status;
  const headers = {
    'Content-Type': 'application/json',
  };
  const credentials = "include";

  switch (key) {

    // Auth

    case APICalls.NONCE:
      req = await fetch(`${DEV_API_URL}/nonce`, {
        method: "GET",
        credentials,
      });
      data = await req.text();
      status = req.status;
      return { data, status };

    case APICalls.VERIFY:
      req = await fetch(`${DEV_API_URL}/verify`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.ok;
      status = req.status;
      return { data, status };

    case APICalls.SIGN_OUT:
      req = await fetch(`${DEV_API_URL}/signout`, {
        method: "POST",
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // User Deployed Contracts

    case APICalls.CREATE_DEPLOYED_CONTRACT:
      req = await fetch(`${DEV_API_URL}/v0/settings/contract`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.GET_DEPLOYED_CONTRACT:
      req = await fetch(`${DEV_API_URL}/v0/settings/contract`, {
        method: "GET",
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // Assets

    case APICalls.GET_SUPPORTED_TOKENS:
      req = await fetch(`${DEV_API_URL}/ethereum/v0/${urlParams.chainId}/supported_token`, {
        method: "GET",
        headers,
      });
      data = await req.json();
      if (validFetchedResults(APICalls.GET_SUPPORTED_TOKENS, data)) {
        status = req.status;
        return { data, status };
      }
      return { data: [], status: HttpStatusCode.BadRequest };

    case APICalls.GET_USER_NFTS:
      req = await fetch(`https://eth-goerli.g.alchemy.com/nft/v2/Khsm5Voj_du9RXZe6CmhvqAZUY3DS6es/getNFTs?owner=${urlParams?.userWallet}&withMetadata=true&pageSize=100`, {
        method: "GET",
        headers,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    // Safeguards

    case APICalls.GET_SAFEGUARDS:
      req = await fetch(`${DEV_API_URL}/v0/safeguard`, {
        method: "GET",
        headers,
        credentials,
      });
      data = await req.json();
      if (validFetchedResults(APICalls.GET_SAFEGUARDS, data)) {
        status = req.status;
        return { data, status };
      }
      return { data: {}, status: HttpStatusCode.BadRequest };

    case APICalls.ADD_SAFEGUARD:
      req = await fetch(`${DEV_API_URL}/v0/safeguard/value_guard?blockchain=ethereum&network=goerli`, {
        method: "POST",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.EDIT_TOKEN_SAFEGUARD:
      req = await fetch(`${DEV_API_URL}/v0/safeguard/${urlParams.safeGuardId}/ERC20`, {
        method: "PUT",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.TOGGLE_NFT_SAFEGUARD:
      req = await fetch(`${DEV_API_URL}/v0/safeguard/${urlParams.safeGuardId}/ERC721`, {
        method: "DELETE",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    case APICalls.TOGGLE_TOKEN_SAFEGUARD:
      req = await fetch(`${DEV_API_URL}/v0/safeguard/${urlParams.safeGuardId}/ERC20`, {
        method: "DELETE",
        body: JSON.stringify(bodyParams),
        headers,
        credentials,
      });
      data = await req.json();
      status = req.status;
      return { data, status };

    default:
      throwModalError(dispatch, 'No such API Key.')
  }
};

const validFetchedResults = (key: APICalls, data: any): boolean => {

  switch (key) {
    case APICalls.GET_SUPPORTED_TOKENS:
      return Array.isArray(data) && !supportedTokensSchema.validate(data).error;

    case APICalls.GET_SAFEGUARDS:
      return data && data.ERC20Safeguards && data.ERC721Safeguards
        && Array.isArray(data.ERC20Safeguards) && !ERC20SafeguardSchema.validate(data.ERC20Safeguards).error
        && Array.isArray(data.ERC721Safeguards) && !ERC721SafeguardSchema.validate(data.ERC721Safeguards).error;

    default:
      return false;
  }

}

const validateParams = <T extends APICalls>(key: T, params: ValidateParamsType<T>): boolean => {

  switch (key) {

    case APICalls.NONCE:
    case APICalls.SIGN_OUT:
    case APICalls.GET_DEPLOYED_CONTRACT:
    case APICalls.GET_SAFEGUARDS:
      return !schemas.basic.validate(params).error;

    case APICalls.VERIFY:
      return !schemas.verify.validate(params).error;

    case APICalls.CREATE_DEPLOYED_CONTRACT:
      return !schemas.createDeployedContract.validate(params).error;

    case APICalls.GET_SUPPORTED_TOKENS:
      return !schemas.getSupportedTokens.validate(params).error;

    case APICalls.GET_USER_NFTS:
      return !schemas.getUserNFTs.validate(params).error;

    case APICalls.ADD_SAFEGUARD:
      return !schemas.addSafeguard.validate(params).error;

    case APICalls.EDIT_TOKEN_SAFEGUARD:
      return !schemas.editTokenSafeguard.validate(params).error;

    case APICalls.TOGGLE_TOKEN_SAFEGUARD:
    case APICalls.TOGGLE_NFT_SAFEGUARD:
      return !schemas.toggleSafeguard.validate(params).error;

    default:
      return false;

  }
}

const throwModalError = (dispatch: DispatchType | null, errorMessage: string): void => {
  if (dispatch) {
    dispatch({ type: ActionType.SET_LOADER, payload: { open: true, message: `Something went wrong on our end: ${errorMessage}. Please try again later.` } });
  }
}