import { useState } from "react";
import { motion } from "motion/react";
import { Users, TrendingUp, Award, CheckCircle, Search } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { mockDelegates, Delegate } from "../lib/mockData";

export function Delegates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null);

  const filteredDelegates = mockDelegates.filter(
    (delegate) =>
      delegate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegate.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelegate = (address: string, name: string) => {
    setSelectedDelegate(address);
    
    // TODO: Replace with actual smart contract call
    // Example: await tokenContract.delegate(delegateAddress)
    
    toast.success(`Delegated to ${name}! 🎉`, {
      description: "Your voting power is now delegated to this address.",
    });
  };

  const getVoteIcon = (vote: "for" | "against" | "abstain") => {
    switch (vote) {
      case "for":
        return "✅";
      case "against":
        return "❌";
      case "abstain":
        return "⊝";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Find Your Delegate</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Delegate your voting power to experienced community members who share your values
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">What is delegation?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Delegation lets you assign your voting power to someone you trust, while keeping ownership of your tokens. 
                Your delegate will vote on your behalf, and you can change delegates anytime!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Keep Your Tokens</p>
                    <p className="text-xs text-muted-foreground">You maintain full ownership</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Amplify Your Voice</p>
                    <p className="text-xs text-muted-foreground">Empower trusted voters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Change Anytime</p>
                    <p className="text-xs text-muted-foreground">Switch delegates freely</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search delegates by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>
        </div>

        {/* Delegates List */}
        <div className="space-y-4">
          {filteredDelegates.map((delegate, index) => (
            <motion.div
              key={delegate.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Avatar & Basic Info */}
                    <div className="flex items-start gap-4 md:w-1/3">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                        <AvatarImage src={delegate.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-xl">
                          {delegate.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{delegate.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{delegate.address}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {delegate.votingPower} votes
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {delegate.delegators} delegators
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Bio & Stats */}
                    <div className="md:w-1/2 space-y-3">
                      <p className="text-sm">{delegate.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Participation Rate</p>
                          <div className="flex items-center gap-2">
                            <Progress value={delegate.participation} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{delegate.participation}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Proposals Voted</p>
                          <p className="text-sm font-bold">{delegate.proposalsVoted}</p>
                        </div>
                      </div>

                      {/* Recent Votes */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Recent Votes</p>
                        <div className="flex gap-1">
                          {delegate.recentVotes.map((vote, idx) => (
                            <div
                              key={idx}
                              className="text-lg"
                              title={`Proposal #${vote.proposalId}: ${vote.vote}`}
                            >
                              {getVoteIcon(vote.vote)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Action */}
                    <div className="md:w-1/6 flex items-center justify-center">
                      <Button
                        onClick={() => handleDelegate(delegate.address, delegate.name)}
                        disabled={selectedDelegate === delegate.address}
                        className={
                          selectedDelegate === delegate.address
                            ? "w-full md:w-auto"
                            : "w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        }
                      >
                        {selectedDelegate === delegate.address ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Delegated
                          </>
                        ) : (
                          "Delegate"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDelegates.length === 0 && (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg text-muted-foreground">No delegates found</p>
              <p className="text-sm text-muted-foreground mt-2">Try a different search query</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
