import React from 'react';
import { render } from '@testing-library/react';
import { SimpleButton } from './components/SimpleButton';
import Navigation from './components/Navigation'
import { CoinId } from './components/newComponents/atoms/CoinId';
import { AvatarId } from './components/newComponents/atoms/AvatarId';
import { DropDown } from './components/newComponents/atoms/DropDown';
import { Tag } from './components/newComponents/atoms/Tag';
import { Color } from './components/newComponents/globalStyles';
import { WalletStatus } from './components/newComponents/atoms/WalletStatus';
import { RoundedInput } from './components/newComponents/atoms/RoundedInput';

test('Button Render', () => {
    render(<SimpleButton />);
});

test('Navigation Render', () => {
    render(<Navigation />);
});

test('CoinId Render', () => {
    render(<CoinId />);
});

test('AvatarId Render', () => {
    render(<AvatarId />);
});

test('Navigations Render', () => {
    render(<DropDown label="Test Label" data={[{ value: "item1", label: "Item 1" }]} />);
});

test('Button Render', () => {
    render(<Tag text="Check Tag" bgColor={Color['white'] as string} />);
});

test('WalletStatus without props should be undefined', () => {
    const { queryByTestId } = render(<WalletStatus />);
    expect(queryByTestId('wallet-status')).toBeNull();
});

test('AvatarId Render', () => {
    render(<RoundedInput />);
});