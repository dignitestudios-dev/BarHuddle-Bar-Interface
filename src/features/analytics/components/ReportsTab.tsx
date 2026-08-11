"use client";

import React from "react";
import { BoostHistoryTableCard } from "./BoostHistoryTableCard";

export function ReportsTab() {
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
