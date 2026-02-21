import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, CheckCircle, XCircle, MinusCircle, Loader2 } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { getProposalById, getCommentsByProposalId, getStatusColor, getTimeRemaining, formatVotes } from "../lib/mockData";
import { cn } from "../components/ui/utils";

export function ProposalDetail() {
  const { id } = useParams();
  const proposal = getProposalById(id || "");
  const comments = getCommentsByProposalId(id || "");
  
  const [newComment, setNewComment] = useState("");
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <p className="text-center text-muted-foreground">Proposal not found</p>
        </div>
      </div>
    );
  }

  const forPercentage = proposal.totalVotes > 0 
    ? (proposal.votesFor / proposal.totalVotes) * 100 
    : 0;
  
  const againstPercentage = proposal.totalVotes > 0
    ? (proposal.votesAgainst / proposal.totalVotes) * 100
    : 0;

  const abstainPercentage = proposal.totalVotes > 0
    ? (proposal.votesAbstain / proposal.totalVotes) * 100
    : 0;

  const quorumProgress = (proposal.totalVotes / proposal.quorum) * 100;

  const handleVote = async (vote: "for" | "against" | "abstain") => {
    setVoting(true);
    
    // TODO: Replace with actual smart contract call
    // Example: await governorContract.castVote(proposalId, voteType)
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setVoting(false);
    setHasVoted(true);
    
    const voteLabels = {
      for: "For ✅",
      against: "Against ❌",
      abstain: "Abstain ⊝",
    };
    
    toast.success(`Vote cast: ${voteLabels[vote]}`, {
      description: "Your vote has been recorded on-chain!",
    });
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    // TODO: Add comment to proposal (could be IPFS + contract or separate DB)
    toast.success("Comment added!", {
      description: "Your comment is now visible to everyone.",
    });
    setNewComment("");
  };

  const handleReaction = (commentId: string, emoji: string) => {
    toast.success(`Reacted with ${emoji}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", {
      description: "Share this proposal with your community",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Proposals
          </Button>
        </Link>

        {/* Proposal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 border-2">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={cn(getStatusColor(proposal.status), "text-white capitalize")}>
                  {proposal.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {proposal.category}
                </Badge>
                {proposal.status === "active" && (
                  <Badge variant="secondary">
                    {getTimeRemaining(proposal.endTime)}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl">{proposal.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Proposed by <span className="font-medium">{proposal.proposer}</span>
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{proposal.description}</p>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voting Section */}
          {proposal.status === "active" && (
            <Card className="mb-6 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-emerald-600" />
                  Cast Your Vote
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasVoted ? (
                  <div className="bg-white rounded-lg p-6 text-center border-2 border-emerald-300">
                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-lg mb-1">Vote Recorded!</p>
                    <p className="text-sm text-muted-foreground">Thanks for participating in governance ✨</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      size="lg"
                      className="h-auto py-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                      onClick={() => handleVote("for")}
                      disabled={voting}
                    >
                      {voting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="h-6 w-6" />
                          <span>Vote For</span>
                        </div>
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="h-auto py-6 border-2"
                      onClick={() => handleVote("abstain")}
                      disabled={voting}
                    >
                      {voting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <MinusCircle className="h-6 w-6" />
                          <span>Abstain</span>
                        </div>
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="destructive"
                      className="h-auto py-6"
                      onClick={() => handleVote("against")}
                      disabled={voting}
                    >
                      {voting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <XCircle className="h-6 w-6" />
                          <span>Vote Against</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <Card className="mb-6 border-2">
            <CardHeader>
              <CardTitle>Current Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* For */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="font-medium">For</span>
                    </div>
                    <span className="text-sm">
                      {formatVotes(proposal.votesFor)} ({forPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={forPercentage} className="h-3 bg-gray-100" />
                </div>

                {/* Against */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Against</span>
                    </div>
                    <span className="text-sm">
                      {formatVotes(proposal.votesAgainst)} ({againstPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={againstPercentage} className="h-3 bg-gray-100" />
                </div>

                {/* Abstain */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MinusCircle className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Abstain</span>
                    </div>
                    <span className="text-sm">
                      {formatVotes(proposal.votesAbstain)} ({abstainPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={abstainPercentage} className="h-3 bg-gray-100" />
                </div>

                <Separator />

                {/* Quorum */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Quorum Progress</span>
                    <span className="text-sm">
                      {proposal.totalVotes} / {proposal.quorum} votes
                    </span>
                  </div>
                  <Progress value={Math.min(quorumProgress, 100)} className="h-3" />
                  {quorumProgress >= 100 && (
                    <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Quorum reached!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Discussion ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts on this proposal..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <Button onClick={handleComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white">
                          {comment.author[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex gap-2">
                          {comment.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => handleReaction(comment.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}