export const ETH_ADDRESS_LENGTH_WITHOUT_PREFIX = 40;
export const ETH_ADDRESS_LENGTH_WITH_PREFIX = 42;
export enum ASSET_TYPE {
  TOKEN,
  NFT,
}

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  TooManyRequests = 429,
  InternalServerError = 500,
}

export enum NAVIGATION_PATHS {
  ONBOARDING = '/',
  DASHBOARD = '/management',
}