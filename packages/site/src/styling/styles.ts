import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width 100vw;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

export const Heading = styled.h1`
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: left;
`;
export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 150rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

export const StepsPages = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const RoundedInput = styled.input`
  padding: 10px;
  padding-left: 20px;
  border: 1px solid #ccc;
  border-radius: 50px;
  font-size: large;
  margin-right: 5px;
  width: 70%;
  &:valid {
    border: 1px solid #27fb6b;
    box-shadow: 0 0 5px #27fb6b;
  }
  &:invalid {
    border: 1px solid #FF2E2E;
    box-shadow: 0 0 5px #FF2E2E;
  }
`;

export const ConfirmationButton = styled.button`
  background-color: #27fb6b;
  [disabled] {
    background-color: #ccc;
  }
`;
