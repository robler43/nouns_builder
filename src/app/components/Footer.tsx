import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, FileText, Gavel, CheckSquare, Coins, Zap } from "lucide-react";

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const actions = [
        { label: "Execution Events", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Treasury Movements", icon: Coins, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Votes", icon: CheckSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Auctions", icon: Gavel, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Proposals", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    ];

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Menu */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-2 items-end mb-2"
                        >
                            {actions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-lg hover:bg-gray-50 transition-colors border border-gray-100"
                                >
                                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                                    <div className={`p-2 rounded-xl ${action.bg}`}>
                                        <action.icon className={`h-4 w-4 ${action.color}`} />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMenu}
                    className="h-14 w-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-900 transition-colors"
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 135 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Plus className="h-6 w-6" />
                    </motion.div>
                </motion.button>
            </div>
        </>
    );
}
