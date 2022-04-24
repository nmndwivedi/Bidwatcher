import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import axios from "axios";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

const Watch = () => {
  const router = useRouter();
  const { id } = router.query;
  const videoRef = useRef(null);
  const [url, setUrl] = useState(null);

  async function loadStream() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const res = await axios.post("/api/streams/"+id, {userAddress: provider.connection}, {headers: {'content-type': 'application/json'}})
    console.log(res);
  }

  useEffect(() => {
    // loadStream();

    if (videoRef.current) {
      videojs(videoRef.current, {
        autoplay: true,
        muted: true,
        sources: [
          {
            src: "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8",
            type: "application/x-mpegURL",
          },
        ],
      });
    }
  }, []);

  return (
    <div className="p-24 flex flex-col items-center space-y-8">
    <div className="font-semibold">Livestreaming for NFT Id: {id}</div>
      <div className="flex relative rounded-3xl items-center justify-center h-96 overflow-hidden">
        <video
          controls
          ref={videoRef}
          className="video-js absolute z-10 min-h-full max-w-none h-full object-center object-cover"
        ></video>
      </div>
    </div>
  );
};

export default Watch;
