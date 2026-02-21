# Smart Contract Integration Guide

This guide explains how to connect the Nouns Governance app to real Nouns Builder smart contracts.

## Overview

Currently, the app uses mock data for demonstration. This guide shows you exactly where and how to replace mock data with real blockchain calls.

## Features

- ✅ Governance Dashboard with proposal voting
- ✅ Proposal Creation Wizard with templates  
- ✅ Delegate Discovery and delegation
- ✅ User Profile with voting history
- ✅ Onboarding flow for newcomers
- ✅ **NFT Auction System** with bidding (NEW!)

## Prerequisites

Install Web3 libraries:

```bash
npm install viem wagmi @rainbow-me/rainbowkit @tanstack/react-query
```

## Step 1: Add Wallet Connection

### 1.1 Configure Wagmi

Create `/src/app/lib/wagmi.ts`:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, goerli } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Nouns Governance',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from walletconnect.com
  chains: [mainnet, goerli],
});
```

### 1.2 Wrap App

Update `/src/app/App.tsx`:

```typescript
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 1.3 Add Connect Button

Update `/src/app/components/Navigation.tsx`:

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Add to the navigation bar:
<ConnectButton />
```

## Step 2: Contract ABIs

Create `/src/app/lib/abis.ts`:

```typescript
// Nouns Builder Governor ABI (simplified - add full ABI from contract)
export const governorABI = [
  {
    name: 'proposals',
    inputs: [{ name: 'proposalId', type: 'bytes32' }],
    outputs: [
      { name: 'proposer', type: 'address' },
      { name: 'targets', type: 'address[]' },
      { name: 'values', type: 'uint256[]' },
      { name: 'signatures', type: 'string[]' },
      { name: 'calldatas', type: 'bytes[]' },
      { name: 'startBlock', type: 'uint256' },
      { name: 'endBlock', type: 'uint256' },
      { name: 'forVotes', type: 'uint256' },
      { name: 'againstVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' },
    ],
  },
  {
    name: 'castVote',
    inputs: [
      { name: 'proposalId', type: 'bytes32' },
      { name: 'support', type: 'uint8' }, // 0=against, 1=for, 2=abstain
    ],
  },
  {
    name: 'propose',
    inputs: [
      { name: 'targets', type: 'address[]' },
      { name: 'values', type: 'uint256[]' },
      { name: 'signatures', type: 'string[]' },
      { name: 'calldatas', type: 'bytes[]' },
      { name: 'description', type: 'string' },
    ],
  },
  // Add more functions as needed
] as const;

// Nouns Builder Token ABI
export const tokenABI = [
  {
    name: 'delegate',
    inputs: [{ name: 'delegatee', type: 'address' }],
  },
  {
    name: 'getVotes',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'votes', type: 'uint256' }],
  },
  {
    name: 'delegates',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'delegate', type: 'address' }],
  },
] as const;

// NFT Auction House ABI (Nouns-style auction)
export const auctionABI = [
  {
    name: 'auction',
    outputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'bidder', type: 'address' },
      { name: 'settled', type: 'bool' },
    ],
  },
  {
    name: 'createBid',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    name: 'settleCurrentAndCreateNewAuction',
    inputs: [],
  },
] as const;
```

## Step 3: Contract Addresses

Create `/src/app/lib/contracts.ts`:

```typescript
// Replace these with actual Nouns Builder contract addresses
export const CONTRACTS = {
  mainnet: {
    governor: '0x...' as `0x${string}`,
    token: '0x...' as `0x${string}`,
    treasury: '0x...' as `0x${string}`,
  },
  goerli: {
    governor: '0x...' as `0x${string}`,
    token: '0x...' as `0x${string}`,
    treasury: '0x...' as `0x${string}`,
  },
  base: {
    auctionHouse: '0x...' as `0x${string}`,
    basedFellas: '0x...' as `0x${string}`,
    // ... other Base contracts
  },
};
```

## Step 4: Fetch Proposals

Replace mock data in `/src/app/pages/Dashboard.tsx`:

```typescript
import { useContractReads } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { governorABI } from '../lib/abis';

export function Dashboard() {
  const { data: proposalIds } = useContractRead({
    address: CONTRACTS.mainnet.governor,
    abi: governorABI,
    functionName: 'getProposalIds', // You may need to implement this view function
  });

  const { data: proposals } = useContractReads({
    contracts: proposalIds?.map((id) => ({
      address: CONTRACTS.mainnet.governor,
      abi: governorABI,
      functionName: 'proposals',
      args: [id],
    })),
  });

  // Transform contract data to match your Proposal interface
  const transformedProposals = proposals?.map((p, idx) => ({
    id: proposalIds[idx],
    title: extractTitleFromDescription(p.description),
    description: p.description,
    proposer: p.proposer,
    votesFor: Number(p.forVotes),
    votesAgainst: Number(p.againstVotes),
    votesAbstain: Number(p.abstainVotes),
    // ... map other fields
  }));

  // Rest of your component...
}
```

## Step 5: Cast Votes

Replace mock vote function in `/src/app/pages/ProposalDetail.tsx`:

```typescript
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { governorABI } from '../lib/abis';

export function ProposalDetail() {
  const { write: castVote, data: txData } = useContractWrite({
    address: CONTRACTS.mainnet.governor,
    abi: governorABI,
    functionName: 'castVote',
  });

  const { isLoading: isVoting, isSuccess } = useWaitForTransaction({
    hash: txData?.hash,
  });

  const handleVote = async (vote: "for" | "against" | "abstain") => {
    const support = vote === "for" ? 1 : vote === "against" ? 0 : 2;
    
    castVote({
      args: [proposal.id, support],
    });
  };

  // Show isVoting state while transaction is pending
  // Show success toast when isSuccess becomes true
}
```

## Step 6: Delegate Votes

Replace mock delegation in `/src/app/pages/Delegates.tsx`:

```typescript
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { tokenABI } from '../lib/abis';

export function Delegates() {
  const { write: delegateVotes, data: txData } = useContractWrite({
    address: CONTRACTS.mainnet.token,
    abi: tokenABI,
    functionName: 'delegate',
  });

  const { isLoading: isDelegating, isSuccess } = useWaitForTransaction({
    hash: txData?.hash,
  });

  const handleDelegate = (delegateAddress: string) => {
    delegateVotes({
      args: [delegateAddress as `0x${string}`],
    });
  };
}
```

## Step 7: Create Proposals

Replace mock proposal creation in `/src/app/pages/CreateProposal.tsx`:

```typescript
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { governorABI } from '../lib/abis';
import { encodeFunctionData } from 'viem';

export function CreateProposal() {
  const { write: createProposal, data: txData } = useContractWrite({
    address: CONTRACTS.mainnet.governor,
    abi: governorABI,
    functionName: 'propose',
  });

  const { isLoading: isCreating, isSuccess } = useWaitForTransaction({
    hash: txData?.hash,
  });

  const handleSubmit = async () => {
    // Example: Grant proposal sending 50 ETH
    const targets = [CONTRACTS.mainnet.treasury];
    const values = [parseEther('50')]; // 50 ETH
    const signatures = ['transfer(address,uint256)'];
    const calldatas = [
      encodeFunctionData({
        abi: treasuryABI,
        functionName: 'transfer',
        args: [recipientAddress, parseEther('50')],
      }),
    ];
    const description = `${proposalData.title}\n\n${proposalData.description}`;

    createProposal({
      args: [targets, values, signatures, calldatas, description],
    });
  };
}
```

## Step 8: Fetch User Data

Get user's voting power and delegation status:

```typescript
import { useAccount, useContractReads } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { tokenABI } from '../lib/abis';

export function Profile() {
  const { address } = useAccount();

  const { data } = useContractReads({
    contracts: [
      {
        address: CONTRACTS.mainnet.token,
        abi: tokenABI,
        functionName: 'getVotes',
        args: [address],
      },
      {
        address: CONTRACTS.mainnet.token,
        abi: tokenABI,
        functionName: 'delegates',
        args: [address],
      },
    ],
  });

  const votingPower = data?.[0]?.result;
  const currentDelegate = data?.[1]?.result;

  // Use this data in your UI
}
```

## Step 9: Event Listening

Listen for real-time updates:

```typescript
import { useContractEvent } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { governorABI } from '../lib/abis';

export function Dashboard() {
  // Listen for new proposals
  useContractEvent({
    address: CONTRACTS.mainnet.governor,
    abi: governorABI,
    eventName: 'ProposalCreated',
    listener: (logs) => {
      // Refetch proposals or update state
      console.log('New proposal created:', logs);
    },
  });

  // Listen for votes
  useContractEvent({
    address: CONTRACTS.mainnet.governor,
    abi: governorABI,
    eventName: 'VoteCast',
    listener: (logs) => {
      // Update vote counts in real-time
      console.log('Vote cast:', logs);
    },
  });
}
```

## Step 10: Error Handling

Add proper error handling:

```typescript
const { write: castVote, error } = useContractWrite({
  address: CONTRACTS.mainnet.governor,
  abi: governorABI,
  functionName: 'castVote',
  onError: (error) => {
    if (error.message.includes('User rejected')) {
      toast.error('Transaction cancelled');
    } else if (error.message.includes('insufficient funds')) {
      toast.error('Insufficient ETH for gas');
    } else {
      toast.error('Transaction failed', {
        description: error.message,
      });
    }
  },
  onSuccess: (data) => {
    toast.success('Transaction submitted!', {
      description: `Hash: ${data.hash}`,
    });
  },
});
```

## Common Patterns

### Loading States

```typescript
{isVoting && <Spinner />}
{isSuccess && <CheckCircle className="text-green-500" />}
{error && <XCircle className="text-red-500" />}
```

### Gating Actions

```typescript
const { isConnected } = useAccount();

if (!isConnected) {
  return <ConnectButton />;
}
```

### Network Switching

```typescript
import { useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const { switchChain } = useSwitchChain();

if (chain?.id !== mainnet.id) {
  return (
    <Button onClick={() => switchChain({ chainId: mainnet.id })}>
      Switch to Mainnet
    </Button>
  );
}
```

## Testing

Test on Goerli testnet first:

1. Get testnet ETH from a faucet
2. Deploy test contracts or use existing Nouns Builder testnet
3. Update `CONTRACTS.goerli` addresses
4. Switch your wallet to Goerli network

## Resources

- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Nouns Builder Docs](https://nouns.build/docs)
- [Etherscan Contract Reader](https://etherscan.io/)

## Notes

- Always test transactions on testnets first
- Handle gas estimation and user balance checks
- Provide clear transaction feedback (pending, success, failed)
- Cache contract reads to reduce RPC calls
- Consider using The Graph for historical data

## Step 11: NFT Auction Integration (NEW!)

The app now includes a complete NFT auction system featuring pixel art NFTs like Based Fellas. Here's how to integrate it with real auction contracts:

### 11.1 Auction Contract ABI

Add to `/src/app/lib/abis.ts`:

```typescript
// NFT Auction House ABI (Nouns-style auction)
export const auctionABI = [
  {
    name: 'auction',
    outputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'bidder', type: 'address' },
      { name: 'settled', type: 'bool' },
    ],
  },
  {
    name: 'createBid',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    name: 'settleCurrentAndCreateNewAuction',
    inputs: [],
  },
] as const;
```

### 11.2 Fetch Active Auctions

Replace mock data in `/src/app/pages/Auctions.tsx`:

```typescript
import { useContractReads, useAccount } from 'wagmi';
import { formatEther } from 'viem';

export function Auctions() {
  // Fetch current auction from auction house
  const { data: auctionData } = useContractRead({
    address: CONTRACTS.mainnet.auctionHouse,
    abi: auctionABI,
    functionName: 'auction',
    watch: true, // Re-fetch on new blocks
  });

  // Get NFT metadata (image, traits, etc.)
  const { data: tokenURI } = useContractRead({
    address: CONTRACTS.mainnet.token,
    abi: nftABI,
    functionName: 'tokenURI',
    args: [auctionData?.tokenId],
  });

  // Parse metadata from tokenURI
  const metadata = useMemo(async () => {
    if (!tokenURI) return null;
    const response = await fetch(tokenURI);
    return response.json();
  }, [tokenURI]);

  const currentAuction = {
    tokenId: auctionData?.tokenId.toString(),
    currentBid: parseFloat(formatEther(auctionData?.amount || 0n)),
    currentBidder: auctionData?.bidder,
    endTime: new Date(Number(auctionData?.endTime) * 1000),
    imageUrl: metadata?.image,
    // ... transform other fields
  };
}
```

### 11.3 Place Bid

```typescript
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

export function Auctions() {
  const { write: placeBid, data: txData } = useContractWrite({
    address: CONTRACTS.mainnet.auctionHouse,
    abi: auctionABI,
    functionName: 'createBid',
  });

  const { isLoading: isBidding } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success('Bid placed! 🎉');
    },
  });

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    const minBid = selectedAuction.currentBid + selectedAuction.minBidIncrement;

    if (amount < minBid) {
      toast.error(\`Minimum bid is \${formatETH(minBid)}\`);
      return;
    }

    placeBid({
      args: [selectedAuction.tokenId],
      value: parseEther(amount.toString()), // Send ETH with transaction
    });
  };
}
```

### 11.4 Listen for Bid Events

```typescript
import { useContractEvent } from 'wagmi';

export function Auctions() {
  // Listen for new bids in real-time
  useContractEvent({
    address: CONTRACTS.mainnet.auctionHouse,
    abi: auctionABI,
    eventName: 'AuctionBid',
    listener: (logs) => {
      const [tokenId, bidder, amount, extended] = logs[0].args;
      
      toast.info(\`New bid: \${formatEther(amount)} ETH! 💎\`, {
        description: \`From \${bidder.slice(0, 6)}...\${bidder.slice(-4)}\`,
      });

      // Refresh auction data
      refetchAuction();
    },
  });

  // Listen for auction settlements
  useContractEvent({
    address: CONTRACTS.mainnet.auctionHouse,
    abi: auctionABI,
    eventName: 'AuctionSettled',
    listener: (logs) => {
      toast.success('Auction settled! New auction starting... 🎊');
      refetchAuction();
    },
  });
}
```

### 11.5 Fetch Historical Bids

```typescript
import { usePublicClient } from 'wagmi';

export function Auctions() {
  const publicClient = usePublicClient();

  const fetchBidHistory = async (tokenId: bigint) => {
    const logs = await publicClient.getLogs({
      address: CONTRACTS.mainnet.auctionHouse,
      event: {
        type: 'event',
        name: 'AuctionBid',
        inputs: [
          { name: 'tokenId', type: 'uint256', indexed: true },
          { name: 'bidder', type: 'address', indexed: false },
          { name: 'amount', type: 'uint256', indexed: false },
          { name: 'extended', type: 'bool', indexed: false },
        ],
      },
      args: {
        tokenId: tokenId,
      },
      fromBlock: 'earliest',
    });

    return logs.map((log) => ({
      bidder: log.args.bidder,
      amount: formatEther(log.args.amount),
      timestamp: log.blockNumber, // You'll need to fetch block timestamp
      txHash: log.transactionHash,
    }));
  };
}
```

### 11.6 Multi-Chain Support (Base)

The app includes Base chain auctions (Based Fellas). Configure multi-chain:

```typescript
import { base } from 'wagmi/chains';

export const CONTRACTS = {
  mainnet: {
    // Ethereum contracts
  },
  base: {
    auctionHouse: '0x...' as \`0x\${string}\`,
    basedFellas: '0x...' as \`0x\${string}\`,
    // ... other Base contracts
  },
};

// In your component, switch based on selected chain
const { chain } = useAccount();
const auctionAddress = chain?.id === base.id 
  ? CONTRACTS.base.auctionHouse 
  : CONTRACTS.mainnet.auctionHouse;
```

### 11.7 Display Multiple Auctions

If you have multiple simultaneous auctions:

```typescript
// Fetch all active auctions (if your contract supports it)
const { data: auctionIds } = useContractRead({
  address: CONTRACTS.mainnet.auctionHouse,
  abi: auctionABI,
  functionName: 'getActiveAuctions', // Custom function
});

const { data: auctions } = useContractReads({
  contracts: auctionIds?.map((id) => ({
    address: CONTRACTS.mainnet.auctionHouse,
    abi: auctionABI,
    functionName: 'getAuction',
    args: [id],
  })),
});
```

### 11.8 Minimum Bid Calculation

```typescript
// Most Nouns-style auctions have a minimum bid increment (e.g., 5%)
const MIN_BID_INCREMENT_PERCENTAGE = 5; // 5%

const calculateMinBid = (currentBid: number): number => {
  return currentBid * (1 + MIN_BID_INCREMENT_PERCENTAGE / 100);
};

// Or fetch from contract
const { data: minBidIncrement } = useContractRead({
  address: CONTRACTS.mainnet.auctionHouse,
  abi: auctionABI,
  functionName: 'minBidIncrementPercentage',
});
```

### 11.9 Countdown Timer

The app shows time remaining. Update with real on-chain data:

```typescript
import { useState, useEffect } from 'react';

const useAuctionCountdown = (endTime: Date) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Ended');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(\`\${hours}h \${minutes}m \${seconds}s\`);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};
```

### Example: Based Fellas on Base

```typescript
// Based Fellas NFT Collection on Base
const BASED_FELLAS_CONTRACT = '0x...' as const;

export function BasedFellasAuction() {
  const { data: auction } = useContractRead({
    address: BASED_FELLAS_CONTRACT,
    abi: auctionABI,
    functionName: 'auction',
    chainId: base.id, // Base chain
  });

  return (
    <div>
      <h2>Based Fellas #{auction?.tokenId}</h2>
      <p>Current bid: {formatEther(auction?.amount || 0n)} ETH</p>
      <p>Bidder: {auction?.bidder}</p>
      {/* Bidding UI */}
    </div>
  );
}
```

---

Happy building! ⌐◨-◨