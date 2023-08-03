import React, { useEffect } from 'react';
import { CardWrapper, Title } from '../Card';
import { ErrorMessage } from '../../styling/styles';
import { AuthContext } from '../../hooks';
import { useAccount, useNetwork } from 'wagmi';
import { UserWalletWidget } from '../UserWalletWidget';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { NAVIGATION_PATHS } from '../../constants';
import { SimpleButton } from '../SimpleButton';
import Accordion from '@mui/material/Accordion';
import { AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useData } from '../../hooks/DataContext';


export const Steps = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  align-items: center;
  justify-content: space-around;  
  `;

export const UserWalletPage = ({ nextTab, prevTab }) => {
  const { authenticated } = React.useContext(AuthContext);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { state } = useData();
  const [expanded, setExpanded] = React.useState<string | false>("p2");

  useEffect(() => {
    if (state.deployedSaferootAddress) {
      navigate(NAVIGATION_PATHS.DASHBOARD)
    }
  }, [state.deployedSaferootAddress])

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Steps>
      <CardWrapper fullWidth={true} disabled={false} style={{ width: "450px", height: "580px", justifyContent: "space-around" }}>
        <Title style={{ textAlign: "center" }}>
          Select tokens and/or NFTs to protect
        </Title>
        <UserWalletWidget />
        <div style={{ display: "flex", flexDirection: "column", alignContent: "center" }}>
          {!isConnected && <ErrorMessage>Connect your wallet to continue</ErrorMessage>}
          {isConnected && (chain.id !== 1 && chain.id !== 5) && <ErrorMessage>Connect to the Ethereum Mainnet to continue</ErrorMessage>}
          <p>
            Our platform is designed to reduce the risk of theft or loss.
          </p>
        </div>
        <SimpleButton type="primary" onClick={nextTab} disabled={!authenticated || !isConnected || (chain.id !== 1 && chain.id !== 5)}>Next</SimpleButton>
      </CardWrapper>
      <CardWrapper fullWidth={true} disabled={false} style={{ width: "450px", height: "580px", maxHeight: "580px", justifyContent: "space-around" }}>
        <Title style={{ textAlign: "center" }}>
          FAQs
        </Title>
        <div>
          <Accordion expanded={expanded == "p1"} onChange={handleChange("p1")} style={{ padding: "3px", borderRadius: "20px", boxShadow: "0px 4px 6px 0px rgba(29, 255, 101, 0.32)" }}>
            <AccordionSummary
              style={{ backgroundColor: expanded == "p1" ? "#f0fff4" : "#fff", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <h2>How does Saferoot work?</h2>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Saferoot enables you to set safeguards for your assets. Safeguards are conditions set up to protect your assets. When a safeguard is activated, your assets will be transferred to a backup wallet address of your choice.
              </p>
            </AccordionDetails>
          </Accordion>
          <br />
          <Accordion expanded={expanded == "p2"} onChange={handleChange("p2")} style={{ padding: "3px", borderRadius: "20px", boxShadow: "0px 4px 6px 0px rgba(29, 255, 101, 0.32)" }}>
            <AccordionSummary
              style={{ backgroundColor: expanded == "p2" ? "#f0fff4" : "#fff", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header">
              <h2>What do I need?</h2>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Prepare a backup wallet address, which could be any wallet other than the one you're currently using. Ensure you have sufficient ETH in your primary wallet to cover gas fees.
              </p>
            </AccordionDetails>
          </Accordion>
          <br />
          <Accordion expanded={expanded == "p3"} onChange={handleChange("p3")} style={{ padding: "3px", borderRadius: "20px", boxShadow: "0px 4px 6px 0px rgba(29, 255, 101, 0.32)" }}>
            <AccordionSummary
              style={{ backgroundColor: expanded == "p3" ? "#f0fff4" : "#fff", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header">
              <h2>Approval in your hands</h2>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                You'll need to grant Saferoot permission to transfer your assets to your backup wallet address if a safeguard is triggered. This is executed through your personal Saferoot contract, ensuring you maintain full control and custody at all times. Set the highest approval limit (max) to ensure all your assets are protected.
              </p>
            </AccordionDetails>
          </Accordion>
        </div>

      </CardWrapper>
    </Steps >);
};