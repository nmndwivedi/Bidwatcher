import "../styles/globals.css";
import Navbar from "../components/Navbar";

import { Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID;

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: "My wagmi app",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

function MyApp({ Component, pageProps }) {
  return (
    <Provider autoConnect connectors={connectors}>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
