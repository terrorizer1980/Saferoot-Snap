import styled from "styled-components";
import { Color, Spacing } from "../../globalStyles";

export const SelectionModalRoot = styled.div`
  padding: ${Spacing.modalPadding};
  background-color: ${Color.white};
  border-radius: 10px;
`;

export const ModalHeading = styled.div`
  padding: ${Spacing.modalHeading};
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SelectionButtonContainer = styled.div`
  margin: ${Spacing.modalButtonMargin};
  display: flex;
  justify-content: center;
  align-items: center;
`;
