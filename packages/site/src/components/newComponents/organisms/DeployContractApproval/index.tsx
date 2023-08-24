import React, { useEffect, useState } from "react";
import { WalletCard } from "../../molecules";
import {
  GenericInfoContainer,
  GenericInfoHeading,
  GenericInfoSubText,
  GenericRoot,
  GenericWalletCardContainer,
} from "../commonStyles";
import { Typography } from "../../atoms/Typography";
import { TextStyle } from "../../globalStyles";
import { ProgressBar } from "../../molecules/ProgressBar";
import { StepDescription } from "../../molecules/StepDescription";
import { totalReviewSteps } from "../../constants";
import { ReviewContainer } from "../../molecules/ReviewContainer";
import { ReviewTable } from "../../molecules/ReviewTable";
import { TableContainer } from "./styles";
import FixedNavigationBottomBar from "../../../FixedNavigationBottomBar";
import { SimpleButton } from "../../../SimpleButton";

const DeployContractApproval = ({ assetGuards, setAssetGuards, prevTab, nextTab, createSaferootWithSafeguardsTx, addSafeguardTx }) => {

  const [step, setStep] = useState<number>(1);

  const toDispatch = [...assetGuards.ERC20Assets, ...assetGuards.ERC721Assets]
    .filter((asset) => !asset.isPreGuarded && asset.isSelected)

  const assetsToApprove = toDispatch.map(({ asset, security, address, tokenId }) => ({ asset, security, address, tokenId }))

  const allApproved = toDispatch.filter((asset) => asset.isApproved)

  useEffect(() => {
    if (allApproved.length == assetsToApprove.length) {
      setStep(3)
    }
  }, [allApproved])

  return (
    <GenericRoot>
      <GenericWalletCardContainer>
        <WalletCard
          amount="11,1688.13"
          coinAmount="68.3"
          network="ethereum marriot"
        />
      </GenericWalletCardContainer>
      <GenericInfoContainer>
        <GenericInfoHeading>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            Smart Contract Deployment
          </Typography>
        </GenericInfoHeading>

        <GenericInfoSubText>
          <Typography {...TextStyle.headingColorMediumLabel}>
            This guide will help you to start deploying contracts on-chain in
            just a few minutes.
          </Typography>
        </GenericInfoSubText>
        <ProgressBar steps={totalReviewSteps} activeStep={step - 1} />
        <div>
          <StepDescription
            stepNumber={1}
            active={step === 1}
            completed={step > 1}
            heading="Deploy your Saferoot contract"
            headingSubText="Ensure that the wallet you want to protect is listed below. Saferoot will deploy a smart contract linked to that wallet address"
          />
          {step === 1 && (
            <div>
              <ReviewContainer
                createSaferootWithSafeguardsTx={createSaferootWithSafeguardsTx}
                addSafeguardTx={addSafeguardTx}
                assetGuards={assetGuards}
                onSuccess={() => { setStep(2) }} />
            </div>
          )}
        </div>
        <div>
          <StepDescription
            stepNumber={2}
            active={step === 2}
            completed={step > 2}
            heading="Approve assets in the contract"
            headingSubText="Approvals are required for Saferoot to move these assets on your behalf to your backup wallet"
          />
          {step === 2 && (
            <TableContainer>
              <ReviewTable
                tableHeader="Select your assets"
                labels={["ASSET", "SECURITY"]}
                data={assetsToApprove}
                setData={setAssetGuards}
              />
            </TableContainer>
          )}
        </div>
      </GenericInfoContainer>
      <FixedNavigationBottomBar>
        <SimpleButton type="default" onClick={prevTab}>Back</SimpleButton>
        <SimpleButton
          onClick={nextTab}
          type={"primary"}
          disabled={!(allApproved.length == assetsToApprove.length)}>
          Finish!
        </SimpleButton>
      </FixedNavigationBottomBar>
    </GenericRoot>
  );
};

export default DeployContractApproval;
