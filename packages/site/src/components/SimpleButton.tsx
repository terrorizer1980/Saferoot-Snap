import React from 'react';
import styled, { css } from "styled-components";

interface ButtonProps {
    disabled?: boolean
    text?: string
    type?: string
    isLoading?: boolean
    onClick?: any
    children?: React.ReactNode
}

const SimpButton = styled.button`
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 16px;
  cursor: pointer;
  border: none;

  
  /* Default Style */
  ${(props) => props.type === 'default' && css`
    background-color: #fff;
    color: #000;
    border: 1px solid #9B9B9B;
    &:hover {
      background-color: #F2F2F2;
      box-shadow: 0px 4px 6px 0px rgba(23, 23, 23, 0.10);
    }
  `}

  /* Default Style */
  ${(props) => props.type === 'square' && css`
    background-color: #fff;
    color: #9B9B9B;
    border: 2px solid #ccc;
    border-radius: 12px;
    &:hover {
      background-color: #F2F2F2;
      box-shadow: 0px 4px 6px 0px rgba(23, 23, 23, 0.10);
    }
  `}
  
  /* Primary Style */
  ${(props) => props.type === 'primary' && css`
    background-color: #27FB6B;
    color: #000;
    &:hover {
      background-color: #02B23B;
      color: #000;
      border: none;
      box-shadow: 0px 4px 6px 0px rgba(29, 255, 101, 0.32);
    }
  `}
  
  /* Secondary Style */
  ${(props) => props.type === 'secondary' && css`
    background-color: #000;
    color: #fff;
    border: none;
    &:hover {
      background-color: #000;
      color: #fff;
      box-shadow: 0px 4px 6px 0px rgba(29, 255, 101, 0.32);
    }
  `}
  
  /* Disabled Style */
  ${(props) => props.disabled && css`
    background-color: #ccc;
    color: #9b9b9b;
    border: none;
    &:hover {
        background-color: #ccc;
        color: #9b9b9b;
        cursor: not-allowed;
    }
  `}
  
  /* Working State */
  ${(props) => props.isLoading && css`
    background-color: #ccc;
    cursor: wait;
  `}
`;

export const SimpleButton = (props: ButtonProps) => {

    const { disabled = false, type = "secondary", text = "Press me!", onClick = () => { }, isLoading = false, children = <></> } = props

    return (
        <>
            <SimpButton
                type={type}
                isLoading={isLoading}
                onClick={onClick}
                disabled={disabled}>
                {children}
            </SimpButton>
        </>
    )
}