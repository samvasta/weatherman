import React from "react";

import Head from "next/head";

import { Canvas } from "@/canvas/Canvas";

export default function Home() {
  return (
    <>
      <Head>
        <title>Weatherman</title>
        <meta name="description" content="Simple, generic forecasting tools" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas initialNodes={[]} initialEdges={[]} />
    </>
  );
}
