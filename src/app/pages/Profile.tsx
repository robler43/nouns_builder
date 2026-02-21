import { motion } from "motion/react";
import { User, Award, TrendingUp, Calendar, CheckCircle, XCircle, MinusCircle, ExternalLink } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";

export function Profile() {
  // Mock user data - TODO: Replace with real wallet connection
  const userData = {
    address: "0xYourAddress...1234",
    ensName: "your_name.eth",
    votingPower: 12,
    proposalsVoted: 8,
    proposalsCreated: 2,
    delegating: "governance_guru.eth",
    participationRate: 67,
  };

  const recentActivity = [
    { id: "1", type: "vote", proposal: "Fund Community Art Gallery", vote: "for", date: "2026-02-19" },
    { id: "2", type: "vote", proposal: "Update Voting Period to 5 Days", vote: "abstain", date: "2026-02-18" },
    { id: "4", type: "delegate", proposal: "Delegated to governance_guru.eth", date: "2026-02-15" },
    { id: "5", type: "vote", proposal: "Treasury Diversification Strategy", vote: "for", date: "2026-02-12" },
  ];

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case "for":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "against":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "abstain":
        return <MinusCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white text-3xl">
                    ⌐◨-◨
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{userData.ensName}</h1>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2 justify-center md:justify-start">
                    <span>{userData.address}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      {userData.votingPower} Voting Power
                    </Badge>
                    <Badge variant="secondary">
                      {userData.proposalsVoted} Votes Cast
                    </Badge>
                    <Badge variant="outline">
                      {userData.proposalsCreated} Proposals Created
                    </Badge>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Participation Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{userData.participationRate}%</span>
                    <Badge variant={userData.participationRate >= 70 ? "default" : "secondary"}>
                      {userData.participationRate >= 70 ? "Active" : "Moderate"}
                    </Badge>
                  </div>
                  <Progress value={userData.participationRate} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    You've voted on {userData.proposalsVoted} out of 12 recent proposals
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Current Delegation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-400 text-white">
                      G
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{userData.delegating}</p>
                    <p className="text-xs text-muted-foreground">Your delegate</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Change Delegate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        {getVoteIcon(activity.vote || activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium text-sm">{activity.proposal}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                        {activity.type === "vote" && (
                          <Badge variant="outline" className="text-xs capitalize">
                            Voted {activity.vote}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {idx < recentActivity.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
