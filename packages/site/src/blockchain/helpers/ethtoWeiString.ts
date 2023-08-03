import { ethers } from "ethers";
export const ethtoWeiString = (ethAmount: number) => {
  if (typeof ethAmount !== "number" || isNaN(ethAmount)) {
    throw new Error("ethAmount must be a number");
  } else if (ethAmount < 0) {
    throw new Error("ethAmount must be a positive number");
  }
  return ethers.utils.parseUnits(ethAmount.toString(), "ether").toString();
};
