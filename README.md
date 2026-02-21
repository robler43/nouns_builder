# Nouns Governance - Reimagined ⌐◨-◨

A modern, playful redesign of Nouns Builder that makes DAO governance fun, accessible, and engaging for everyone.

- **Live-Demo:** https://www.loom.com/share/af2379fa9ef642ce9ce1d29f0a5dcfab
- **Slideshow:** https://docs.google.com/presentation/d/1sdE5bFve38uYc8mzX74zyfJuJSdHNY5BhuUm5FvaLXc/edit?usp=sharing
- **Deployed Public URL:** https://nounsbuilder.vercel.app/

## 🎯 Overview

This project reimagines the Nouns Builder governance experience with a focus on:

- **Accessibility**: Mobile-first design that makes governance easy on any device
- **Engagement**: Social features like comments, reactions, and delegate profiles
- **Clarity**: Visual status indicators, progress bars, and clear explanations
- **Fun**: Playful pixel-art aesthetic inspired by Nouns culture
- **Efficiency**: Guided proposal creation with templates and smart workflows

## ✨ Key Features

### 📊 Dashboard
- **Live proposal status** with visual indicators (Active, Pending, Passed, etc.)
- **Smart filters** by status and category (Grants, Governance, Treasury, Community)
- **At-a-glance stats** showing active proposals, passed proposals, and total votes
- **Beautiful cards** with vote breakdowns and quorum progress

### 🎨 NFT Auctions (NEW!)
- **Browse pixel art NFTs** including Based Fellas, Nouns Builder, and more
- **Live bidding** with real-time updates and countdowns
- **Multi-chain support** (Ethereum and Base)
- **Bid history** showing all previous bids with timestamps
- **Interactive auction cards** with smooth animations
- **Mobile-optimized** bidding interface

### 🗳️ Voting & Proposals
- **Interactive voting** with clear For/Against/Abstain options
- **Real-time results** with visual progress bars
- **Social discussion** with comments and reactions
- **Transaction status** showing loading → success → error states
- **Share proposals** easily with your community

### 🧙‍♂️ Guided Proposal Creation
- **Step-by-step wizard** that makes proposal creation simple
- **Smart templates** for different proposal types:
  - Grants (with budget and milestones)
  - Governance changes (with before/after comparisons)
  - Treasury management (with strategy details)
  - Community initiatives (with goals and timeline)
- **Live preview** before submitting
- **Field validation** to ensure quality proposals

### 👥 Delegate Discovery
- **Browse delegates** with detailed profiles
- **See voting history** and participation rates
- **Filter by expertise** and values alignment
- **One-click delegation** with instant feedback
- **Change delegates** anytime

### 📱 User Profile
- **Track your activity** - votes cast, proposals created
- **Participation stats** with visual progress
- **Recent activity feed** showing your governance journey
- **Delegation status** at a glance

### 🎓 Onboarding Flow
- **Interactive tutorial** explaining how governance works
- **Step-by-step guide** covering:
  - How voting works (Pending → Active → Passed → Executed)
  - What delegation means and why it's powerful
  - How to create your own proposals
  - Best practices for participation
- **Skip option** for experienced users

## 🎨 Design Philosophy

### Playful & Approachable
- Bright, cheerful color gradients (pink, purple, indigo, emerald)
- Smooth animations and transitions using Motion (Framer Motion)
- Fun emojis and pixel art aesthetic
- Clear visual hierarchy

### Mobile-First
- Bottom navigation on mobile, top navigation on desktop
- Responsive grids and cards
- Touch-friendly buttons and interactions
- Optimized for phones, tablets, and desktop

### Clear Status Everywhere
- Color-coded proposal statuses
- Progress bars for votes and quorum
- Loading states for transactions
- Success/error feedback with toast notifications

## 🛠️ Tech Stack

- **React** - Component-based UI
- **React Router** - Client-side routing with Data mode
- **Tailwind CSS** - Utility-first styling
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **Radix UI** - Accessible component primitives

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Connecting to Smart Contracts

This project currently uses **mock data** for demonstration. To connect to real Nouns Builder smart contracts:

1. **Install Web3 dependencies**:
   ```bash
   npm install viem wagmi @rainbow-me/rainbowkit
   ```

2. **Replace mock data calls** with smart contract reads:
   - Look for `// TODO: Replace with real smart contract call` comments
   - Use `viem` or `ethers.js` to interact with contracts
   - Example contracts to connect:
     - **Governor Contract**: For proposals, voting, delegation
     - **Token Contract**: For voting power, balances
     - **Treasury Contract**: For fund management

3. **Example contract integration**:
   ```typescript
   // Instead of:
   const proposals = mockProposals;
   
   // Use:
   import { useContractRead } from 'wagmi';
   
   const { data: proposals } = useContractRead({
     address: '0xYourGovernorContract',
     abi: governorABI,
     functionName: 'getProposals',
   });
   ```

4. **Add wallet connection**:
   - Wrap app with `WagmiConfig` and `RainbowKitProvider`
   - Add "Connect Wallet" button to navigation
   - Gate voting/proposal creation behind wallet connection

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Navigation.tsx         # Mobile/desktop nav bar
│   │   ├── ProposalCard.tsx       # Reusable proposal card
│   │   └── ui/                    # Shadcn UI components
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main proposals list
│   │   ├── Auctions.tsx           # NFT auction bidding (NEW!)
│   │   ├── ProposalDetail.tsx     # Vote & discuss proposals
│   │   ├── CreateProposal.tsx     # Guided proposal wizard
│   │   ├── Delegates.tsx          # Browse & select delegates
│   │   ├── Profile.tsx            # User stats & activity
│   │   └── Onboarding.tsx         # First-time user tutorial
│   ├── lib/
│   │   └── mockData.ts            # Mock proposals, delegates, auctions
│   ├── routes.tsx                 # React Router configuration
│   └── App.tsx                    # Root component
└── styles/
    ├── theme.css                  # Custom CSS variables
    └── tailwind.css               # Tailwind imports
```

## 🎯 Innovation Highlights

### 1. **Guided Wizard UX**
Instead of overwhelming users with a blank form, we provide:
- Template selection with icons and descriptions
- Step-by-step progress indicator
- Dynamic fields based on proposal type
- Preview before submitting

### 2. **Social Governance**
Make governance feel alive with:
- Comments and discussions on every proposal
- Emoji reactions to express sentiment
- Delegate profiles with voting history
- Activity feeds showing what's happening

### 3. **Transparency by Default**
Every proposal shows:
- Real-time vote counts and percentages
- Quorum progress visualization
- Time remaining on voting period
- Clear status at every stage

### 4. **Accessibility Focus**
- Onboarding flow for newcomers
- Plain language explanations ("Quorum = minimum votes needed")
- Mobile-optimized for voting on the go
- Color-coded visual indicators

## 🔧 Smart Contract Integration TODO

To make this production-ready, connect these features:

- [ ] **Wallet Connection**: RainbowKit or similar
- [ ] **Read Proposals**: From Governor contract
- [ ] **Cast Votes**: Call `castVote()` on Governor
- [ ] **Delegate Votes**: Call `delegate()` on Token contract
- [ ] **Create Proposals**: Call `propose()` with transactions
- [ ] **Fetch Comments**: IPFS or Ceramic for decentralized storage
- [ ] **Real-time Updates**: WebSockets or polling for live data

## 📸 Features Demo

### Dashboard
- Colorful stats cards showing active/passed proposals and total votes
- Filterable proposal list with status and category tags
- Animated card reveals on scroll

### NFT Auctions (NEW!)
- Live auction cards with pixel art NFTs (Based Fellas #606, Nouns Builder, etc.)
- Real-time countdown timers showing time remaining
- Bid input with minimum increment validation
- Bid history with wallet addresses and timestamps
- Chain badges (Ethereum, Base) for multi-chain support
- Smooth card selection animations

### Proposal Detail
- Large vote buttons (For/Against/Abstain) with loading states
- Visual vote breakdown with progress bars
- Comments section with reactions
- Share functionality

### Create Proposal
- Beautiful template cards with icons
- Multi-step wizard with progress bar
- Live character count and validation
- Final review screen

### Delegates
- Searchable delegate cards
- Participation rate visualization
- Recent vote history with emoji indicators
- One-click delegation

### Profile
- Personal voting stats and participation rate
- Recent activity timeline
- Current delegation status
- Link to Etherscan/block explorer

### Onboarding
- 5-step interactive tutorial
- Animated icons and smooth transitions
- Practical tips for each governance feature
- Skip option for power users

## 🌟 What Makes This Special

1. **Lowers the barrier** - Anyone can understand and participate
2. **Increases engagement** - Fun design encourages exploration
3. **Builds community** - Social features foster discussion
4. **Maintains transparency** - Every detail is visible and clear
5. **Open source** - Easy to fork, customize, and improve

## 📋 License

MIT License - Feel free to fork and customize!

## 🥯 Bagel

We're bringing the bagel to the presentation (metaphorically) - this project has personality, heart, and a commitment to making governance accessible and fun for everyone. ⌐◨-◨

---

**Built for the Nouns community with ❤️**

*Making governance fun, one pixel at a time.*
