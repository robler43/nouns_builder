import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, DollarSign, Settings, Users, FileText } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

type ProposalCategory = "grant" | "governance" | "treasury" | "community";

interface ProposalTemplate {
  category: ProposalCategory;
  title: string;
  description: string;
  icon: any;
  color: string;
  fields: string[];
}

const templates: ProposalTemplate[] = [
  {
    category: "grant",
    title: "Grant Proposal",
    description: "Request funding for a project or initiative",
    icon: DollarSign,
    color: "from-emerald-500 to-green-500",
    fields: ["title", "description", "amount", "milestones", "timeline"],
  },
  {
    category: "governance",
    title: "Governance Change",
    description: "Propose changes to DAO parameters or rules",
    icon: Settings,
    color: "from-blue-500 to-indigo-500",
    fields: ["title", "description", "currentValue", "proposedValue", "rationale"],
  },
  {
    category: "treasury",
    title: "Treasury Management",
    description: "Manage DAO treasury assets and allocations",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    fields: ["title", "description", "action", "assets", "strategy"],
  },
  {
    category: "community",
    title: "Community Initiative",
    description: "Launch community events, programs, or activities",
    icon: Users,
    color: "from-orange-500 to-red-500",
    fields: ["title", "description", "goals", "participants", "timeline"],
  },
];

export function CreateProposal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    category: "" as ProposalCategory,
    customField1: "",
    customField2: "",
    customField3: "",
  });

  const handleTemplateSelect = (template: ProposalTemplate) => {
    setSelectedTemplate(template);
    setProposalData({ ...proposalData, category: template.category });
    setStep(1);
  };

  const handleSubmit = async () => {
    // TODO: Replace with actual smart contract call
    // Example: await governorContract.propose(targets, values, calldatas, description)
    
    toast.success("Proposal Created! 🎉", {
      description: "Your proposal is now live and ready for votes.",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const canProceed = () => {
    if (step === 1) {
      return proposalData.title.length > 0 && proposalData.description.length > 50;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step > 0 ? "Previous Step" : "Cancel"}
        </Button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {["Choose Template", "Write Proposal", "Review & Submit"].map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    idx <= step
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {idx < step ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                </div>
                <span className={cn("text-sm font-medium hidden md:inline", idx <= step ? "text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Choose Template */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Choose a Template</CardTitle>
                  <CardDescription>Select the type of proposal you want to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <motion.button
                          key={template.category}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTemplateSelect(template)}
                          className="text-left"
                        >
                          <Card className="h-full border-2 hover:border-purple-300 transition-all cursor-pointer">
                            <CardContent className="p-6">
                              <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-r mb-4 flex items-center justify-center", template.color)}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                              <p className="text-sm text-muted-foreground">{template.description}</p>
                            </CardContent>
                          </Card>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Write Proposal */}
          {step === 1 && selectedTemplate && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6 border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center", selectedTemplate.color)}>
                      <selectedTemplate.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedTemplate.title}</CardTitle>
                      <CardDescription>{selectedTemplate.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Proposal Title *</Label>
                    <Input
                      id="title"
                      placeholder="Give your proposal a clear, catchy title..."
                      value={proposalData.title}
                      onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Explain your proposal in detail. What problem does it solve? What are the benefits? Include all relevant information..."
                      value={proposalData.description}
                      onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                      className="mt-2"
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {proposalData.description.length} / 50 characters minimum
                    </p>
                  </div>

                  {/* Dynamic fields based on template */}
                  {selectedTemplate.category === "grant" && (
                    <>
                      <div>
                        <Label htmlFor="amount">Requested Amount (ETH)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="e.g., 50"
                          value={proposalData.customField1}
                          onChange={(e) => setProposalData({ ...proposalData, customField1: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="milestones">Milestones</Label>
                        <Textarea
                          id="milestones"
                          placeholder="List key milestones and deliverables..."
                          value={proposalData.customField2}
                          onChange={(e) => setProposalData({ ...proposalData, customField2: e.target.value })}
                          className="mt-2"
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate.category === "governance" && (
                    <>
                      <div>
                        <Label htmlFor="current">Current Value</Label>
                        <Input
                          id="current"
                          placeholder="What is the current setting?"
                          value={proposalData.customField1}
                          onChange={(e) => setProposalData({ ...proposalData, customField1: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="proposed">Proposed Value</Label>
                        <Input
                          id="proposed"
                          placeholder="What should it be changed to?"
                          value={proposalData.customField2}
                          onChange={(e) => setProposalData({ ...proposalData, customField2: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Continue to Review
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review & Submit */}
          {step === 2 && selectedTemplate && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Review Your Proposal
                  </CardTitle>
                  <CardDescription>Make sure everything looks good before submitting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 border-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center", selectedTemplate.color)}>
                        <selectedTemplate.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium capitalize">{proposalData.category}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{proposalData.title}</h2>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{proposalData.description}</p>

                    {proposalData.customField1 && (
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.category === "grant" ? "Requested Amount:" : "Current Value:"}
                        </p>
                        <p className="font-medium">{proposalData.customField1}</p>
                      </div>
                    )}

                    {proposalData.customField2 && (
                      <div className="mt-3 p-4 bg-white rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.category === "grant" ? "Milestones:" : "Proposed Value:"}
                        </p>
                        <p className="font-medium whitespace-pre-wrap">{proposalData.customField2}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      <strong>Note:</strong> Once submitted, your proposal will enter a 2-day pending period before voting begins. 
                      Make sure all details are correct!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  Edit Proposal
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Proposal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}