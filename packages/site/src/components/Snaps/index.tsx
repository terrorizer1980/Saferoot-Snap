import React from "react";
import { useData } from "../../hooks/DataContext";
import { ActionType } from "../../hooks/actions";
import { connectSnap, getSnap } from "../../utils";
import { SimpleButton } from "../SimpleButton";

export const SnapsConnectButton = () => {
  const { state, dispatch } = useData();

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: ActionType.SET_SNAPS_INSTALLED,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: ActionType.SET_MM_FLASK_ERROR, payload: e });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <label style={{}}>
        For an other experience you can connect with MetaMask Snaps
      </label>
      <SimpleButton
        variant="contained"
        color="primary"
        onClick={handleConnectClick}
        disabled={state.isFlask && state.installedSnap}
      >
        {state.installedSnap ? "Connected" : "Connect with MetaMask Snaps "}
      </SimpleButton>
    </div>
  );
};
