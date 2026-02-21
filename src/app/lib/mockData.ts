// Mock data for Nouns Builder governance
// TODO: Replace with real smart contract calls

export type ProposalStatus = "active" | "pending" | "passed" | "defeated" | "executed" | "cancelled";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposerAddress: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  startTime: Date;
  endTime: Date;
  category: "grant" | "governance" | "treasury" | "community";
  transactions: Transaction[];
}

export interface Transaction {
  target: string;
  value: string;
  signature: string;
  calldata: string;
}

export interface Comment {
  id: string;
  proposalId: string;
  author: string;
  authorAddress: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number }[];
}

export interface Delegate {
  address: string;
  name: string;
  avatar: string;
  votingPower: number;
  proposalsVoted: number;
  delegators: number;
  bio: string;
  participation: number; // percentage
  recentVotes: { proposalId: string; vote: "for" | "against" | "abstain" }[];
}

export interface NFTAuction {
  id: string;
  tokenId: string;
  collection: string;
  collectionName: string;
  imageUrl: string;
  currentBid: number;
  currentBidder: string;
  currentBidderName: string;
  chain: string;
  timeAgo: string;
  endTime: Date;
  minBidIncrement: number;
  bids: AuctionBid[];
}

export interface AuctionBid {
  bidder: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  txHash?: string;
}

export const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Fund Community Art Gallery 🎨",
    description: "Proposal to allocate 50 ETH from treasury to create a community art gallery showcasing Nouns-inspired pixel art from community members. The gallery will be open-source and feature rotating exhibitions.",
    proposer: "pixelmaster.eth",
    proposerAddress: "0x1234...5678",
    status: "active",
    votesFor: 127,
    votesAgainst: 23,
    votesAbstain: 8,
    totalVotes: 158,
    quorum: 100,
    startTime: new Date("2026-02-18"),
    endTime: new Date("2026-02-25"),
    category: "grant",
    transactions: [
      {
        target: "0xTreasury",
        value: "50000000000000000000",
        signature: "transfer(address,uint256)",
        calldata: "0x...",
      },
    ],
  },
  {
    id: "2",
    title: "Update Voting Period to 5 Days ⚡",
    description: "Reduce the voting period from 7 days to 5 days to speed up governance while maintaining participation. This will help us move faster on time-sensitive proposals.",
    proposer: "dao_builder.eth",
    proposerAddress: "0x8765...4321",
    status: "active",
    votesFor: 89,
    votesAgainst: 67,
    votesAbstain: 12,
    totalVotes: 168,
    quorum: 100,
    startTime: new Date("2026-02-17"),
    endTime: new Date("2026-02-24"),
    category: "governance",
    transactions: [
      {
        target: "0xGovernor",
        value: "0",
        signature: "setVotingPeriod(uint256)",
        calldata: "0x...",
      },
    ],
  },
  {
    id: "3",
    title: "Launch Nouns Builder Mobile App 📱",
    description: "Fund development of a native mobile app for iOS and Android to make governance more accessible on-the-go. Budget: 100 ETH for 6-month development cycle.",
    proposer: "mobile_dev.eth",
    proposerAddress: "0xabcd...ef01",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    totalVotes: 0,
    quorum: 100,
    startTime: new Date("2026-02-22"),
    endTime: new Date("2026-03-01"),
    category: "grant",
    transactions: [],
  },
  {
    id: "4",
    title: "Treasury Diversification Strategy 💰",
    description: "Diversify 30% of treasury holdings into stablecoins (USDC/DAI) to reduce volatility risk and ensure stable funding for approved grants.",
    proposer: "treasury_guard.eth",
    proposerAddress: "0x9876...5432",
    status: "passed",
    votesFor: 234,
    votesAgainst: 45,
    votesAbstain: 21,
    totalVotes: 300,
    quorum: 100,
    startTime: new Date("2026-02-10"),
    endTime: new Date("2026-02-17"),
    category: "treasury",
    transactions: [],
  },
  {
    id: "5",
    title: "Weekly Community Calls ☎️",
    description: "Establish weekly community calls every Friday to discuss active proposals, answer questions, and build stronger connections.",
    proposer: "community_mod.eth",
    proposerAddress: "0xdef0...1234",
    status: "executed",
    votesFor: 156,
    votesAgainst: 12,
    votesAbstain: 8,
    totalVotes: 176,
    quorum: 100,
    startTime: new Date("2026-02-03"),
    endTime: new Date("2026-02-10"),
    category: "community",
    transactions: [],
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    proposalId: "1",
    author: "artlover.eth",
    authorAddress: "0xaaa...bbb",
    content: "Love this idea! The community has so much creative talent that deserves to be showcased. Strong YES from me! 🎨",
    timestamp: new Date("2026-02-19T10:30:00"),
    reactions: [
      { emoji: "❤️", count: 12 },
      { emoji: "🎨", count: 8 },
    ],
  },
  {
    id: "c2",
    proposalId: "1",
    author: "fiscally_responsible.eth",
    authorAddress: "0xccc...ddd",
    content: "50 ETH seems steep. Can we see a detailed budget breakdown? How will success be measured?",
    timestamp: new Date("2026-02-19T14:15:00"),
    reactions: [
      { emoji: "👍", count: 5 },
      { emoji: "🤔", count: 3 },
    ],
  },
  {
    id: "c3",
    proposalId: "2",
    author: "speed_racer.eth",
    authorAddress: "0xeee...fff",
    content: "5 days is perfect. We need to move faster while keeping participation high. Other DAOs do 3-day votes successfully.",
    timestamp: new Date("2026-02-18T09:00:00"),
    reactions: [
      { emoji: "⚡", count: 15 },
    ],
  },
];

export const mockDelegates: Delegate[] = [
  {
    address: "0x1111...2222",
    name: "nounsdao_veteran.eth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=veteran",
    votingPower: 45,
    proposalsVoted: 127,
    delegators: 23,
    bio: "Active since day 1. Focus on sustainable growth and community building. Always vote with data and long-term vision.",
    participation: 98,
    recentVotes: [
      { proposalId: "1", vote: "for" },
      { proposalId: "2", vote: "abstain" },
      { proposalId: "4", vote: "for" },
    ],
  },
  {
    address: "0x3333...4444",
    name: "creative_builder.eth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=builder",
    votingPower: 38,
    proposalsVoted: 98,
    delegators: 18,
    bio: "Artist and developer. Passionate about funding creative projects and making governance accessible.",
    participation: 89,
    recentVotes: [
      { proposalId: "1", vote: "for" },
      { proposalId: "2", vote: "against" },
      { proposalId: "4", vote: "for" },
    ],
  },
  {
    address: "0x5555...6666",
    name: "governance_guru.eth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guru",
    votingPower: 52,
    proposalsVoted: 156,
    delegators: 31,
    bio: "Governance specialist. I read every proposal carefully and provide detailed voting rationales.",
    participation: 100,
    recentVotes: [
      { proposalId: "1", vote: "for" },
      { proposalId: "2", vote: "for" },
      { proposalId: "4", vote: "for" },
    ],
  },
  {
    address: "0x7777...8888",
    name: "treasury_strategist.eth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=strategist",
    votingPower: 29,
    proposalsVoted: 89,
    delegators: 12,
    bio: "Former DeFi PM. Focus on treasury management and sustainable funding mechanisms.",
    participation: 76,
    recentVotes: [
      { proposalId: "1", vote: "abstain" },
      { proposalId: "2", vote: "against" },
      { proposalId: "4", vote: "for" },
    ],
  },
  {
    address: "0x9999...aaaa",
    name: "community_first.eth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=community",
    votingPower: 21,
    proposalsVoted: 67,
    delegators: 9,
    bio: "Here for the memes and the community. Prioritize fun, accessible proposals that grow our culture.",
    participation: 82,
    recentVotes: [
      { proposalId: "1", vote: "for" },
      { proposalId: "2", vote: "abstain" },
      { proposalId: "4", vote: "abstain" },
    ],
  },
];

// Helper function to get proposal by ID
export const getProposalById = (id: string): Proposal | undefined => {
  return mockProposals.find((p) => p.id === id);
};

// Helper function to get comments for a proposal
export const getCommentsByProposalId = (proposalId: string): Comment[] => {
  return mockComments.filter((c) => c.proposalId === proposalId);
};

// Helper function to format large numbers
export const formatVotes = (votes: number): string => {
  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}k`;
  }
  return votes.toString();
};

// Helper function to get status color
export const getStatusColor = (status: ProposalStatus): string => {
  switch (status) {
    case "active":
      return "bg-emerald-500";
    case "pending":
      return "bg-amber-500";
    case "passed":
      return "bg-blue-500";
    case "defeated":
      return "bg-red-500";
    case "executed":
      return "bg-purple-500";
    case "cancelled":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

// Helper function to get time remaining
export const getTimeRemaining = (endTime: Date): string => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
};

// NFT Auctions Mock Data
export const mockAuctions: NFTAuction[] = [
  {
    id: "1",
    tokenId: "606",
    collection: "based-fellas",
    collectionName: "Based Fellas",
    imageUrl: "https://images.unsplash.com/photo-1763888647741-bbce5622ab01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGNoYXJhY3RlciUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTYyMjY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 0.0001,
    currentBidder: "0xwisk...fair",
    currentBidderName: "wiskott.worldfair.eth",
    chain: "Base",
    timeAgo: "18h ago",
    endTime: new Date("2026-02-21T12:00:00"),
    minBidIncrement: 0.00001,
    bids: [
      {
        bidder: "0xwisk...fair",
        bidderName: "wiskott.worldfair.eth",
        amount: 0.0001,
        timestamp: new Date("2026-02-19T18:00:00"),
        txHash: "0xabc123...",
      },
      {
        bidder: "0x1234...5678",
        bidderName: "collector.eth",
        amount: 0.00008,
        timestamp: new Date("2026-02-19T16:30:00"),
      },
    ],
  },
  {
    id: "2",
    tokenId: "1337",
    collection: "nouns-builder",
    collectionName: "Nouns Builder",
    imageUrl: "https://images.unsplash.com/photo-1614936146413-795d446a70c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGF2YXRhciUyMG5lb258ZW58MXx8fHwxNzcxNjIyNzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 0.042,
    currentBidder: "0xdao...build",
    currentBidderName: "dao_builder.eth",
    chain: "Ethereum",
    timeAgo: "2h ago",
    endTime: new Date("2026-02-20T18:00:00"),
    minBidIncrement: 0.001,
    bids: [
      {
        bidder: "0xdao...build",
        bidderName: "dao_builder.eth",
        amount: 0.042,
        timestamp: new Date("2026-02-20T10:00:00"),
      },
      {
        bidder: "0xpixel...art",
        bidderName: "pixelmaster.eth",
        amount: 0.041,
        timestamp: new Date("2026-02-20T08:00:00"),
      },
    ],
  },
  {
    id: "3",
    tokenId: "88",
    collection: "pixel-punks",
    collectionName: "Pixel Punks",
    imageUrl: "https://images.unsplash.com/photo-1759663174515-9057d83c8b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGdhbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxNjIyNzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 0.15,
    currentBidder: "0xnft...whale",
    currentBidderName: "nft_whale.eth",
    chain: "Base",
    timeAgo: "1d ago",
    endTime: new Date("2026-02-22T20:00:00"),
    minBidIncrement: 0.005,
    bids: [
      {
        bidder: "0xnft...whale",
        bidderName: "nft_whale.eth",
        amount: 0.15,
        timestamp: new Date("2026-02-19T12:00:00"),
      },
    ],
  },
  {
    id: "4",
    tokenId: "420",
    collection: "based-fellas",
    collectionName: "Based Fellas",
    imageUrl: "https://images.unsplash.com/photo-1769342285321-ddae675eaa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHBpeGVsJTIwYXJ0fGVufDF8fHx8MTc3MTYyMjcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 0.0069,
    currentBidder: "0xmeme...lord",
    currentBidderName: "memelord.eth",
    chain: "Base",
    timeAgo: "6h ago",
    endTime: new Date("2026-02-21T15:00:00"),
    minBidIncrement: 0.0001,
    bids: [
      {
        bidder: "0xmeme...lord",
        bidderName: "memelord.eth",
        amount: 0.0069,
        timestamp: new Date("2026-02-20T06:00:00"),
      },
    ],
  },
  {
    id: "5",
    tokenId: "777",
    collection: "retro-avatars",
    collectionName: "Retro Avatars",
    imageUrl: "https://images.unsplash.com/photo-1606937324721-46012a1eee43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw4Yml0JTIwcGl4ZWwlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxNjIyNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 0.25,
    currentBidder: "0xart...guru",
    currentBidderName: "art_collector.eth",
    chain: "Ethereum",
    timeAgo: "4h ago",
    endTime: new Date("2026-02-21T16:00:00"),
    minBidIncrement: 0.01,
    bids: [
      {
        bidder: "0xart...guru",
        bidderName: "art_collector.eth",
        amount: 0.25,
        timestamp: new Date("2026-02-20T08:00:00"),
      },
      {
        bidder: "0xvintage...fan",
        bidderName: "vintage_lover.eth",
        amount: 0.24,
        timestamp: new Date("2026-02-20T06:00:00"),
      },
    ],
  },
];

// Helper function to get auction by ID
export const getAuctionById = (id: string): NFTAuction | undefined => {
  return mockAuctions.find((a) => a.id === id);
};

// Helper function to format ETH amounts
export const formatETH = (amount: number): string => {
  return `${amount.toFixed(4)} ETH`;
};

// Community Event Types
export type CommunityEventType =
  | "auction_created"
  | "auction_bid"
  | "auction_settled"
  | "proposal_created"
  | "proposal_vote"
  | "proposal_executed"
  | "proposal_update";

export interface CommunityEvent {
  id: string;
  type: CommunityEventType;
  actor: string;
  actorAddress: string;
  title: string;
  description: string;
  timestamp: Date;
  txHash?: string;
  meta: Record<string, string | number>;
  daoName: string;
  chain: string;
  imageUrl?: string;
  contentBlock?: string;
  avatarColor: string;
}

export const EVENT_TYPE_CONFIG: Record<
  CommunityEventType,
  { label: string; color: string; bg: string }
> = {
  auction_created: { label: "Auction Created", color: "text-blue-600", bg: "bg-blue-100" },
  auction_bid: { label: "Auction Bid", color: "text-emerald-600", bg: "bg-emerald-100" },
  auction_settled: { label: "Auction Settled", color: "text-amber-600", bg: "bg-amber-100" },
  proposal_created: { label: "Proposal Created", color: "text-violet-600", bg: "bg-violet-100" },
  proposal_vote: { label: "Proposal Vote", color: "text-pink-600", bg: "bg-pink-100" },
  proposal_executed: { label: "Proposal Executed", color: "text-teal-600", bg: "bg-teal-100" },
  proposal_update: { label: "Proposal Update", color: "text-orange-600", bg: "bg-orange-100" },
};

export const mockCommunityEvents: CommunityEvent[] = [
  {
    id: "ev1",
    type: "auction_created",
    actor: "nouns_deployer.eth",
    actorAddress: "0xdep0...1234",
    title: "New auction started",
    description: "Based Fellas #607 is now up for auction",
    timestamp: new Date("2026-02-20T11:00:00"),
    meta: { collection: "Based Fellas", tokenId: "607", startingBid: 0.0001 },
    daoName: "based_fellas",
    chain: "Base",
    imageUrl: "https://images.unsplash.com/photo-1763888647741-bbce5622ab01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGNoYXJhY3RlciUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTYyMjY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarColor: "from-yellow-300 via-green-400 to-emerald-500",
  },
  {
    id: "ev2",
    type: "auction_bid",
    actor: "wiskott.worldfair.eth",
    actorAddress: "0xwisk...fair",
    title: "New bid placed",
    description: "Bid 0.0001 ETH on Based Fellas #606",
    timestamp: new Date("2026-02-20T10:45:00"),
    txHash: "0xabc123...",
    meta: { collection: "Based Fellas", tokenId: "606", amount: 0.0001 },
    daoName: "based_fellas",
    chain: "Base",
    contentBlock: "wiskott.worldfair.eth placed a bid of 0.0001 ETH on Based Fellas #606",
    avatarColor: "from-pink-400 via-purple-400 to-blue-400",
  },
  {
    id: "ev3",
    type: "auction_settled",
    actor: "collector.eth",
    actorAddress: "0x1234...5678",
    title: "Auction settled",
    description: "Retro Avatars #776 won by collector.eth for 0.32 ETH",
    timestamp: new Date("2026-02-20T09:30:00"),
    txHash: "0xdef456...",
    meta: { collection: "Retro Avatars", tokenId: "776", finalPrice: 0.32 },
    daoName: "retro_avatars",
    chain: "Ethereum",
    imageUrl: "https://images.unsplash.com/photo-1606937324721-46012a1eee43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw4Yml0JTIwcGl4ZWwlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxNjIyNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarColor: "from-amber-300 via-orange-400 to-red-400",
  },
  {
    id: "ev4",
    type: "proposal_created",
    actor: "pixelmaster.eth",
    actorAddress: "0x1234...5678",
    title: "New proposal submitted",
    description: "Fund Community Art Gallery — requesting 50 ETH from treasury",
    timestamp: new Date("2026-02-20T08:15:00"),
    meta: { proposalId: "1", amount: 50 },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Proposal to allocate 50 ETH from treasury to create a community art gallery showcasing Nouns-inspired pixel art.",
    avatarColor: "from-cyan-300 via-blue-400 to-indigo-500",
  },
  {
    id: "ev5",
    type: "proposal_vote",
    actor: "governance_guru.eth",
    actorAddress: "0x5555...6666",
    title: "Vote cast",
    description: "Voted FOR on 'Fund Community Art Gallery' with 52 votes",
    timestamp: new Date("2026-02-20T07:50:00"),
    txHash: "0x789abc...",
    meta: { proposalId: "1", vote: "for", weight: 52 },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Voted FOR with 52 votes",
    avatarColor: "from-lime-300 via-emerald-400 to-teal-500",
  },
  {
    id: "ev6",
    type: "proposal_executed",
    actor: "dao_executor.eth",
    actorAddress: "0xexec...0001",
    title: "Proposal executed",
    description: "Weekly Community Calls is now live — treasury transfer complete",
    timestamp: new Date("2026-02-19T18:00:00"),
    txHash: "0xexe001...",
    meta: { proposalId: "5" },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Treasury transfer complete. Weekly Community Calls is now live.",
    avatarColor: "from-rose-300 via-pink-400 to-fuchsia-500",
  },
  {
    id: "ev7",
    type: "proposal_update",
    actor: "dao_builder.eth",
    actorAddress: "0x8765...4321",
    title: "Proposal updated",
    description: "Update Voting Period to 5 Days",
    timestamp: new Date("2026-02-19T16:30:00"),
    meta: { proposalId: "2" },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Updated timeline and added new execution parameters for the 5-day voting period proposal.",
    avatarColor: "from-yellow-300 via-green-400 to-emerald-500",
  },
  {
    id: "ev8",
    type: "auction_bid",
    actor: "dao_builder.eth",
    actorAddress: "0xdao...build",
    title: "New bid placed",
    description: "Bid 0.042 ETH on Nouns Builder #1337",
    timestamp: new Date("2026-02-20T10:00:00"),
    txHash: "0xbid002...",
    meta: { collection: "Nouns Builder", tokenId: "1337", amount: 0.042 },
    daoName: "Nouns Builder",
    chain: "Ethereum",
    contentBlock: "dao_builder.eth placed a bid of 0.042 ETH on Nouns Builder #1337",
    avatarColor: "from-pink-400 via-purple-400 to-blue-400",
  },
  {
    id: "ev9",
    type: "proposal_vote",
    actor: "treasury_strategist.eth",
    actorAddress: "0x7777...8888",
    title: "Vote cast",
    description: "Voted AGAINST on 'Update Voting Period to 5 Days' with 29 votes",
    timestamp: new Date("2026-02-19T14:20:00"),
    txHash: "0xvote03...",
    meta: { proposalId: "2", vote: "against", weight: 29 },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Voted AGAINST with 29 votes",
    avatarColor: "from-amber-300 via-orange-400 to-red-400",
  },
  {
    id: "ev10",
    type: "auction_created",
    actor: "nouns_deployer.eth",
    actorAddress: "0xdep0...1234",
    title: "New auction started",
    description: "Pixel Punks #89 is now up for auction",
    timestamp: new Date("2026-02-19T12:00:00"),
    meta: { collection: "Pixel Punks", tokenId: "89", startingBid: 0.01 },
    daoName: "pixel_punks",
    chain: "Base",
    imageUrl: "https://images.unsplash.com/photo-1759663174515-9057d83c8b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGdhbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxNjIyNzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarColor: "from-cyan-300 via-blue-400 to-indigo-500",
  },
  {
    id: "ev11",
    type: "proposal_created",
    actor: "mobile_dev.eth",
    actorAddress: "0xabcd...ef01",
    title: "New proposal submitted",
    description: "Launch Nouns Builder Mobile App — requesting 100 ETH for 6-month dev",
    timestamp: new Date("2026-02-19T10:00:00"),
    meta: { proposalId: "3", amount: 100 },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "Fund development of a native mobile app for iOS and Android. Budget: 100 ETH for 6-month development cycle.",
    avatarColor: "from-lime-300 via-emerald-400 to-teal-500",
  },
  {
    id: "ev12",
    type: "auction_settled",
    actor: "nft_whale.eth",
    actorAddress: "0xnft...whale",
    title: "Auction settled",
    description: "Based Fellas #605 won by nft_whale.eth for 0.089 ETH",
    timestamp: new Date("2026-02-19T08:00:00"),
    txHash: "0xsettle2...",
    meta: { collection: "Based Fellas", tokenId: "605", finalPrice: 0.089 },
    daoName: "based_fellas",
    chain: "Base",
    imageUrl: "https://images.unsplash.com/photo-1769342285321-ddae675eaa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHBpeGVsJTIwYXJ0fGVufDF8fHx8MTc3MTYyMjcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarColor: "from-rose-300 via-pink-400 to-fuchsia-500",
  },
  {
    id: "ev13",
    type: "proposal_update",
    actor: "treasury_guard.eth",
    actorAddress: "0x9876...5432",
    title: "Proposal updated",
    description: "Treasury Diversification Strategy",
    timestamp: new Date("2026-02-18T22:00:00"),
    meta: { proposalId: "4" },
    daoName: "Nouns Builder",
    chain: "Ethereum",
    contentBlock: "Added execution details for the 30% stablecoin diversification plan.",
    avatarColor: "from-amber-300 via-orange-400 to-red-400",
  },
  {
    id: "ev14",
    type: "proposal_executed",
    actor: "dao_executor.eth",
    actorAddress: "0xexec...0001",
    title: "Proposal executed",
    description: "Treasury Diversification Strategy is now live — 30% moved to stables",
    timestamp: new Date("2026-02-18T15:00:00"),
    txHash: "0xexe002...",
    meta: { proposalId: "4" },
    daoName: "Nouns Builder",
    chain: "Base",
    contentBlock: "30% of treasury holdings successfully moved to USDC/DAI stablecoins.",
    avatarColor: "from-cyan-300 via-blue-400 to-indigo-500",
  },
];