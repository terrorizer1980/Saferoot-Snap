import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ErrorMessage, RoundedInput } from '../styling/styles';
import styled from 'styled-components';
import { RoundedGrayContainers, PurpleCircle } from './OnboardingSteps/styles';
import { ETH_ADDRESS_LENGTH_WITH_PREFIX } from '../constants';
import { useData } from '../hooks/DataContext';


const WalletAddressContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction:row;
  justify-content
`;

const WalletInformationColumn = styled.div`
  dispalyed: flex;
  flex-direction: column;
  flex-grow: 2;
  margin-left: 20px;
`;

export const simpleEthereumAddressValidator = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};

export type EthereumAddressProps = {
  address: string;
  setAddress: (address: string) => void;
  checkForConflict?: boolean;
};
export const EthereumAddressInput: React.FunctionComponent<EthereumAddressProps> = ({
  address,
  setAddress,
  checkForConflict = false
}) => {
  const [error, setError] = useState<string | null>(null);
  const { state } = useData();

  // Validate address function using simpleEthereumAddressValidator
  const validateAddress = (unvalidatedAddress: string): boolean => {
    if (unvalidatedAddress.length == 0) {
      return true
    }
    const isValidAddress = simpleEthereumAddressValidator(unvalidatedAddress);
    if (isValidAddress && (checkForConflict && unvalidatedAddress == state.userWallet)) {
      setError('Backup address can not be the same as the original wallet address')
    } else if (isValidAddress) {
      setError(null);
      return isValidAddress;
    } else {
      setError('Invalid Ethereum address')
    }
  };

  // Validate the address whenever it changes
  useEffect(() => {
    validateAddress(address);
  }, [address]);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    validateAddress(text);
    setAddress(text);
  };

  let timerId: NodeJS.Timeout | undefined;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerId!);
    const newAddress = event.target.value;
    setAddress(newAddress);
    timerId = setTimeout(() => {
      validateAddress(newAddress);
    }, 1000); // delay the validation for 1 second
  };

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <WalletAddressContainer>
        <RoundedInput
          name="backupAddress"
          type="text"
          placeholder="Wallet address where you want to backup your selected assets!"
          value={address}
          maxLength={ETH_ADDRESS_LENGTH_WITH_PREFIX}
          onChange={handleInputChange}
          style={{ maxWidth: '600px' }}
          required />
      </WalletAddressContainer>

    </>
  );
};