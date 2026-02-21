import { Link } from "react-router";
import { motion } from "motion/react";
import { Clock, TrendingUp, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Proposal, getStatusColor, getTimeRemaining, formatVotes } from "../lib/mockData";
import { cn } from "./ui/utils";

interface ProposalCardProps {
  proposal: Proposal;
  index?: number;
}

export function ProposalCard({ proposal, index = 0 }: ProposalCardProps) {
  const forPercentage = proposal.totalVotes > 0 
    ? (proposal.votesFor / proposal.totalVotes) * 100 
    : 0;
  
  const againstPercentage = proposal.totalVotes > 0
    ? (proposal.votesAgainst / proposal.totalVotes) * 100
    : 0;

  const quorumProgress = (proposal.totalVotes / proposal.quorum) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/proposal/${proposal.id}`}>
        <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2">
          <CardContent className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={cn(getStatusColor(proposal.status), "text-white capitalize")}>
                    {proposal.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {proposal.category}
                  </Badge>
                  {proposal.status === "active" && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(proposal.endTime)}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{proposal.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {proposal.description}
                </p>
              </div>
            </div>

            {/* Vote Progress */}
            {proposal.totalVotes > 0 && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">{formatVotes(proposal.votesFor)} For</span>
                    <span className="text-muted-foreground">({forPercentage.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{formatVotes(proposal.votesAgainst)} Against</span>
                    <span className="text-muted-foreground">({againstPercentage.toFixed(0)}%)</span>
                  </div>
                </div>

                {/* Visual vote bar */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                    style={{ width: `${forPercentage}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-500 transition-all"
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>

                {/* Quorum Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Quorum Progress</span>
                    <span>{proposal.totalVotes} / {proposal.quorum} votes</span>
                  </div>
                  <Progress value={Math.min(quorumProgress, 100)} className="h-2" />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>by {proposal.proposer}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>Discuss</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}