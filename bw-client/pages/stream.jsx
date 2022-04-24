import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import BidwatcherMarketplace from "../artifacts/contracts/BidwatcherMarketplace.sol/BidwatcherMarketplace.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "goerli",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    console.log(await signer.getAddress());

    const marketplaceContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS_GOERLI,
      BidwatcherMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function createStream(nft) {
    // router.push(`/api/${nft.tokenId}`);
    try {
        const res = await axios.post('/api/stream', {
            name: nft.tokenId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(res?.data);
    } catch (e) {
        console.log(e);
    }
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <button onClick={()=>createStream(nft)}>
                <img src={nft.image} className="rounded" />
              </button>
              {/* <p className="h-12">{JSON.stringify(nft)}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
