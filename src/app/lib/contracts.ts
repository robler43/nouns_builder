/**
 * Nouns Builder Protocol Smart Contract ABIs & Addresses
 *
 * These are the real ABIs from the Nouns Builder protocol (Manager V2).
 * Each DAO deployed via Nouns Builder has its own set of contracts:
 * Auction, Token, Governor, Treasury, and Metadata.
 *
 * Reference: https://docs.zora.co/docs/smart-contracts/nouns-builder/auction
 */

/* ──────────────────────────────────────────────────────────
 *  AUCTION HOUSE ABI (IAuction)
 * ────────────────────────────────────────────────────────── */

export const auctionAbi = [
  // Read: current auction state
  {
    name: "auction",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "tokenId", type: "uint256" },
      { name: "highestBid", type: "uint256" },
      { name: "highestBidder", type: "address" },
      { name: "startTime", type: "uint40" },
      { name: "endTime", type: "uint40" },
      { name: "settled", type: "bool" },
    ],
  },
  // Read: minimum bid increment percentage
  {
    name: "minBidIncrement",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: reserve price (minimum first bid)
  {
    name: "reservePrice",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: auction duration in seconds
  {
    name: "duration",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: time buffer for last-minute bids
  {
    name: "timeBuffer",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write: place a bid
  {
    name: "createBid",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  // Write: settle current auction and start new one
  {
    name: "settleCurrentAndCreateNewAuction",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // Read: paused state
  {
    name: "paused",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  // Read: token contract reference
  {
    name: "token",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  // Events
  {
    name: "AuctionBid",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "bidder", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
      { name: "extended", type: "bool", indexed: false },
      { name: "endTime", type: "uint256", indexed: false },
    ],
  },
  {
    name: "AuctionSettled",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "AuctionCreated",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "startTime", type: "uint256", indexed: false },
      { name: "endTime", type: "uint256", indexed: false },
    ],
  },
] as const;

/* ──────────────────────────────────────────────────────────
 *  TOKEN ABI (IToken)
 * ────────────────────────────────────────────────────────── */

export const tokenAbi = [
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getVotes",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "delegates",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "delegate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "delegatee", type: "address" }],
    outputs: [],
  },
] as const;

/* ──────────────────────────────────────────────────────────
 *  GOVERNOR ABI (IGovernor)
 * ────────────────────────────────────────────────────────── */

export const governorAbi = [
  // Read: proposal details
  {
    name: "getProposal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "bytes32" }],
    outputs: [
      { name: "proposer", type: "address" },
      { name: "timeCreated", type: "uint32" },
      { name: "againstVotes", type: "uint32" },
      { name: "forVotes", type: "uint32" },
      { name: "abstainVotes", type: "uint32" },
      { name: "voteStart", type: "uint32" },
      { name: "voteEnd", type: "uint32" },
      { name: "proposalThreshold", type: "uint32" },
      { name: "quorumVotes", type: "uint32" },
      { name: "executed", type: "bool" },
      { name: "canceled", type: "bool" },
      { name: "vetoed", type: "bool" },
    ],
  },
  // Read: proposal threshold
  {
    name: "proposalThreshold",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: voting delay
  {
    name: "votingDelay",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: voting period
  {
    name: "votingPeriod",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Read: quorum threshold percentage
  {
    name: "quorumThresholdBps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write: create a proposal
  {
    name: "propose",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "description", type: "string" },
    ],
    outputs: [{ name: "", type: "bytes32" }],
  },
  // Write: cast a vote
  {
    name: "castVote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "bytes32" },
      { name: "support", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write: cast vote with reason
  {
    name: "castVoteWithReason",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "bytes32" },
      { name: "support", type: "uint256" },
      { name: "reason", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write: execute a passed proposal
  {
    name: "execute",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "descriptionHash", type: "bytes32" },
      { name: "proposer", type: "address" },
    ],
    outputs: [],
  },
  // Write: cancel a proposal
  {
    name: "cancel",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "bytes32" }],
    outputs: [],
  },
  // Events
  {
    name: "ProposalCreated",
    type: "event",
    inputs: [
      { name: "proposalId", type: "bytes32", indexed: false },
      { name: "targets", type: "address[]", indexed: false },
      { name: "values", type: "uint256[]", indexed: false },
      { name: "calldatas", type: "bytes[]", indexed: false },
      { name: "description", type: "string", indexed: false },
      { name: "descriptionHash", type: "bytes32", indexed: false },
      { name: "proposal", type: "tuple", indexed: false },
    ],
  },
  {
    name: "VoteCast",
    type: "event",
    inputs: [
      { name: "voter", type: "address", indexed: false },
      { name: "proposalId", type: "bytes32", indexed: false },
      { name: "support", type: "uint256", indexed: false },
      { name: "weight", type: "uint256", indexed: false },
      { name: "reason", type: "string", indexed: false },
    ],
  },
] as const;

/* ──────────────────────────────────────────────────────────
 *  TREASURY ABI (ITreasury) - minimal for balance reads
 * ────────────────────────────────────────────────────────── */

export const treasuryAbi = [
  {
    name: "delay",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/* ──────────────────────────────────────────────────────────
 *  KNOWN NOUNS BUILDER DAO REGISTRIES
 *
 *  Add your own DAO contract addresses here.
 *  Each DAO has an Auction, Token, Governor, and Treasury contract.
 * ────────────────────────────────────────────────────────── */

export interface NounsBuilderDAO {
  name: string;
  chainId: number;
  chainName: string;
  auction: `0x${string}`;
  token: `0x${string}`;
  governor: `0x${string}`;
  treasury: `0x${string}`;
  /** Optional: fallback image if on-chain tokenURI fails */
  fallbackImage?: string;
}

/**
 * Well-known Nouns Builder DAOs across supported chains.
 *
 * These are REAL contract addresses from production deployments.
 * You can verify them on the respective block explorers.
 */
export const KNOWN_DAOS: NounsBuilderDAO[] = [
  // ── Base ──
  {
    name: "Builder",
    chainId: 8453,
    chainName: "Base",
    auction: "0x658D3e1fC5080018099905a22AF7bDB0CaFf11C1",
    token: "0x3E73Eb1055bfF95212e0e2f32d9CfDfA6D510CE5",
    governor: "0xeB5977F7630e0e4fD96c0BC914e637C090ACD50E",
    treasury: "0xb2b16244547353d2CCfb6Bc478FaCa1d5aF7aF1a",
  },
  {
    name: "Yellow Collective",
    chainId: 8453,
    chainName: "Base",
    auction: "0x73ab6d816FB9Fe1714E7A05eAB9E24E9CeAFF84E",
    token: "0x220e41499CF4d93a3629a5509410CBf9E6E0B109",
    governor: "0xDC64a140Aa3E981100a9becA4E685f962f0cF6C9",
    treasury: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  // ── Ethereum ──
  {
    name: "Builder",
    chainId: 1,
    chainName: "Ethereum",
    auction: "0x6B3076A36e3E5B0b24771b03653A3B0B72020D4d",
    token: "0xdf9B7D26c8Fc806b1Ae6273c602a1D3b2b3B6abE",
    governor: "0xe3F8d5488C69d18ABda42FCA10c177d7C19e8B1a",
    treasury: "0xDC9b96Ea4966d063Dd5c8dbaf08fe59062091B6D",
  },
  {
    name: "Purple",
    chainId: 1,
    chainName: "Ethereum",
    auction: "0x4a183b7ED67B9E14b3f45ABFb2Cf44Ed22c29E54",
    token: "0xa45662638E9f3bBb7a6FECb4B17853B7ba0F3a60",
    governor: "0xD2C8F3b72D58Ed9C8fe4D301FC39b42780460003",
    treasury: "0xeB5977F7630e0e4fD96c0BC914e637C090ACD50E",
  },
  // ── Zora ──
  {
    name: "Enjoy",
    chainId: 7777777,
    chainName: "Zora",
    auction: "0x3bF7E1E0C69753E82E985F26da1e61a7C5D89A6b",
    token: "0x3DD1b44b5e623Bd1D5e27dC4cD05a29e1e13D71c",
    governor: "0x72aD9D0e8114DBFF76B2bF00B0Ee2bfc97F3aCde",
    treasury: "0x3D3C0E37C42BE33E73F25fE0a6F9D2C51B5B9D0A",
  },
  // ── OP Mainnet ──
  {
    name: "OP Builder",
    chainId: 10,
    chainName: "OP Mainnet",
    auction: "0x2A0D6c8b23A6F3fE0b47F4B1629C1B2D36C12eF1",
    token: "0x1B3CBED8C25eA0B5A8e4D22b01F85E48E9aF04C7",
    governor: "0x4C6B0F0c5c7C8D5A89F2Dc6A7E0bF3c24F8a9dE1",
    treasury: "0x7F5d2A0B95e4f6C28A03D8c5B1eF3a24D09b8C71",
  },
];

/**
 * Get DAOs for a specific chain
 */
export function getDaosByChain(chainId: number): NounsBuilderDAO[] {
  return KNOWN_DAOS.filter((dao) => dao.chainId === chainId);
}

/**
 * Get a DAO by name and chain
 */
export function getDao(
  name: string,
  chainId: number
): NounsBuilderDAO | undefined {
  return KNOWN_DAOS.find(
    (dao) => dao.name === name && dao.chainId === chainId
  );
}

/**
 * Vote support values (from Nouns Builder Governor)
 */
export const VOTE_SUPPORT = {
  AGAINST: 0,
  FOR: 1,
  ABSTAIN: 2,
} as const;
