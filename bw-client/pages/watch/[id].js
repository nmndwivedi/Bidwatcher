import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import axios from "axios";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const Watch = () => {
  const router = useRouter();
  const { id } = router.query;
  const videoRef = useRef(null);
  const [url, setUrl] = useState(null);

  async function loadStream() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    try {
      const addresss = await signer.getAddress();

      const res = await axios.post(
        "/api/streams/" + id,
        { userAddress: addresss },
        { headers: { "content-type": "application/json" } }
      );
      setUrl(res?.data?.livestreamUrl);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if(!id) return;
    loadStream();
    // setInterval(() => {console.log(url);}, 2000)

    if (videoRef.current) {
      videojs(videoRef.current, {
        autoplay: true,
        muted: true,
        sources: [
          {
            src: url,
            type: "application/x-mpegURL",
          },
        ],
      });
    }
  }, [id]);

  return (
    <div className="p-24 flex flex-col items-center space-y-8">
      <div className="font-semibold">Livestreaming for NFT Id: {id}</div>
      {
        url ? (
      <div className="flex relative rounded-3xl items-center justify-center h-96 overflow-hidden">
        <video
          controls
          ref={videoRef}
          className="video-js absolute z-10 min-h-full max-w-none h-full object-center object-cover"
        ></video>
      </div>):
      (<div className="font-black text-red-600 text-2xl">...ACCESS DENIED...</div>)
      }
    </div>
  );
};

export default Watch;
