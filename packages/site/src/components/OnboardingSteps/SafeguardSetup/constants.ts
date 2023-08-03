export const SAFEGUARDS_MAPPING = {
  value: {
    title: "Token Value",
    description:
      "Trigger a transfer if a transaction exceeds a specified amount for this token.",
    iconUrl: "./TokenValue.png",
  },
  lock_erc_721: {
    title: "Block Transfer",
    description: "Blocks the transfer of this NFT.",
    iconUrl: "./time-logo.png",
  },
  forta: {
    title: "Forta",
    description:
      "Detect Web3 Threats and Anomalies in Real-Time with Machine Learning.",
    iconUrl: "./time-logo.png",
  },
};

export enum SAFEGUARD_TYPE {
  THRESHOLD = "threshold",
  TIME_LOCK = "timeLock",
  LOCK_ERC_721 = "lock_erc_721",
  FORTA = "forta",
}
