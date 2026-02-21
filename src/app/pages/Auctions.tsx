import { useState } from "react";
import { motion } from "motion/react";
import { Hammer, Clock, TrendingUp, Sparkles, ExternalLink } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { mockAuctions, formatETH, getTimeRemaining } from "../lib/mockData";

export function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState(mockAuctions[0]);
  const [bidAmount, setBidAmount] = useState("");

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    const minBid = selectedAuction.currentBid + selectedAuction.minBidIncrement;

    if (isNaN(amount) || amount < minBid) {
      toast.error("Bid too low!", {
        description: `Minimum bid is ${formatETH(minBid)}`,
      });
      return;
    }

    // TODO: Replace with actual smart contract call
    // Example: await auctionContract.placeBid(tokenId, { value: ethers.utils.parseEther(amount) })

    toast.success("Bid placed! 🎉", {
      description: `You bid ${formatETH(amount)} on ${selectedAuction.collectionName} #${selectedAuction.tokenId}`,
    });

    setBidAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            NFT Auctions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bid on pixel art NFTs and expand your collection. ⌐◨-◨
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-pink-200">
            <div className="flex items-center gap-2 mb-2">
              <Hammer className="h-5 w-5 text-pink-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-pink-600">{mockAuctions.length}</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Volume</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-purple-600">
              {formatETH(mockAuctions.reduce((sum, a) => sum + a.currentBid, 0))}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Collections</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-indigo-600">
              {new Set(mockAuctions.map((a) => a.collection)).size}
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auction List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold mb-4">Live Auctions</h2>
            {mockAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedAuction.id === auction.id
                      ? "ring-2 ring-purple-500 border-purple-300"
                      : ""
                  }`}
                  onClick={() => setSelectedAuction(auction)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={auction.imageUrl}
                        alt={`${auction.collectionName} #${auction.tokenId}`}
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-bold text-sm">{auction.collectionName}</p>
                            <p className="text-xs text-muted-foreground">#{auction.tokenId}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {auction.chain}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Current Bid</p>
                          <p className="font-bold text-sm">{formatETH(auction.currentBid)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Featured Auction */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedAuction.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2"
            >
              {/* NFT Image */}
              <div className="relative aspect-square md:aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={selectedAuction.imageUrl}
                  alt={`${selectedAuction.collectionName} #${selectedAuction.tokenId}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/70 text-white backdrop-blur">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeRemaining(selectedAuction.endTime)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur">
                    {selectedAuction.chain}
                  </Badge>
                </div>
              </div>

              {/* Auction Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                      {selectedAuction.collectionName} #{selectedAuction.tokenId}
                    </h2>
                    <p className="text-muted-foreground">Collection: {selectedAuction.collectionName}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>

                {/* Current Bid */}
                <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatETH(selectedAuction.currentBid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Leading Bidder</p>
                        <p className="font-bold text-sm">{selectedAuction.currentBidderName}</p>
                        <p className="text-xs text-muted-foreground">{selectedAuction.timeAgo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Bid */}
                <div className="mb-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Hammer className="h-5 w-5 text-purple-500" />
                    Place Your Bid
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder={`Min: ${formatETH(
                          selectedAuction.currentBid + selectedAuction.minBidIncrement
                        )}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum increment: {formatETH(selectedAuction.minBidIncrement)}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={handlePlaceBid}
                    >
                      <Hammer className="h-5 w-5 mr-2" />
                      Bid
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Bid History */}
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Bid History ({selectedAuction.bids.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedAuction.bids.map((bid, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                              Leading
                            </Badge>
                          )}
                          <div>
                            <p className="font-bold text-sm">{bid.bidderName}</p>
                            <p className="text-xs text-muted-foreground">
                              {bid.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatETH(bid.amount)}</p>
                          {bid.txHash && (
                            <a
                              href={`https://basescan.org/tx/${bid.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              View tx <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
