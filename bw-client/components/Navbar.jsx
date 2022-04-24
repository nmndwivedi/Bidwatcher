import React from "react";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";

const Navbar = () => {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const connectHandle = async () => {
    connect(connectData.connectors[0]);
  }

  return (
    <nav className="border-b p-6 px-24 bg-indigo-600 text-white">
      <p className="text-4xl font-bold">Bidwatcher</p>
      <div className="flex justify-between">
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-indigo-100">Home</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-indigo-100">Sell a NFT</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-indigo-100">My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-indigo-100">Dashboard</a>
          </Link>
        </div>
        <div>
          {accountData && (
            <div className="flex space-x-4 items-center">
             {accountData?.ens?.avatar && <img src={accountData.ens?.avatar} alt="ENS Avatar" />}
              <div>
                {accountData.ens?.name
                  ? `${accountData.ens?.name} (${accountData.address})`
                  : accountData.address}
              </div>
              {/* <div>Connected to {accountData.connector.name}</div> */}
              <button onClick={disconnect} className="bg-white p-2 text-indigo-700 rounded-lg">Disconnect</button>
            </div>
          )}
          {!accountData && (
            <button onClick={()=>connectHandle()} className="bg-white p-2 text-indigo-700 rounded-lg">Connect</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
