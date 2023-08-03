import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  width: 100vw;
`;
export const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 300px;
`;

export const Right = styled.div`
  flex-grow: 5;
  padding-left: 20px;
`;
export const FixedBar = styled.div`
  position: fixed;
  width: 100%;
  height: 8vh;
  min-height: 50px;
  max-height: 80px;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: -10px 0px 0px 1px #dee3d9;
`;

export const FixedBarContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  padding: 0 1rem;
`;

export const FixedBarMessage = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.2rem;
  color: #000000;
`;

export const FixedBarButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const FixedBarClearing = styled.div`
  height: 8vh;
`;

export const RoundedGrayContainers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: auto;

  background: #f6f6f6;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  .MuiDataGrid-root {
    background-color: rgb(246, 246, 246);
  }
`;

export const PurpleCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6c63ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const RoundedWhiteContainer = styled.div`
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  background: #ffffff;
  border: 1px solid #dee3d9;
  border-radius: 8px;
`;