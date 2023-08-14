import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import Cookies from "js-cookie";

export const AuthenticationAdapter = (onAuthenticated) =>
  createAuthenticationAdapter({
    getNonce: async (): Promise<string> => {
      const response = await fetch(`http://localhost:5433/nonce`, {
        credentials: "include",
      });
      return await response.text();
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
      const verifyRes = await fetch(`http://localhost:5433/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
        credentials: "include",
      });
      const verificationSuccessful = Boolean(verifyRes.ok);
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
