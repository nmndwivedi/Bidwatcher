import React from "react";
import { useRouter } from "next/router";

const Watch = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>Watch {id}</div>;
};

export default Watch;
