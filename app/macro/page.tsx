"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MacroIndicator = {
  series_id: string;
  indicator_name: string;
  latest_value: number;
  prior_value: number;
  as_of_date: string;
  fetched_at: string;
};

const GOOD_DIRECTION: Record<string, "up" | "down"> = {
  "CPI YoY %": "down",
  "Core CPI YoY %": "down",
  "PCE YoY %": "down",
  "Core PCE YoY %": "down",
  "Fed Funds Rate %": "down",
  "10Y Treasury Yield %": "down",
  "2Y Treasury Yield %": "down",
  "10Y - 2Y Spread": "up",
  "GDP Growth QoQ Ann. %": "up",
  "Unemployment Rate %": "down",
  "Non-Farm Payrolls (K)": "up",
  "VIX": "down",
  "WTI Crude Oil $/bbl": "down",
};

const SECTIONS = [
  {
    title: "Inflation",
    series: ["CPIAUCSL", "CPILFESL", "PCEPI", "PCEPILFE"],
  },
  {
    title: "Interest Rates",
    series: ["FEDFUNDS", "GS10", "GS2", "T10Y2Y"],
  },
  {
    title: "Growth",
    series: ["A191RL1Q225SBEA", "UNRATE", "PAYEMS"],
  },
  {
    title: "Market",
    series: ["VIXCLS", "DCOILWTICO"],
  },
];

export default function Macro() {
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    fetchMacroData();
  }, []);

  async function fetchMacroData() {
    const { data } = await supabase.from("macro_data").select("*");
    if (data) {
      setIndicators(data);
      if (data.length > 0) {
        setLastRefreshed(
          new Date(data[0].fetched_at).toLocaleString()
        );
      }
    }
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetch("/api/macro");
    await fetchMacroData();
    setRefreshing(false);
  }

  function getIndicator(seriesId: string) {
    return indicators.find((i) => i.series_id === seriesId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading macro data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Macro Dashboard</h2>
        <div className="flex items-center gap-4">
          {lastRefreshed && (
            <span className="text-xs text-gray-400">
              Last refreshed: {lastRefreshed}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-[#2E86AB] hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Macro Data"}
          </button>
        </div>
      </div>

      {indicators.length === 0 ? (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-12 text-center">
          <p className="text-gray-400 text-lg">No macro data yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Click &quot;Refresh Macro Data&quot; to fetch live data from FRED
          </p>
        </div>
      ) : (
        SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-[#2E86AB] pb-2">
              {section.title}
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {section.series.map((seriesId) => {
                const ind = getIndicator(seriesId);
                if (!ind) return null;

                const direction =
                  ind.latest_value > ind.prior_value ? "up" : "down";
                const goodDir =
                  GOOD_DIRECTION[ind.indicator_name] || "up";
                const isGood = direction === goodDir;
                const colour = isGood ? "text-green-400" : "text-red-400";
                const arrow = direction === "up" ? "↑" : "↓";
                const change = (
                  ind.latest_value - ind.prior_value
                ).toFixed(2);

                return (
                  <div
                    key={seriesId}
                    className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-4 space-y-2"
                  >
                    <p className="text-xs text-gray-400 leading-tight">
                      {ind.indicator_name}
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">
                        {ind.latest_value}
                      </span>
                      <span className={`text-lg font-bold ${colour} mb-0.5`}>
                        {arrow}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">
                        Prior: {ind.prior_value}
                      </span>
                      <span className={`font-semibold ${colour}`}>
                        {direction === "up" ? "+" : ""}
                        {change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      As of {ind.as_of_date}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}