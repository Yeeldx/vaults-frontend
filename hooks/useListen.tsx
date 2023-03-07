import Web3 from "web3";
import { useMetaMask } from "./useMetaMask";

async function getNetworkId() {
  const web3 = new Web3(window.ethereum);
  const id = await web3.eth.net.getId();
  return id;
}

export const useListen = () => {
  const { dispatch } = useMetaMask();

  return () => {
    window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
      if (newAccounts.length > 0) {
        // uppon receiving a new wallet, we'll request again the balance to synchronize the UI.
        const newBalance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [newAccounts[0], "latest"],
        });

        dispatch({
          type: "connect",
          wallet: newAccounts[0],
          balance: newBalance,
        });
      } else {
        // if the length is 0, then the user has disconnected from the wallet UI
        dispatch({ type: "disconnect" });
      }
    });

    window.ethereum.on("networkChanged", async (networkId) => {
      dispatch({ type: "wrongNetwork", networkId: networkId });
    });

    // Get the initial network ID
    getNetworkId()
      .then((id) => {
        dispatch({ type: "wrongNetwork", networkId: id.toString() });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};