import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";

export const MobileViewRootContainer = styled.div`
  padding: ${Spacing.mobileViewRootPadding};
  border: solid 1px ${Color.borderColor};
  border-radius: 8px;
  background-color: ${Color.white};
`;

export const MobileViewMainContainer = styled.div`
  display: flex;
  padding: ${Spacing.mobileViewCardPadding}
`;

export const MobileViewIcon = styled.img`
  width: 30px;
  height: 30px;
  padding: ${Spacing.mobileViewIconPadding}
`;

export const MobileViewLine = styled.div`
  // margin: ${Spacing.mobileViewLineMargin};
  height: 1px;
  width: 100%;
  opacity: 0.5;
  background-color: ${Color.borderColor};
`;

export const MobileViewSpreadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MobileViewTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const MobileViewButtonsContainer = styled.div`
  margin: ${Spacing.mobileViewLineMargin};
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
`;
