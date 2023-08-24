import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { makeAPICall } from "../hooks/API/helpers";
import { APICalls } from "../hooks/API/types";

type OnAuthenticated = () => void;

export const AuthenticationAdapter = (onAuthenticated: OnAuthenticated) => createAuthenticationAdapter({

  getNonce: async (): Promise<string> => {
    const { data } = await makeAPICall(APICalls.NONCE);
    return data as string;
  },

  createMessage: ({ nonce, address, chainId }): SiweMessage => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to Saferoot.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },

  getMessageBody: ({ message }): string => {
    return message.prepareMessage();
  },

  verify: async ({ message, signature }): Promise<boolean> => {
    const { data } = await makeAPICall(APICalls.VERIFY, null, {
      message: message,
      signature: signature,
    });
    const verificationSuccessful = Boolean(data);
    if (verificationSuccessful) {
      onAuthenticated();
    }
    return verificationSuccessful;
  },

  signOut: async (): Promise<void> => {
    const { status } = await makeAPICall(APICalls.SIGN_OUT);
  },

});
