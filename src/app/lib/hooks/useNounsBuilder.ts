/**
 * React hooks for Nouns Builder smart contract interactions.
 *
 * Provides read/write hooks for:
 * - Auction state (current bid, token, countdown)
 * - Placing bids (createBid)
 * - Settling auctions
 * - Token metadata (name, tokenURI, ownership, voting power)
 * - Governor interactions (propose, vote, execute)
 */

import { useReadContract, useWriteContract, useAccount, useBalance } from "wagmi";
import { parseEther, formatEther, type Address } from "viem";
import { useCallback, useMemo } from "react";
import {
  auctionAbi,
  tokenAbi,
  governorAbi,
  type NounsBuilderDAO,
  KNOWN_DAOS,
  VOTE_SUPPORT,
} from "../contracts";

/* ──────────────────────────────────────────────────────────
 *  AUCTION HOOKS
 * ────────────────────────────────────────────────────────── */

export interface AuctionState {
  tokenId: bigint;
  highestBid: bigint;
  highestBidder: Address;
  startTime: number;
  endTime: number;
  settled: boolean;
}

/**
 * Read the current auction state from the Auction contract
 */
export function useAuction(dao: NounsBuilderDAO | undefined) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: dao?.auction,
    abi: auctionAbi,
    functionName: "auction",
    chainId: dao?.chainId,
    query: {
      enabled: !!dao,
      refetchInterval: 12_000,
    },
  });

  const auction: AuctionState | null = useMemo(() => {
    if (!data) return null;
    const [tokenId, highestBid, highestBidder, startTime, endTime, settled] =
      data as [bigint, bigint, Address, number, number, boolean];
    return { tokenId, highestBid, highestBidder, startTime, endTime, settled };
  }, [data]);

  return { auction, isLoading, isError, error, refetch };
}

/**
 * Read the minimum bid increment percentage
 */
export function useMinBidIncrement(dao: NounsBuilderDAO | undefined) {
  const { data } = useReadContract({
    address: dao?.auction,
    abi: auctionAbi,
    functionName: "minBidIncrement",
    chainId: dao?.chainId,
    query: { enabled: !!dao },
  });
  return (data as bigint | undefined) ?? 10n;
}

/**
 * Read the reserve price
 */
export function useReservePrice(dao: NounsBuilderDAO | undefined) {
  const { data } = useReadContract({
    address: dao?.auction,
    abi: auctionAbi,
    functionName: "reservePrice",
    chainId: dao?.chainId,
    query: { enabled: !!dao },
  });
  return data as bigint | undefined;
}

/**
 * Calculate the minimum next bid
 */
export function useMinNextBid(dao: NounsBuilderDAO | undefined) {
  const { auction } = useAuction(dao);
  const minIncrementPct = useMinBidIncrement(dao);
  const reservePrice = useReservePrice(dao);

  return useMemo(() => {
    if (!auction) return 0n;
    if (auction.highestBid === 0n) {
      return reservePrice ?? 0n;
    }
    const increment = (auction.highestBid * minIncrementPct) / 100n;
    return auction.highestBid + increment;
  }, [auction, minIncrementPct, reservePrice]);
}

/**
 * Place a bid on the current auction
 */
export function usePlaceBid(dao: NounsBuilderDAO | undefined) {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data: txHash,
  } = useWriteContract();

  const placeBid = useCallback(
    async (tokenId: bigint, bidAmount: bigint) => {
      if (!dao) throw new Error("No DAO selected");
      return writeContractAsync({
        address: dao.auction,
        abi: auctionAbi,
        functionName: "createBid",
        args: [tokenId],
        value: bidAmount,
        chainId: dao.chainId,
      });
    },
    [dao, writeContractAsync]
  );

  return { placeBid, isPending, isSuccess, isError, error, txHash };
}

/**
 * Settle the current auction and create a new one
 */
export function useSettleAuction(dao: NounsBuilderDAO | undefined) {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data: txHash,
  } = useWriteContract();

  const settle = useCallback(async () => {
    if (!dao) throw new Error("No DAO selected");
    return writeContractAsync({
      address: dao.auction,
      abi: auctionAbi,
      functionName: "settleCurrentAndCreateNewAuction",
      chainId: dao.chainId,
    });
  }, [dao, writeContractAsync]);

  return { settle, isPending, isSuccess, isError, error, txHash };
}

/**
 * Polling-based bid watching (safe cross-version approach).
 * The auction data auto-refreshes every 12 seconds via refetchInterval.
 */
export function useWatchBids(
  _dao: NounsBuilderDAO | undefined,
  _onBid?: (tokenId: bigint, bidder: Address, amount: bigint) => void
) {
  // No-op: real-time updates handled by refetchInterval on useAuction.
}

/* ──────────────────────────────────────────────────────────
 *  TOKEN HOOKS
 * ────────────────────────────────────────────────────────── */

/**
 * Read token name
 */
export function useTokenName(dao: NounsBuilderDAO | undefined) {
  const { data } = useReadContract({
    address: dao?.token,
    abi: tokenAbi,
    functionName: "name",
    chainId: dao?.chainId,
    query: { enabled: !!dao },
  });
  return (data as string | undefined) ?? dao?.name;
}

/**
 * Read token URI (returns on-chain SVG or IPFS JSON)
 */
export function useTokenURI(
  dao: NounsBuilderDAO | undefined,
  tokenId: bigint | undefined
) {
  const { data, isLoading, isError } = useReadContract({
    address: dao?.token,
    abi: tokenAbi,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: dao?.chainId,
    query: { enabled: !!dao && tokenId !== undefined },
  });

  const parsed = useMemo(() => {
    if (!data) return null;
    const uri = data as string;
    try {
      if (uri.startsWith("data:application/json;base64,")) {
        const json = JSON.parse(atob(uri.split(",")[1]));
        return {
          name: json.name as string,
          description: json.description as string,
          image: json.image as string,
        };
      }
      return { name: "", description: "", image: uri };
    } catch {
      return null;
    }
  }, [data]);

  return { tokenMeta: parsed, isLoading, isError };
}

/**
 * Read total supply
 */
export function useTotalSupply(dao: NounsBuilderDAO | undefined) {
  const { data } = useReadContract({
    address: dao?.token,
    abi: tokenAbi,
    functionName: "totalSupply",
    chainId: dao?.chainId,
    query: { enabled: !!dao },
  });
  return data as bigint | undefined;
}

/**
 * Read voting power for an address
 */
export function useVotingPower(
  dao: NounsBuilderDAO | undefined,
  account: Address | undefined
) {
  const { data, refetch } = useReadContract({
    address: dao?.token,
    abi: tokenAbi,
    functionName: "getVotes",
    args: account ? [account] : undefined,
    chainId: dao?.chainId,
    query: { enabled: !!dao && !!account },
  });
  return { votingPower: data as bigint | undefined, refetch };
}

/**
 * Read token balance for an address
 */
export function useTokenBalance(
  dao: NounsBuilderDAO | undefined,
  account: Address | undefined
) {
  const { data } = useReadContract({
    address: dao?.token,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    chainId: dao?.chainId,
    query: { enabled: !!dao && !!account },
  });
  return data as bigint | undefined;
}

/**
 * Delegate votes
 */
export function useDelegateVotes(dao: NounsBuilderDAO | undefined) {
  const { writeContractAsync, isPending, isSuccess, isError, error } =
    useWriteContract();

  const delegateTo = useCallback(
    async (delegatee: Address) => {
      if (!dao) throw new Error("No DAO selected");
      return writeContractAsync({
        address: dao.token,
        abi: tokenAbi,
        functionName: "delegate",
        args: [delegatee],
        chainId: dao.chainId,
      });
    },
    [dao, writeContractAsync]
  );

  return { delegateTo, isPending, isSuccess, isError, error };
}

/* ──────────────────────────────────────────────────────────
 *  GOVERNOR HOOKS
 * ────────────────────────────────────────────────────────── */

/**
 * Read proposal threshold
 */
export function useProposalThreshold(dao: NounsBuilderDAO | undefined) {
  const { data } = useReadContract({
    address: dao?.governor,
    abi: governorAbi,
    functionName: "proposalThreshold",
    chainId: dao?.chainId,
    query: { enabled: !!dao },
  });
  return data as bigint | undefined;
}

/**
 * Read a proposal's on-chain state
 */
export function useProposal(
  dao: NounsBuilderDAO | undefined,
  proposalId: `0x${string}` | undefined
) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: dao?.governor,
    abi: governorAbi,
    functionName: "getProposal",
    args: proposalId ? [proposalId] : undefined,
    chainId: dao?.chainId,
    query: { enabled: !!dao && !!proposalId },
  });

  const proposal = useMemo(() => {
    if (!data) return null;
    const [
      proposer,
      timeCreated,
      againstVotes,
      forVotes,
      abstainVotes,
      voteStart,
      voteEnd,
      proposalThreshold,
      quorumVotes,
      executed,
      canceled,
      vetoed,
    ] = data as [
      Address,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      boolean,
      boolean,
      boolean,
    ];
    return {
      proposer,
      timeCreated,
      againstVotes,
      forVotes,
      abstainVotes,
      voteStart,
      voteEnd,
      proposalThreshold,
      quorumVotes,
      executed,
      canceled,
      vetoed,
    };
  }, [data]);

  return { proposal, isLoading, isError, refetch };
}

/**
 * Cast a vote on a proposal
 */
export function useCastVote(dao: NounsBuilderDAO | undefined) {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data: txHash,
  } = useWriteContract();

  const castVote = useCallback(
    async (
      proposalId: `0x${string}`,
      support: (typeof VOTE_SUPPORT)[keyof typeof VOTE_SUPPORT],
      reason?: string
    ) => {
      if (!dao) throw new Error("No DAO selected");

      if (reason) {
        return writeContractAsync({
          address: dao.governor,
          abi: governorAbi,
          functionName: "castVoteWithReason",
          args: [proposalId, BigInt(support), reason],
          chainId: dao.chainId,
        });
      }

      return writeContractAsync({
        address: dao.governor,
        abi: governorAbi,
        functionName: "castVote",
        args: [proposalId, BigInt(support)],
        chainId: dao.chainId,
      });
    },
    [dao, writeContractAsync]
  );

  return { castVote, isPending, isSuccess, isError, error, txHash };
}

/**
 * Create a new proposal
 */
export function useCreateProposal(dao: NounsBuilderDAO | undefined) {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data: txHash,
  } = useWriteContract();

  const propose = useCallback(
    async (
      targets: Address[],
      values: bigint[],
      calldatas: `0x${string}`[],
      description: string
    ) => {
      if (!dao) throw new Error("No DAO selected");
      return writeContractAsync({
        address: dao.governor,
        abi: governorAbi,
        functionName: "propose",
        args: [targets, values, calldatas, description],
        chainId: dao.chainId,
      });
    },
    [dao, writeContractAsync]
  );

  return { propose, isPending, isSuccess, isError, error, txHash };
}

/* ──────────────────────────────────────────────────────────
 *  COMPOSITE HOOK: Full auction dashboard state
 * ────────────────────────────────────────────────────────── */

export interface LiveAuctionData {
  tokenId: string;
  highestBid: string;
  highestBidFormatted: string;
  highestBidder: Address;
  endTime: Date;
  settled: boolean;
  minNextBid: string;
  minNextBidFormatted: string;
  collectionName: string;
  chainName: string;
  chainId: number;
  daoName: string;
  tokenImage: string | null;
  auctionAddress: Address;
}

/**
 * Combined hook for live auction dashboard — reads all relevant on-chain data
 * for a given DAO and provides formatted data ready for the UI.
 */
export function useLiveAuction(dao: NounsBuilderDAO | undefined) {
  const {
    auction,
    isLoading: auctionLoading,
    isError: auctionError,
    refetch,
  } = useAuction(dao);
  const minNextBid = useMinNextBid(dao);
  const collectionName = useTokenName(dao);
  const { tokenMeta, isLoading: tokenLoading } = useTokenURI(
    dao,
    auction?.tokenId
  );

  const liveData: LiveAuctionData | null = useMemo(() => {
    if (!auction || !dao) return null;
    return {
      tokenId: auction.tokenId.toString(),
      highestBid: auction.highestBid.toString(),
      highestBidFormatted: `${formatEther(auction.highestBid)} ETH`,
      highestBidder: auction.highestBidder,
      endTime: new Date(Number(auction.endTime) * 1000),
      settled: auction.settled,
      minNextBid: minNextBid.toString(),
      minNextBidFormatted: `${formatEther(minNextBid)} ETH`,
      collectionName: collectionName ?? dao.name,
      chainName: dao.chainName,
      chainId: dao.chainId,
      daoName: dao.name,
      tokenImage: tokenMeta?.image ?? null,
      auctionAddress: dao.auction,
    };
  }, [auction, dao, minNextBid, collectionName, tokenMeta]);

  return {
    liveData,
    isLoading: auctionLoading || tokenLoading,
    isError: auctionError,
    refetch,
  };
}

/* ──────────────────────────────────────────────────────────
 *  UTILITY HOOKS
 * ────────────────────────────────────────────────────────── */

/**
 * Get connected wallet's ETH balance
 */
export function useWalletBalance() {
  const { address } = useAccount();
  const { data } = useBalance({ address });
  return data
    ? { value: data.value, formatted: data.formatted, symbol: data.symbol }
    : null;
}

/**
 * Hook to select a DAO based on current chain ID
 */
export function useSelectedDao(chainId: number | undefined, daoIndex = 0) {
  const daos = useMemo(
    () =>
      chainId
        ? KNOWN_DAOS.filter((d) => d.chainId === chainId)
        : KNOWN_DAOS,
    [chainId]
  );

  const dao = daos[daoIndex] ?? daos[0] ?? undefined;

  return { dao, daos, totalDaos: daos.length };
}

// Re-export utilities
export { formatEther, parseEther };
export { VOTE_SUPPORT };
