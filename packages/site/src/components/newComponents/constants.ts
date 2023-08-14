
export const defaultAvatar = "/defaultAvatar.png";
export const defaultIcon = "/defaultCoin.png";
export const defaultTagIcon = "/defaultTag.png";
export const defaultUser = "/defaultUser.png";

export const totalReviewSteps = 2
export const mobileViewWidthBreak = 900

// dropdown selection data
export const AssetSelectionFilter = [
  {label: 'option1', value: 'option1'},
  {label: 'option2', value: 'option2'},
  {label: 'option3', value: 'option3'},
  {label: 'option4', value: 'option4'},
]

// enums for hardcoded strings throughout components
export enum ButtonTypes {
  Small = 'small',
  Large = 'large'
}

export enum AssetTypes {
  Token = 'token',
  NFT = 'nft'
}

export enum UsefulValues {
  MaxVisibleName = 10,
}

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "900px",
  xl: "1280px",
  "2xl": "1536px",
};

export const devices = {
  xs: `(max-width: ${breakpoints.xs})`,
  sm: `(max-width: ${breakpoints.sm})`,
  md: `(max-width: ${breakpoints.md})`,
  lg: `(max-width: ${breakpoints.lg})`,
  xl: `(max-width: ${breakpoints.xl})`,
  "2xl": `(max-width: ${breakpoints["2xl"]})`,
};


