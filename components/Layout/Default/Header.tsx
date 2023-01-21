import Link from "next/link";
import { ethers } from "ethers";
import { useListen } from "../../../hooks/useListen";
import { useMetaMask } from "../../../hooks/useMetaMask";
import YeeldxIcon from '../../../assets/yeeldxIcon.svg';
import YeeldxLogo from '../../../assets/yeeldxLogo.svg';
import WarningIcon from '../../../public/assets/engine-warning.svg'

import {
  NavigationView,
  Balance,
  RightNav,
  Logo,
} from "../../styledComponents/navigation";
import { SiEthereum } from "react-icons/si";
import { Button } from "antd";


export default function Header() {
  const {
    dispatch,
    state: { status, isMetaMaskInstalled, wallet, balance, networkId },
  } = useMetaMask();

  console.log(
    "status, isMetaMaskInstalled, wallet, balance",
    status,
    isMetaMaskInstalled,
    wallet,
    balance
  );

  const listen = useListen();

  const showInstallMetaMask =
    status !== "pageNotLoaded" && !isMetaMaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetaMaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const isWrongNetwork = networkId !== "42161"
  console.log('networkId !== 42161', networkId !== "42161");
  console.log('networkId', networkId);
  console.log('isWrongNetwork', isWrongNetwork);

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the user's wallet
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const formatAddress = (addr: string) => {
    return `${addr.substr(0, 6)}...${addr.substr(-4)}`;
  };

  return (
    <header className="connex-header mobile-none">
      <nav className="connex-nav">
        <Link href="/">
          <img
            src="https://avatars.githubusercontent.com/u/111516461?s=200&v=4"
            alt='YeeldxLogo'
            height={60}
          />
          <span style={{ fontWeight: 500, color: "#ffffff" }}>Yeeldx</span>
        </Link>
        <ul className="menu-list">
          <li>Vaults</li>
        </ul>
        <div className="connec_nav_suportLg" >
          {isWrongNetwork ? (
            <span>
              <svg style={{ color: "#C30000", marginRight: "5px" }} width="15" height="15" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7L12 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
              <span style={{ color: "#C30000" }}>
                Connected to a wrong network!
              </span>
            </span>

          ):(
            <span>
              <span style={{ color: "#66bb6a" }}>
                Arbitrum
              </span>
            </span>
          )}
          {showConnectButton && (
            <li textSize={10} onClick={handleConnect}>
              <Button className="disconnect" style={{ marginRight: 15 }}>
                {status === "loading" ? "loading..." : "Connect Wallet"}
              </Button>
            </li>
          )}

          {showInstallMetaMask && (
            <Link href="https://metamask.io/" target="_blank" style={{ marginRight: 15 }}>
              Install MetaMask
            </Link>
          )}

          {wallet && balance && (
            <>
              {isConnected && (
                <Button
                  className="disconnect"
                  textSize={10}
                  onClick={handleDisconnect}
                  style={{ marginRight: 15 }}
                >
                  Disconnect
                </Button>
              )}
              <span className="support">
                <Link href={`https://etherscan.io/address/${wallet}`} >
                  {formatAddress(wallet)}
                </Link>
              </span>
            </>
          )}

          <span className="language">
            {wallet && balance && (
              <Balance>
                {(parseInt(balance) / 1000000000000000000).toFixed(6)} ETH
              </Balance>
            )}
          </span>
        </div>
      </nav>
    </header>
  );
}
