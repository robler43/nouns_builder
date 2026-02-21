import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Wifi, WifiOff, Zap } from "lucide-react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { Navigation } from "../components/Navigation";
import { Badge } from "../components/ui/badge";
import { OnChainBadge } from "../components/OnChainBadge";
import { toast } from "sonner";
import {
  mockAuctions,
  formatETH,
  type NFTAuction,
  type AuctionBid,
} from "../lib/mockData";
import { CommunityFeed } from "../components/CommunityFeed";
import {
  useLiveAuction,
  usePlaceBid,
  useSettleAuction,
  useWatchBids,
  useTokenBalance,
  useVotingPower,
} from "../lib/hooks/useNounsBuilder";
import { KNOWN_DAOS } from "../lib/contracts";

/* ── Countdown ── */

function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeDiff(endTime));
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeDiff(endTime)), 1000);
    return () => clearInterval(interval);
  }, [endTime]);
  return timeLeft;
}

function getTimeDiff(endTime: Date) {
  const diff = Math.max(0, endTime.getTime() - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    ended: diff === 0,
  };
}

/* ── Slide-to-Bid ── */

function SlideToBid({
  bidAmount,
  bidLabel,
  onBid,
  disabled,
  isPending,
}: {
  bidAmount: number;
  bidLabel?: string;
  onBid: () => void;
  disabled: boolean;
  isPending?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [completed, setCompleted] = useState(false);
  const isDragging = useRef(false);
  const offsetRef = useRef(0);
  const THUMB = 52;
  const PAD = 3;

  const getMax = () => (trackRef.current?.clientWidth ?? 300) - THUMB - PAD * 2;

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || completed || isPending) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const max = getMax();
    const x = Math.max(
      0,
      Math.min(e.clientX - rect.left - THUMB / 2 - PAD, max)
    );
    offsetRef.current = x;
    setOffset(x);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const max = getMax();
    if (offsetRef.current / max > 0.75) {
      offsetRef.current = max;
      setOffset(max);
      setCompleted(true);
      onBid();
      setTimeout(() => {
        offsetRef.current = 0;
        setOffset(0);
        setCompleted(false);
      }, 2000);
    } else {
      offsetRef.current = 0;
      setOffset(0);
    }
  };

  const onPointerCancel = () => {
    isDragging.current = false;
    offsetRef.current = 0;
    setOffset(0);
  };

  const label = isPending
    ? "Confirming in wallet..."
    : completed
    ? "Bid placed!"
    : bidLabel ?? `Slide to bid ${formatETH(bidAmount)}`;

  return (
    <div
      ref={trackRef}
      className="relative h-[58px] bg-black rounded-full select-none overflow-hidden"
    >
      {/* Progress glow */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        animate={{
          width: offset + THUMB + PAD * 2,
          backgroundColor: completed
            ? "rgba(34,197,94,0.25)"
            : isPending
            ? "rgba(234,179,8,0.2)"
            : `rgba(255,255,255,${
                0.03 + (offset / Math.max(getMax(), 1)) * 0.1
              })`,
        }}
        transition={{ duration: 0 }}
      />

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`text-sm font-medium ${
              completed
                ? "text-emerald-400"
                : isPending
                ? "text-amber-400"
                : "text-white/50"
            }`}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Thumb */}
      <motion.div
        className="absolute top-[3px] left-[3px] w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center z-10 touch-none"
        animate={{ x: offset }}
        transition={
          isDragging.current
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 30 }
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onPointerCancel}
        style={{
          cursor: disabled || isPending ? "not-allowed" : "grab",
        }}
      >
        {completed ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check className="h-5 w-5 text-emerald-500" />
          </motion.div>
        ) : isPending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-5 w-5 text-amber-500" />
          </motion.div>
        ) : (
          <ArrowRight className="h-5 w-5 text-black" />
        )}
      </motion.div>
    </div>
  );
}

/* ── Dashboard ── */

export function Dashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [localAuctions, setLocalAuctions] =
    useState<NFTAuction[]>(mockAuctions);
  const [useLiveData, setUseLiveData] = useState(true);

  // Wallet state
  const { address, isConnected } = useAccount();

  // On-chain DAO selection: cycle through all known DAOs
  const allDaos = KNOWN_DAOS;
  const [daoIndex, setDaoIndex] = useState(0);
  const currentDao = allDaos[daoIndex] ?? undefined;

  // Live auction data from smart contract
  const {
    liveData,
    isLoading: liveLoading,
    isError: liveError,
    refetch: refetchAuction,
  } = useLiveAuction(useLiveData ? currentDao : undefined);

  // Bid hook
  const { placeBid, isPending: bidPending } = usePlaceBid(currentDao);

  // Settle hook
  const { settle, isPending: settlePending } = useSettleAuction(currentDao);

  // Token balance for connected wallet
  const tokenBalance = useTokenBalance(currentDao, address);
  const { votingPower } = useVotingPower(currentDao, address);

  // Watch for real-time bids
  useWatchBids(useLiveData ? currentDao : undefined, (tokenId, bidder, amount) => {
    toast.success("New bid detected!", {
      description: `${bidder.slice(0, 6)}...${bidder.slice(-4)} bid ${formatEther(amount)} ETH`,
    });
    refetchAuction();
  });

  // Determine which data source to show
  const isLive = useLiveData && !!liveData && !liveError;

  // Current auction — either live or mock
  const auction = isLive ? null : localAuctions[selectedIndex];

  // Displayed values
  const displayTokenId = isLive
    ? `#${liveData!.tokenId}`
    : `#${auction!.tokenId}`;
  const displayCollection = isLive
    ? liveData!.collectionName
    : auction!.collectionName;
  const displayBid = isLive
    ? liveData!.highestBidFormatted
    : formatETH(auction!.currentBid);
  const displayBidder = isLive
    ? `${liveData!.highestBidder.slice(0, 6)}...${liveData!.highestBidder.slice(-4)}`
    : auction!.currentBidderName;
  const displayEndTime = isLive ? liveData!.endTime : auction!.endTime;
  const displayChain = isLive ? liveData!.chainName : auction!.chain;
  const displayImage = isLive
    ? liveData!.tokenImage ?? mockAuctions[daoIndex % mockAuctions.length]?.imageUrl
    : auction!.imageUrl;
  const displayMinBid = isLive
    ? parseFloat(formatEther(BigInt(liveData!.minNextBid)))
    : auction!.currentBid + auction!.minBidIncrement;
  const displayMinBidLabel = isLive
    ? `Slide to bid ${liveData!.minNextBidFormatted}`
    : undefined;

  const countdown = useCountdown(displayEndTime);

  // Handle bid — on-chain if live, mock otherwise
  const handleBid = useCallback(async () => {
    if (isLive && currentDao && liveData) {
      if (!isConnected) {
        toast.error("Connect your wallet to bid", {
          description: "Use the connect button in the navigation bar",
        });
        return;
      }
      try {
        const minBid = BigInt(liveData.minNextBid);
        const txHash = await placeBid(BigInt(liveData.tokenId), minBid);
        toast.success("Bid submitted!", {
          description: `TX: ${String(txHash).slice(0, 10)}...`,
        });
        refetchAuction();
      } catch (err: any) {
        const msg =
          err?.shortMessage ?? err?.message ?? "Transaction failed";
        toast.error("Bid failed", { description: msg });
      }
      return;
    }

    // Mock bid fallback
    const amount = displayMinBid;
    const newBid: AuctionBid = {
      bidder: "0x1a2B...9cD4",
      bidderName: "nounslover.eth",
      amount,
      timestamp: new Date(),
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };

    setLocalAuctions((prev) =>
      prev.map((a, i) =>
        i === selectedIndex
          ? {
              ...a,
              currentBid: amount,
              currentBidder: newBid.bidder,
              currentBidderName: newBid.bidderName,
              timeAgo: "just now",
              bids: [newBid, ...a.bids],
            }
          : a
      )
    );

    toast.success("Bid placed!", {
      description: `You bid ${formatETH(amount)} on ${displayCollection} ${displayTokenId}`,
    });
  }, [
    isLive,
    currentDao,
    liveData,
    isConnected,
    placeBid,
    refetchAuction,
    displayMinBid,
    selectedIndex,
    displayCollection,
    displayTokenId,
  ]);

  // Navigation between auctions/DAOs
  const totalItems = isLive ? allDaos.length : localAuctions.length;
  const currentIndex = isLive ? daoIndex : selectedIndex;

  const goNext = () => {
    if (isLive) {
      setDaoIndex((i) => (i + 1) % allDaos.length);
    } else {
      setSelectedIndex((i) => (i + 1) % localAuctions.length);
    }
  };
  const goPrev = () => {
    if (isLive) {
      setDaoIndex((i) => (i - 1 + allDaos.length) % allDaos.length);
    } else {
      setSelectedIndex(
        (i) => (i - 1 + localAuctions.length) % localAuctions.length
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />

      <div className="max-w-lg mx-auto px-4 pt-4 pb-12">
        {/* Data source toggle */}
        <div className="flex items-center justify-between mb-3">
          <OnChainBadge
            isLive={isLive}
            isLoading={liveLoading && useLiveData}
            chainName={isLive ? liveData?.chainName : undefined}
          />
          <button
            onClick={() => setUseLiveData(!useLiveData)}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-full hover:bg-white"
          >
            {useLiveData ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Mock</span>
              </>
            )}
          </button>
        </div>

        {/* Connected wallet info */}
        {isConnected && isLive && currentDao && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-gray-200/60 text-xs text-gray-500">
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="text-gray-300">|</span>
              <span>
                {tokenBalance !== undefined
                  ? `${tokenBalance.toString()} tokens`
                  : "0 tokens"}
              </span>
              <span className="text-gray-300">|</span>
              <span>
                {votingPower !== undefined
                  ? `${votingPower.toString()} votes`
                  : "0 votes"}
              </span>
              <span className="ml-auto text-[10px] text-emerald-500 font-medium">
                {currentDao.name}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Hero NFT Spotlight ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden aspect-[3/4] mb-4"
        >
          {/* Image crossfade */}
          <AnimatePresence mode="wait">
            <motion.img
              key={isLive ? `live-${daoIndex}` : `mock-${selectedIndex}`}
              src={displayImage}
              alt={`${displayCollection} ${displayTokenId}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Chain badge + live indicator – top left */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <Badge className="bg-white/15 backdrop-blur-md text-white border-white/10 px-3 py-1 text-xs">
              {displayChain}
            </Badge>
            {isLive && (
              <Badge className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border-emerald-500/20 px-2 py-1 text-[10px]">
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                ON-CHAIN
              </Badge>
            )}
          </div>

          {/* DAO name badge – top right (live mode) */}
          {isLive && liveData && (
            <div className="absolute top-4 right-4 z-20">
              <Badge className="bg-black/40 backdrop-blur-md text-white/80 border-white/10 px-2.5 py-1 text-[10px]">
                {liveData.daoName}
              </Badge>
            </div>
          )}

          {/* Tap-to-navigate zones */}
          <button
            className="absolute inset-y-0 left-0 w-1/3 z-10"
            onClick={goPrev}
            aria-label="Previous auction"
          />
          <button
            className="absolute inset-y-0 right-0 w-1/3 z-10"
            onClick={goNext}
            aria-label="Next auction"
          />

          {/* Bottom info overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLive ? `info-live-${daoIndex}` : `info-mock-${selectedIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-5 z-20"
            >
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                {displayCollection}
              </p>
              <h1 className="text-3xl font-bold text-white mb-5">
                {displayTokenId}
              </h1>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                    Current Bid
                  </p>
                  <p className="text-white text-2xl font-bold">{displayBid}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    by{" "}
                    <span className="text-white/60">{displayBidder}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                    {countdown.ended ? "Ended" : "Ends In"}
                  </p>
                  {countdown.ended ? (
                    <p className="text-red-400 text-xl font-bold">Ended</p>
                  ) : (
                    <p className="text-white text-2xl font-bold font-mono tabular-nums">
                      {String(countdown.hours).padStart(2, "0")}:
                      {String(countdown.minutes).padStart(2, "0")}:
                      {String(countdown.seconds).padStart(2, "0")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-5">
          {Array.from({ length: totalItems }).map((_, i) => (
            <button
              key={i}
              onClick={() =>
                isLive ? setDaoIndex(i) : setSelectedIndex(i)
              }
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "w-7 bg-black"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Slide to Bid */}
        <SlideToBid
          bidAmount={displayMinBid}
          bidLabel={displayMinBidLabel}
          onBid={handleBid}
          disabled={countdown.ended}
          isPending={bidPending}
        />

        {/* Settle button — shows when auction ended and live */}
        {isLive && countdown.ended && liveData && !liveData.settled && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={async () => {
              if (!isConnected) {
                toast.error("Connect wallet to settle");
                return;
              }
              try {
                await settle();
                toast.success("Auction settled! New auction starting...");
                refetchAuction();
              } catch (err: any) {
                toast.error("Settle failed", {
                  description: err?.shortMessage ?? err?.message,
                });
              }
            }}
            disabled={settlePending}
            className="mt-3 w-full h-12 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 active:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {settlePending
              ? "Settling..."
              : "Settle Auction & Start New"}
          </motion.button>
        )}

        {/* Contract info — shows in live mode */}
        {isLive && currentDao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 px-3 py-2 bg-white/50 rounded-xl text-[10px] text-gray-400 flex items-center justify-between"
          >
            <span>
              Auction:{" "}
              <span className="font-mono">
                {currentDao.auction.slice(0, 6)}...
                {currentDao.auction.slice(-4)}
              </span>
            </span>
            <a
              href={`https://${
                currentDao.chainId === 1
                  ? "etherscan.io"
                  : currentDao.chainId === 8453
                  ? "basescan.org"
                  : currentDao.chainId === 10
                  ? "optimistic.etherscan.io"
                  : "explorer.zora.energy"
              }/address/${currentDao.auction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              View on Explorer
            </a>
          </motion.div>
        )}

        {/* ── Community Activity ── */}
        <div className="mt-10">
          <CommunityFeed />
        </div>
      </div>
    </div>
  );
}