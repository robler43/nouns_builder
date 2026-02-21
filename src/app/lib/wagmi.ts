import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, mainnet, optimism, zora } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Nouns Builder",
  projectId: "nouns-builder-demo",
  chains: [base, mainnet, optimism, zora],
  ssr: false,
});
