import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import Cookies from "js-cookie";
import { APICalls, predefinedRequests } from "../hooks/API/helpers";

export const AuthenticationAdapter = (onAuthenticated) =>
  createAuthenticationAdapter({
    getNonce: async (): Promise<string> => {
      const { data } = await predefinedRequests(APICalls.NONCE)
      return data;
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
      const { data } = await predefinedRequests(APICalls.VERIFY, null, {
        message,
        signature
      })
      const verificationSuccessful = Boolean(data);
      if (verificationSuccessful) {
        setLocalStorage("authenticated-address", message.address);
        onAuthenticated();
      }
      return verificationSuccessful;
    },
    signOut: async (): Promise<void> => {
      await fetch("/api/logout");
    },
  });
