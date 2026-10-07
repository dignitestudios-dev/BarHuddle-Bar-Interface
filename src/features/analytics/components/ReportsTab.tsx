"use client";

import React from "react";
import { BoostHistoryTableCard } from "./BoostHistoryTableCard";
import { useTierAccess } from "@/hooks/useTierAccess";
import { TierLockedGate } from "@/components/ui/TierLockedGate";

export function ReportsTab() {
    const { isFree } = useTierAccess();

    if (isFree) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <TierLockedGate
                    requiredTier="premium"
                    title="Reports & Data Export"
                    description="Export comprehensive foot-traffic logs, visitor trends, event turnout, and campaign performance data with the Pro Plan ($9.99/mo)."
                />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            <div className="max-w-[1200px] w-full">
                <BoostHistoryTableCard
                    showFilterPills={true}
                    initialFilter="Visitors"
                    tagText="BOOST HISTORY"
                    title="Boost History"
                    className="max-w-full"
                />
            </div>
        </div>
    );
}

export default ReportsTab;
