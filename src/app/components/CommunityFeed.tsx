import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hammer,
  Gavel,
  CheckCircle,
  FileText,
  Vote,
  Play,
  Pencil,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  mockCommunityEvents,
  EVENT_TYPE_CONFIG,
  type CommunityEventType,
  type CommunityEvent,
} from "../lib/mockData";

const EVENT_ICONS: Record<CommunityEventType, React.ElementType> = {
  auction_created: Hammer,
  auction_bid: Gavel,
  auction_settled: CheckCircle,
  proposal_created: FileText,
  proposal_vote: Vote,
  proposal_executed: Play,
  proposal_update: Pencil,
};

const ALL_TYPES: CommunityEventType[] = [
  "auction_created",
  "auction_bid",
  "auction_settled",
  "proposal_created",
  "proposal_vote",
  "proposal_executed",
  "proposal_update",
];

/* ── Chain icons ── */

function ChainIcon({ chain }: { chain: string }) {
  switch (chain) {
    case "Base":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <circle cx="12" cy="12" r="12" fill="#0052FF" />
          <path d="M12 19.5c4.14 0 7.5-3.36 7.5-7.5S16.14 4.5 12 4.5 4.5 7.86 4.5 12h7.5v7.5z" fill="white" />
        </svg>
      );
    case "Ethereum":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <circle cx="12" cy="12" r="12" fill="#627EEA" />
          <path d="M12 3.75v6.158l5.25 2.342L12 3.75z" fill="white" fillOpacity="0.6" />
          <path d="M12 3.75L6.75 12.25 12 9.908V3.75z" fill="white" />
          <path d="M12 16.408v4.092l5.25-7.25L12 16.408z" fill="white" fillOpacity="0.6" />
          <path d="M12 20.5v-4.092L6.75 13.25 12 20.5z" fill="white" />
          <path d="M12 15.408l5.25-3.158L12 9.908v5.5z" fill="white" fillOpacity="0.2" />
          <path d="M6.75 12.25L12 15.408V9.908L6.75 12.25z" fill="white" fillOpacity="0.6" />
        </svg>
      );
    case "OP Mainnet":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <circle cx="12" cy="12" r="12" fill="#FF0420" />
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">OP</text>
        </svg>
      );
    case "Zora":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <defs>
            <linearGradient id="zora-f" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#A1723A" />
              <stop offset="50%" stopColor="#531002" />
              <stop offset="100%" stopColor="#2B5DF0" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#zora-f)" />
          <circle cx="12" cy="12" r="5" fill="white" fillOpacity="0.9" />
        </svg>
      );
    default:
      return <div className="w-4 h-4 rounded-full bg-gray-400" />;
  }
}

/* ── DAO Icon ── */

function DaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none">
      <circle cx="12" cy="12" r="12" fill="#111" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">⌐◨</text>
    </svg>
  );
}

/* ── Time formatting ── */

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Action buttons per type ── */

function getActions(type: CommunityEventType): string[] {
  switch (type) {
    case "auction_created":
      return ["Start next Auction", "View Details"];
    case "auction_bid":
      return ["Place Bid", "View Details"];
    case "auction_settled":
      return ["Start next Auction", "View Details"];
    case "proposal_created":
      return ["Vote", "View Details"];
    case "proposal_vote":
      return ["View Details"];
    case "proposal_executed":
      return ["View Details"];
    case "proposal_update":
      return ["Respond", "View Details"];
    default:
      return ["View Details"];
  }
}

/* ── Event title builder ── */

function getEventTitle(event: CommunityEvent): string {
  switch (event.type) {
    case "auction_created":
      return `New auction for ${event.meta.collection} #${event.meta.tokenId}`;
    case "auction_bid":
      return `${event.actor} placed a bid on ${event.meta.collection} #${event.meta.tokenId}`;
    case "auction_settled":
      return `${event.meta.collection} #${event.meta.tokenId} auction settled`;
    case "proposal_created":
      return `${event.actor} submitted a new proposal`;
    case "proposal_vote":
      return `${event.actor} voted on Proposal #${event.meta.proposalId}`;
    case "proposal_executed":
      return `Proposal #${event.meta.proposalId} has been executed`;
    case "proposal_update":
      return `${event.actor} posted an update`;
    default:
      return event.title;
  }
}

function shouldShowImage(type: CommunityEventType): boolean {
  return type === "auction_created" || type === "auction_settled";
}

/* ── Avatar gradients ── */

const AVATAR_GRADIENTS = [
  "from-yellow-300 via-green-400 to-emerald-500",
  "from-pink-400 via-purple-400 to-blue-400",
  "from-amber-300 via-orange-400 to-red-400",
  "from-cyan-300 via-blue-400 to-indigo-500",
  "from-lime-300 via-emerald-400 to-teal-500",
  "from-rose-300 via-pink-400 to-fuchsia-500",
];

function getAvatarGradient(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/* ── EventCard ── */

const EventCard = forwardRef<HTMLDivElement, { event: CommunityEvent }>(
  function EventCard({ event }, ref) {
    const actions = getActions(event.type);
    const eventTitle = getEventTitle(event);
    const showImage = shouldShowImage(event.type);
    const avatarGradient = getAvatarGradient(event.actorAddress);

    const handleAction = (action: string) => {
      switch (action) {
        case "Place Bid":
          toast.success("Scrolled to auction", {
            description: `${event.meta.collection} #${event.meta.tokenId}`,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "Start next Auction":
          toast("Starting next auction...", { description: `${event.meta.collection}` });
          break;
        case "Vote":
          toast.success("Opening proposal...", { description: `Proposal #${event.meta.proposalId}` });
          break;
        case "Respond":
          toast("Opening response form...", { description: event.description });
          break;
        case "View Details":
          toast("Opening details...", { description: event.description });
          break;
      }
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
        className="bg-white rounded-2xl border border-gray-200/60 p-4 sm:p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarGradient} flex-shrink-0`} />
          <span className="text-xs text-gray-600 truncate max-w-[140px]">{event.actor}</span>
          <span className="text-gray-300 text-xs">&#x2022;</span>
          <DaoIcon />
          <span className="text-xs text-gray-600 truncate">{event.daoName}</span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 mb-0.5 leading-snug">{eventTitle}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{event.description}</p>

        {/* Content block */}
        {event.contentBlock && !showImage && (
          <div className="bg-gray-100 rounded-xl px-3.5 py-2.5 mb-3">
            <p className="text-xs text-gray-700 leading-relaxed">{event.contentBlock}</p>
          </div>
        )}

        {/* NFT Image */}
        {showImage && event.imageUrl && (
          <div className="mb-3">
            <div className="w-36 aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={event.imageUrl}
                alt={`${event.meta.collection} #${event.meta.tokenId}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {actions.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-900"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <ChainIcon chain={event.chain} />
            <span className="text-gray-300 text-xs">&#x2022;</span>
            <span className="text-xs text-gray-400">{timeAgo(event.timestamp)}</span>
          </div>
        </div>
      </motion.div>
    );
  });
EventCard.displayName = "EventCard";

/* ── Filter Overlay (matches reference right-side UI) ── */

const FilterOverlay = forwardRef<HTMLDivElement, {
  activeFilters: Set<CommunityEventType>;
  onApply: (filters: Set<CommunityEventType>) => void;
  onClose: () => void;
}>(function FilterOverlay({ activeFilters, onApply, onClose }, ref) {
  const [pending, setPending] = useState<Set<CommunityEventType>>(new Set(activeFilters));

  const isAllSelected = pending.size === 0;

  const toggleType = (type: CommunityEventType) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const selectAll = () => setPending(new Set());

  const getLabel = (f: CommunityEventType) => EVENT_TYPE_CONFIG[f].label;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center px-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative flex flex-col items-center gap-4"
      >
        {/* Close button (X) — top center */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </motion.button>

        {/* Pills column */}
        <div className="flex flex-col gap-2.5 items-center">
          {/* All pill */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={selectAll}
            className={`px-7 py-2.5 rounded-full text-sm font-medium transition-all min-w-[160px] ${isAllSelected
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-white/90 text-gray-900 hover:bg-white"
              }`}
          >
            All
          </motion.button>

          {/* Type pills */}
          {ALL_TYPES.map((type, idx) => {
            const isActive = pending.has(type);
            return (
              <motion.button
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 1) * 0.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleType(type)}
                className={`px-7 py-2.5 rounded-full text-sm font-medium transition-all min-w-[160px] ${isActive
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/90 text-gray-900 hover:bg-white"
                  }`}
              >
                {getLabel(type)}
              </motion.button>
            );
          })}
        </div>

        {/* Confirm button (✓) — bottom center */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onApply(pending)}
          className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
        >
          <Check className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
});
FilterOverlay.displayName = "FilterOverlay";

/* ── CommunityFeed ── */

export function CommunityFeed() {
  const [activeFilters, setActiveFilters] = useState<Set<CommunityEventType>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered =
    activeFilters.size === 0
      ? mockCommunityEvents
      : mockCommunityEvents.filter((e) => activeFilters.has(e.type));

  const sorted = [...filtered].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
          <Sparkles className="h-4 w-4" />
          Activity
        </h2>

        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-full border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {activeFilters.size === 0
            ? "Filter"
            : `${activeFilters.size} active`}
          {activeFilters.size > 0 && (
            <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {activeFilters.size}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chip */}
      <AnimatePresence>
        {activeFilters.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {Array.from(activeFilters).map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs"
                >
                  {EVENT_TYPE_CONFIG[type].label}
                  <button
                    onClick={() => {
                      const next = new Set(activeFilters);
                      next.delete(type);
                      setActiveFilters(next);
                    }}
                    className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setActiveFilters(new Set())}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event cards */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No events of this type yet.
        </div>
      )}

      {/* Filter overlay */}
      <AnimatePresence>
        {filterOpen && (
          <FilterOverlay
            activeFilters={activeFilters}
            onApply={(filters) => {
              setActiveFilters(filters);
              setFilterOpen(false);
            }}
            onClose={() => setFilterOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}