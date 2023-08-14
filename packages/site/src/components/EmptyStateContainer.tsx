import styled from "styled-components";

export interface EmptyStateContainerProps {
    message: string;
    button?: React.ReactNode;
}

const Container = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  margin: 30px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  padding: 20px;
  margin: auto;
`;

const Text = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const EmptyStateContainer = (props: EmptyStateContainerProps) => {

    const { message, button } = props;

    return (
        <Container>
            <Text>{message}</Text>
            {button}
        </Container>
    )
};