import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";
import { devices } from "../../constants";

export const TileViewRoot = styled.div`
  background-color: ${Color.white};
  border: solid 1px ${Color.borderColor};
  width: 100%;
  border-radius: 8px;
`;

export const TileViewTileContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: ${Spacing.tileViewTilesContainerPadding};
  @media only screen and ${devices.lg} {
    padding: ${Spacing.tileViewTilesMobileContainerPadding}
  }
`;

export const TileViewHeader = styled.div`
  padding: ${Spacing.tileViewHeaderPadding};
  display: flex;
  justify-content: space-between;
  @media only screen and ${devices.lg} {
    display: block;
    padding: ${Spacing.tileViewHeaderMobilePadding};
  }
`;

export const TileViewAssetContainer = styled.div`
  width: 25%;
  @media only screen and ${devices.lg} {
    width: 50%;
  }
`;

export const TileViewFilterContainer = styled.div`
  display: flex;
  align-items: center;
  @media only screen and ${devices.lg} {
    margin: ${Spacing.GenericSpacerMargin20}
  }
`;
