import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CheckCircle, Users, Vote, Sparkles, Rocket } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../components/ui/utils";

const onboardingSteps = [
  {
    icon: Sparkles,
    title: "Welcome to Nouns Governance! ⌐◨-◨",
    description: "This is where the magic happens. Learn how to participate in shaping the future of our community.",
    color: "from-pink-500 to-purple-500",
    tips: [
      "Anyone with Nouns tokens can participate",
      "Every proposal matters - your voice counts!",
      "Governance should be fun, not boring",
    ],
  },
  {
    icon: Vote,
    title: "How Voting Works",
    description: "Proposals go through several stages before becoming reality. Here's what you need to know:",
    color: "from-blue-500 to-indigo-500",
    tips: [
      "Pending: Proposal is waiting to start (2 days)",
      "Active: Voting is open (5-7 days)",
      "Passed/Defeated: Results are in based on votes",
      "Executed: Passed proposals are implemented",
    ],
  },
  {
    icon: Users,
    title: "Delegation Power",
    description: "Can't vote on everything? No problem! Delegate your voting power to someone you trust.",
    color: "from-emerald-500 to-green-500",
    tips: [
      "You keep your tokens - just assign voting rights",
      "Choose delegates with similar values",
      "Change your delegate anytime",
      "Or vote yourself - totally your choice!",
    ],
  },
  {
    icon: Rocket,
    title: "Create Proposals",
    description: "Have a great idea? Turn it into a proposal! We have templates to make it easy.",
    color: "from-orange-500 to-red-500",
    tips: [
      "Use templates for grants, governance changes, etc.",
      "Be clear and detailed in your description",
      "Include budget and timeline if applicable",
      "Engage with comments and feedback",
    ],
  },
  {
    icon: CheckCircle,
    title: "You're Ready! 🎉",
    description: "That's it! You now know the basics of Nouns governance. Time to jump in and make your voice heard.",
    color: "from-purple-500 to-pink-500",
    tips: [
      "Start by browsing active proposals",
      "Read discussions and comments",
      "Cast your first vote",
      "Consider finding a delegate or becoming one!",
    ],
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-20 md:pb-8 pt-0 md:pt-16">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {onboardingSteps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-full h-2 rounded-full transition-all mx-1",
                  idx <= currentStep
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <button onClick={handleSkip} className="underline hover:text-foreground">
              Skip tutorial
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 mb-6">
              <CardContent className="p-8 md:p-12">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={cn(
                    "w-20 h-20 rounded-full bg-gradient-to-r flex items-center justify-center mx-auto mb-6",
                    step.color
                  )}
                >
                  <Icon className="h-10 w-10 text-white" />
                </motion.div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
                  {step.title}
                </h1>

                {/* Description */}
                <p className="text-center text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  {step.description}
                </p>

                {/* Tips */}
                <div className="space-y-3 max-w-lg mx-auto">
                  {step.tips.map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-start gap-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-sm flex-1">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={currentStep === 0 ? "invisible" : ""}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Get Started
                    <Rocket className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}