import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useData } from "../../hooks/DataContext";
import { ActionType } from "../../hooks/actions";
import { ErrorMessage, Heading, RoundedInput } from "../../styling/styles";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ownerOf, tokenURI } from "../../blockchain/functions";
import { Address, useAccount, useNetwork } from "wagmi";
import { SimpleButton } from "../SimpleButton";


const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  boxShadow: 24,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: "25px",
};

// Modal that allows a user to know which assets that want to setup safeguards with
export default function CustomNFTInsertionModal() {
  const { dispatch } = useData();
  const { address } = useAccount();
  const { chain } = useNetwork();
  // Sets whether or not the modal is displayed
  const [open, setOpen] = React.useState(false);

  const [formState, setFormState] = React.useState<{ tokenAddress: Address; tokenId: string }>({
    tokenAddress: "",
    tokenId: "",
  });

  const [error, setError] = React.useState<string>("");

  const ownerOfNFT = ownerOf(formState);
  const ownerTokenURI = tokenURI(formState);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.tokenAddress || !formState.tokenId) {
      setError("Please enter a contract address and token ID");
      return;
    }

    if (!ownerOfNFT.data) {
      setError("This is not an NFT's address");
      return;
    }

    if (address.toString() === ownerOfNFT.data.toString()) {
      let metadata = {};
      // Do this afterwards, in which we will parse the NFT's metadata from tokenURI

      if (ownerTokenURI.data) {
        try {
          const nftMetadata = await fetch(ownerTokenURI.data.toString());
          metadata = await nftMetadata.json();
        } catch (e) {
          console.log("error parsing tokenURI", e)
        }
      }
      dispatch({
        type: ActionType.ADD_USER_NFT,
        payload: {
          name: metadata?.name || "Unknown",
          id: metadata?.id || null,
          imageUrl: metadata?.image || null,
          tokenId: Number(formState.tokenId),
          collection: {
            id: null,
            name: metadata?.collection || "Unknown",
          },
          ethAmount: null,
          usdAmount: null,
          assetContract: {
            address: formState.tokenAddress,
            chainIdentifier: chain.id,
            schemaName: "",
            owner: "",
            assetContractType: "",
          }
        }
      });
      setOpen(false);
    } else {
      setError("You do not own this NFT");
    }
  };

  return (
    <div>
      <button 
        onClick={() => setOpen(true)}
        style={{
          width: "200px",
          height: "315px",
          borderRadius: "8px",
        }}
      >
        Import your own NFTs
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Heading>
            Import NFT &nbsp;
            <Tooltip title="Entering contract information for NFTs that are on the ethereum network">
              <HelpIcon />
            </Tooltip>
          </Heading>
          <div>
            <Stack
              component="form"
              sx={{
                width: '45ch',
              }}
              spacing={2}
              noValidate
              autoComplete="off"
            >
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <RoundedInput id="contract-address-input" placeholder="Contract Address" value={formState.tokenAddress} onChange={(e) => setFormState({ ...formState, tokenAddress: e.target.value })} />
              <RoundedInput id="token-id-input" placeholder="Token ID" value={formState.tokenId} onChange={(e) => setFormState({ ...formState, tokenId: e.target.value })} />
              <SimpleButton type="primary" onClick={handleSubmit} disabled={!formState.tokenAddress || !formState.tokenId}>Import NFT</SimpleButton>
            </Stack>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
