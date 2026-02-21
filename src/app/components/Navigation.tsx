import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, ExternalLink, Copy, LogOut, Wallet } from "lucide-react";
import { useAccount, useDisconnect, useEnsName, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { toast } from "sonner";

const PROFILE_AVATAR =
  "https://images.unsplash.com/photo-1751093383900-dbf2a79169f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxNjIzNzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

type NetworkId = "base" | "ethereum" | "op-mainnet" | "zora";

interface Network {
  id: NetworkId;
  name: string;
  color: string;
  icon: React.ReactNode;
}

const NETWORKS: Network[] = [
  {
    id: "base",
    name: "Base",
    color: "#0052FF",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="12" fill="#0052FF" />
        <path
          d="M12 19.5c4.14 0 7.5-3.36 7.5-7.5S16.14 4.5 12 4.5 4.5 7.86 4.5 12h7.5v7.5z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    color: "#627EEA",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="12" fill="#627EEA" />
        <path
          d="M12 3.75v6.158l5.25 2.342L12 3.75z"
          fill="white"
          fillOpacity="0.6"
        />
        <path d="M12 3.75L6.75 12.25 12 9.908V3.75z" fill="white" />
        <path
          d="M12 16.408v4.092l5.25-7.25L12 16.408z"
          fill="white"
          fillOpacity="0.6"
        />
        <path d="M12 20.5v-4.092L6.75 13.25 12 20.5z" fill="white" />
        <path
          d="M12 15.408l5.25-3.158L12 9.908v5.5z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M6.75 12.25L12 15.408V9.908L6.75 12.25z"
          fill="white"
          fillOpacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: "op-mainnet",
    name: "OP Mainnet",
    color: "#FF0420",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="12" fill="#FF0420" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          OP
        </text>
      </svg>
    ),
  },
  {
    id: "zora",
    name: "Zora",
    color: "#2B5DF0",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="zora-grad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#A1723A" />
            <stop offset="50%" stopColor="#531002" />
            <stop offset="100%" stopColor="#2B5DF0" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#zora-grad)" />
        <circle cx="12" cy="12" r="5" fill="white" fillOpacity="0.9" />
      </svg>
    ),
  },
];

export function Navigation() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>("base");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  // Wallet state from wagmi
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });

  const activeNetwork = NETWORKS.find((n) => n.id === selectedNetwork)!;

  const displayName = ensName ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "");
  const displayBalance = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        networkRef.current &&
        !networkRef.current.contains(e.target as Node)
      ) {
        setNetworkOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyAddress = () => {
    const addr = address ?? "0x1a2B...9cD4";
    try {
      const textArea = document.createElement("textarea");
      textArea.value = addr;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Address copied!");
    } catch {
      toast.error("Could not copy address");
    }
    setProfileOpen(false);
  };

  const explorerUrl = address
    ? `https://${selectedNetwork === "ethereum"
      ? "etherscan.io"
      : selectedNetwork === "base"
        ? "basescan.org"
        : selectedNetwork === "op-mainnet"
          ? "optimistic.etherscan.io"
          : "explorer.zora.energy"
    }/address/${address}`
    : "https://etherscan.io";

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-0 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">&#x2310;&#x25E8;-&#x25E8;</span>
          </div>
        </Link>

        {/* Right: Network Switcher + Wallet/Profile */}
        <div className="flex items-center gap-2">
          {/* Network Switcher */}
          <div className="relative" ref={networkRef}>
            <button
              onClick={() => {
                setNetworkOpen(!networkOpen);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1.5 h-9 px-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="w-5 h-5 flex-shrink-0">
                {activeNetwork.icon}
              </span>
              <span className="text-sm hidden sm:block">
                {activeNetwork.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-gray-400 transition-transform",
                  networkOpen && "rotate-180"
                )}
              />
            </button>

            {networkOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5">
                  <p className="px-3 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                    Switch Network
                  </p>
                  {NETWORKS.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => {
                        setSelectedNetwork(network.id);
                        setNetworkOpen(false);
                        toast.success(`Switched to ${network.name}`);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-left",
                        network.id === selectedNetwork
                          ? "bg-gray-100 font-bold"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <span className="w-5 h-5 flex-shrink-0">
                        {network.icon}
                      </span>
                      <span className="flex-1">{network.name}</span>
                      {network.id === selectedNetwork && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wallet: RainbowKit ConnectButton or Profile dropdown */}
          {!isConnected ? (
            /* Custom-styled RainbowKit connect button */
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => {
                const ready = mounted;
                return (
                  <button
                    onClick={openConnectModal}
                    disabled={!ready}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:block">Connect</span>
                  </button>
                );
              }}
            </ConnectButton.Custom>
          ) : (
            /* Connected: show profile dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNetworkOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                {/* Gradient avatar based on address */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 ring-2 ring-gray-200 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">
                    {address?.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-gray-500 transition-transform hidden sm:block",
                    profileOpen && "rotate-180"
                  )}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 ring-2 ring-white shadow-sm flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {address?.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {address
                            ? `${address.slice(0, 6)}...${address.slice(-4)}`
                            : ""}
                        </p>
                        {displayBalance && (
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">
                            {displayBalance}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* On-chain stats */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold">-</p>
                      <p className="text-[10px] text-muted-foreground">
                        Tokens
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">-</p>
                      <p className="text-[10px] text-muted-foreground">
                        Votes
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">-</p>
                      <p className="text-[10px] text-muted-foreground">
                        Props
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={copyAddress}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-left"
                    >
                      <Copy className="h-4 w-4 text-gray-400" />
                      Copy address
                    </button>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => setProfileOpen(false)}
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      View on Explorer
                    </a>
                    <button
                      onClick={() => {
                        disconnect();
                        toast("Disconnected!");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-red-600 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
