import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Heading, Subtitle, ErrorMessage } from "../../styling/styles";
import { simpleEthereumAddressValidator, EnableWalletBackup } from "..";
import { Address, useNetwork } from "wagmi";
import { TokenGrid, NFTGrid } from "./SafeguardSelectionPage";
import { default as SaferootABI } from "../../blockchain/abi/SaferootABI.json";
import {
  Container,
  Left,
  Right,
  RoundedGrayContainers,
  PurpleCircle,
  RoundedWhiteContainer,
} from "./styles";

import { useData } from "../../hooks/DataContext";
import { Page } from "../../hooks/actions";
import { TokenType } from "../../blockchain/enums";
import { UserWalletWidget } from "../UserWalletWidget";
import FixedNavigationBottomBar from "../FixedNavigationBottomBar";
import { NFT_SUPPORT_ENABLED } from "../../config/environmentVariable";
import { HttpStatusCode } from "../../constants";
import { useLoader } from "../../hooks/useLoader";
import { LoaderModal } from "../LoaderModal";
import { ValueSafeguard } from "./SafeguardSetup/Safeguards/ValueSafeguard";
import { SimpleButton } from "../SimpleButton";
import { ethtoWeiString } from "../../blockchain/helpers/ethtoWeiString";

export const ReviewPage = ({ setSelectedTab, prevTab }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [res, setRes] = useState({ isLoading: false, isSuccess: false, isError: false })
  const { state } = useData();
  const {
    backupWallet,
    userWallet,
    deployedSaferootAddress,
    selectedTokens,
    selectedNFTs,
    userTokenBalances,
    userNFTs,
    tokenSafeguards,
    nftSafeguards,
  } = state;
  const { chain } = useNetwork();
  const APIsCalled = useRef([]);

  const convertTokenAmount = (amount: number, forContract: boolean) => {
    return forContract ? ethtoWeiString(amount) : amount.toString();
  };

  function getSafeguardContractObject(isForContract = false) {
    let convertedSafeguardContractObject = [];
    if (state.tokenSafeguards) {
      convertedSafeguardContractObject = state.tokenSafeguards.map((safeguard) => {
        // TODO: Add value limit support to the safeguard value
        const safeguardValue = safeguard as ValueSafeguard;
        return [
          TokenType.ERC20,
          safeguardValue.asset as Address,
          convertTokenAmount(safeguardValue.amount, isForContract),
          0,
        ];
      });
    }
    if (state.nftSafeguards) {
      convertedSafeguardContractObject = [...convertedSafeguardContractObject, ...state.nftSafeguards.map((safeguardObject) => {
        return [
          TokenType.ERC721,
          safeguardObject.asset as Address,
          0,
          safeguardObject.id,
        ];
      })];
    }
    return convertedSafeguardContractObject;
  }

  const { setMessage, setOpen, open, message } = useLoader()


  /**
   *  Creates the safeguard on the backend
   * @param safeGuardId The safeguard id returned from the blockchain
   * @param ERC20ValuesArray An array of the asset address and contract value for the safeguard
   */
  const createSafeGuardAPI = async (safeGuardId, ERC20ValuesArray, NFTValuesArray) => {
    if (APIsCalled.current.includes(safeGuardId)) {
      return;
    }
    APIsCalled.current.push(safeGuardId);
    try {
      const result = await fetch(
        `http://localhost:5433/v0/safeguard/value_guard?blockchain=ethereum&network=goerli`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            safeGuardId: safeGuardId,
            networkId: chain.id,
            enabled: true,
            ceilingThresholds: [
              {
                "ERC20": ERC20ValuesArray,
                "ERC721": NFTValuesArray,
                "ERC1155": [
                ]
              }
            ]
          }),
          credentials: "include",
        }
      );

      if (result.status === HttpStatusCode.Unauthorized) {
        setErrorMessage(
          "Please ensure you have the correct wallet in focus and have been authenticated."
        );
        setButtonClicked(false);
        return;
      }

      if (result.status === HttpStatusCode.Created) {
        setMessage("")
        setOpen(false)
        setSelectedTab(Page.Success);
        return;
      } else {
        setOpen(true)
        setMessage("Failed to store safeguards, please try again!")
      }
    } catch (error) {
      setButtonClicked(false);
      setMessage("Failed to store safeguards, please try again!")
    }
  };

  useEffect(() => {
    switch (true) {
      case res.isLoading:
        setMessage("Setting up Saferoot!");
        setOpen(true);
        break;
      case res.isError:
        setMessage("The contract was not saved correctly, please maintain a copy of your contract address. And contact support.");
        break;
      default:
        break;
    }
  }, [res])
  const [currentKey, setCurrentKey] = useState<number>(0);
  const writeSafeguard = async () => {
    try {
      if (typeof (window) !== 'undefined') {
        setRes({ isLoading: true, isSuccess: false, isError: false });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const deployedSaferootContract = new ethers.Contract(
          deployedSaferootAddress,
          SaferootABI,
          signer
        );
        const safeguardContractObject = getSafeguardContractObject(true);
        const currentKey = await deployedSaferootContract.currentSafeguardKey();
        setCurrentKey(Number(currentKey));
        const tx = await deployedSaferootContract.addSafeguard(
          safeguardContractObject
        );
        const receipt = await tx.wait();
        return receipt;
      }
    } catch (error) {
      setButtonClicked(false);
      setErrorMessage(error.message);
      setRes({ isLoading: false, isSuccess: false, isError: true });
    }
  };

  function decodeKey(encodedKey: string): [TokenType, number] {
    const key = BigInt(encodedKey);
    // Extract the token type by shifting the key to the right by 248 bits
    const tokenType = Number((key >> BigInt(248)) & BigInt(0xff));
    // Extract the ID by getting the lower 248 bits of the key
    const id = Number(key & BigInt("0x0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
    return [tokenType, id];
  }


  // Create the event listener once only, by creating it on mounting
  useEffect(() => {
    // Listen to the SafeguardAdded event
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const deployedSaferootContract = new ethers.Contract(
      deployedSaferootAddress,
      SaferootABI,
      provider
    );

    const setSafeguardNumber = async () => {
      try {
        const key = await deployedSaferootContract.currentSafeguardKey();
        setCurrentKey(Number(key));


        deployedSaferootContract.on("ERC20SafeguardAdded", (eventData) => {
          const [tokenType, id] = decodeKey(eventData);
          if (tokenType !== TokenType.ERC20) return;
          const safeguards_existing = getSafeguardContractObject();
          const safeguardObjectFromEvent = safeguards_existing[id - key]

          // To ensure we don't submit duplicate values into the array, we need to filter out the duplicates
          try {
            createSafeGuardAPI(eventData,
              [{
                contractAddress: safeguardObjectFromEvent[1],
                value_limit: safeguardObjectFromEvent[2]
              }
              ],
              []
            );
          } catch (error) {
            setButtonClicked(false);
            setErrorMessage("Failed to store safeguards, please try again!");
          }

        });

        deployedSaferootContract.on("ERC721SafeguardAdded", (eventData) => {
          const [tokenType, id] = decodeKey(eventData);
          if (tokenType !== TokenType.ERC721) return;
          const safeguards_existing = getSafeguardContractObject();

          const safeguardObjectFromEvent = safeguards_existing[id - key]

          try {
            createSafeGuardAPI(eventData,
              [],
              [{
                contractAddress: safeguardObjectFromEvent[1],
                tokenId: safeguardObjectFromEvent[3].toString(),
                networkId: chain.id,
                chainId: chain.id,
              }]
            );
          } catch (error) {
            setButtonClicked(false);
            setErrorMessage("Failed to store safeguards, please try again!");
          }
        });
      } catch (error) {
        setButtonClicked(false);
        setErrorMessage(error.message);
        setRes({ isLoading: false, isSuccess: false, isError: true });
      }
    };
    setSafeguardNumber();

    return () => {
      deployedSaferootContract.removeAllListeners("ERC20SafeguardAdded");
      deployedSaferootContract.removeAllListeners("ERC721SafeguardAdded");
    };
  }, []);


  const [isSafeguardValid, setIsSafeguardValid] = useState(false);

  useEffect(() => {
    // Determine if each selected token has a corresponding token safeguard that is valid and enabled
    const valid = selectedTokens.every((token) =>
      tokenSafeguards.find(
        (sg) => sg.asset === token && sg.isEnabled && sg.isValid
      )
    );

    setIsSafeguardValid(valid);

    // If the selectedTokens or the tokenSafeguards are not correctly set up, display error message
    if (!valid) {
      setErrorMessage("Please correctly setup the token safeguards prior.");
    }
  }, [selectedTokens, tokenSafeguards]);

  return (
    <Container>
      <LoaderModal open={open} message={message} />
      <Left>
        <UserWalletWidget />
      </Left>
      <Right>
        <RoundedWhiteContainer style={{ maxWidth: "1200px" }}>
          <Heading>
            Review Safeguards
          </Heading>
          <p>
            Verify that all the information below is accurate. You can make
            changes to your safeguards within your account.
          </p>
          <div className="leftColumn">
            <Subtitle>Your wallet address</Subtitle>
            <br />
            <RoundedGrayContainers>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyItems: "space-around",
                }}
              >
                <PurpleCircle />
                {userWallet}
              </div>
            </RoundedGrayContainers>
          </div>
          <div className="rightColumn">
            <br />
            <Subtitle>Assets to be protected</Subtitle>
            <br />
            <RoundedGrayContainers>
              <TokenGrid
                balances={userTokenBalances}
                setCurrentAsset={() => {
                  return null;
                }}
                tokenSafeguards={tokenSafeguards}
                selectedTokens={selectedTokens}
                editDisabled={true}
              />
            </RoundedGrayContainers>
            <br />
            {NFT_SUPPORT_ENABLED && (
              <RoundedGrayContainers>
                <NFTGrid nfts={userNFTs}
                  selectedNFTs={selectedNFTs}
                  nftSafeguards={nftSafeguards}
                  setCurrentAsset={() => {
                    return null;
                  }}
                  editDisabled={true} />
              </RoundedGrayContainers>
            )}
          </div>
          <br />
          <Subtitle>Your backup wallet address</Subtitle>
          <br />
          <RoundedGrayContainers>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyItems: "space-around",
              }}
            >
              <PurpleCircle />
              {backupWallet}
            </div>
          </RoundedGrayContainers>
          {selectedNFTs.length <= 0 && selectedTokens.length <= 0 && (
            <ErrorMessage>
              You must choose to protect at least one asset to protect.
            </ErrorMessage>
          )}
          {backupWallet === '' && (
            <ErrorMessage>You must provide a backup wallet address.</ErrorMessage>
          )}
          {simpleEthereumAddressValidator(backupWallet) ===
            false && (
              <ErrorMessage>The backup address is not a valid Ethereum address.</ErrorMessage>
            )}
          {userWallet === '' && (
            <ErrorMessage>You must provide a user wallet address.</ErrorMessage>
          )}
          {simpleEthereumAddressValidator(userWallet) ===
            false && (
              <ErrorMessage>The user wallet address is not a valid Ethereum address.</ErrorMessage>
            )}
          {userWallet === backupWallet && (
            <ErrorMessage>
              The user wallet cannot be the same as the backup wallet
            </ErrorMessage>
          )}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </RoundedWhiteContainer>
      </Right>
      <FixedNavigationBottomBar message="Submit your safeguard">
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton
          disabled={
            !isSafeguardValid ||
            !backupWallet ||
            !simpleEthereumAddressValidator(backupWallet) ||
            !userWallet ||
            !simpleEthereumAddressValidator(userWallet) ||
            (selectedNFTs.length <= 0 && selectedTokens.length <= 0) ||
            userWallet === backupWallet ||
            buttonClicked
          }
          type={
            !isSafeguardValid ||
              !backupWallet ||
              !simpleEthereumAddressValidator(backupWallet) ||
              !userWallet ||
              !simpleEthereumAddressValidator(userWallet) ||
              (selectedNFTs.length <= 0 && selectedTokens.length <= 0) ||
              userWallet === backupWallet
              ? "secondary"
              : "primary"
          }
          onClick={() => {
            writeSafeguard();
            setButtonClicked(true); // this line is added to set the button state to clicked
          }}> Finish! </SimpleButton>
      </FixedNavigationBottomBar>
    </Container>
  );
};
