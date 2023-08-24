import { Spacing } from "../../globalStyles";
import { devices } from "../../constants";
import styled from 'styled-components';

export const NFTAssetTileRoot = styled.div`
  margin: ${Spacing.tileViewTileMargin};
  border-radius: 15px;
  transition: height 0.5s;
  overflow: hidden;
  @media only screen and ${devices.lg} {
  }
`;


export const NFTAssetTileIDContainer = styled.div`
  width: 100%;
  padding-bottom: 100%;  
  position: relative;    
`;


export const NFTAssetTileImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const NFTAssetTileCheckboxContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute; 
  top: 0;             
  right: 0;           
`;


export const NFTAssetTileCheckboxFloat = styled.div`
  position: absolute;
  z-index: 1;          
`;

export const NFTAssetTileInfoContainer = styled.div`
  padding: ${Spacing.tileViewTilePadding};
`;

export const NFTAssetTileSpreadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
