import { motion } from "motion/react";
import { Badge } from "./ui/badge";

export function OnChainBadge({
  isLive,
  isLoading,
  chainName,
}: {
  isLive: boolean;
  isLoading?: boolean;
  chainName?: string;
}) {
  if (isLoading) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 text-[11px]">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        Loading on-chain data...
      </Badge>
    );
  }

  if (isLive) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-[11px]">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Live on {chainName ?? "chain"}
      </Badge>
    );
  }

  return (
    <Badge className="bg-gray-100 text-gray-500 border-gray-200 px-3 py-1 text-[11px]">
      Mock Data
    </Badge>
  );
}
