import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="border-b p-6 bg-indigo-600 text-white">
      <p className="text-4xl font-bold">Bidwatcher</p>
      <div className="flex mt-4">
        <Link href="/">
          <a className="mr-4 text-indigo-100">Home</a>
        </Link>
        <Link href="/create">
          <a className="mr-6 text-indigo-100">Sell a NFT</a>
        </Link>
        <Link href="/my-nfts">
          <a className="mr-6 text-indigo-100">My NFTs</a>
        </Link>
        <Link href="/dashboard">
          <a className="mr-6 text-indigo-100">Dashboard</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
