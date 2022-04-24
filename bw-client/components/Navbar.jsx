import React, { useEffect } from "react";
import Link from "next/link";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};

const Navbar = ({ setProvider, setSigner, provider }) => {
  const exec = async () => {
    const web3Modal = new Web3Modal({
      network: "goerli", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    try {
      const instance = await web3Modal.connect();

      const prov = new ethers.providers.Web3Provider(instance);

      setProvider(prov);
      setSigner(prov.getSigner());
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    exec();
  }, []);

  return (
    <nav className="border-b p-6 px-24 bg-indigo-600 text-white">
      <p className="text-4xl font-bold">Bidwatcher</p>
      <div className="flex mt-4 space-x-8">
        <Link href="/">
          <a className="mr-4 text-indigo-100">Browse Marketplace</a>
        </Link>
        <Link href="/my-nfts">
          <a className="mr-6 text-indigo-100">My Purchased NFTs</a>
        </Link>
        <Link href="/dashboard">
          <a className="mr-6 text-indigo-100">My Listed NFTs</a>
        </Link>
        <Link href="/create">
          <a className="mr-6 text-indigo-100">Create a NFT</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
