import { type AppType } from "next/app";
import { Asap } from "next/font/google";

import "@/styles/globals.css";
import { api } from "@/utils/api";

const asap = Asap({
  subsets: ["latin"],
  variable: "--font-sans",
});

const WeathermanApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${asap.variable}`}>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(WeathermanApp);
