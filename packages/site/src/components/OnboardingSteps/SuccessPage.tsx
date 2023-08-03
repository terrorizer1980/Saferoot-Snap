import React from 'react';
import { Heading, Subtitle } from '../../styling/styles';
import { SimpleButton } from '../SimpleButton';

export const SuccessPage = () => {
  return (
    <div>
      <Heading>Your assets are now successfully protected!</Heading>
      <SimpleButton type="primary">Go To Dashboard</SimpleButton>
    </div>
  );
};