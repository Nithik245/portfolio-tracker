"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Holding = {
  id: string;
  ticker: string;
  company: string;
  shares: number;
  avg_cost: number;
  sector: string;
};

type PriceCache = {
  ticker: string;
  last_price: number;
  change_pct: number;
};

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceCache>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: holdingsData } = await supabase
      .from("holdings")
      .select("*");
    const { data: pricesData } = await supabase
      .from("price_cache")
      .select("*");

    if (holdingsData) setHoldings(holdingsData);
    if (pricesData) {
      const priceMap: Record<string, PriceCache> = {};
      pricesData.forEach((p) => (priceMap[p.ticker] = p));
      setPrices(priceMap);
    }
    setLoading(false);
  }

  const totalCost = holdings.reduce(
    (sum, h) => sum + h.shares * h.avg_cost,
    0
  );

  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.ticker]?.last_price || h.avg_cost;
    return sum + h.shares * price;
  }, 0);

  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
  const pnlColour = totalPnL >= 0 ? "text-green-400" : "text-red-400";

  const labelColours: Record<string, string> = {
    "STRONG BUY": "bg-green-700 text-white",
    BUY: "bg-green-500 text-white",
    HOLD: "bg-yellow-500 text-black",
    REDUCE: "bg-orange-500 text-white",
    SELL: "bg-red-600 text-white",
  };

  function getScore(h: Holding): number {
    const price = prices[h.ticker];
    if (!price) return 5;
    const pnlPct =
      ((price.last_price - h.avg_cost) / h.avg_cost) * 100;
    if (pnlPct > 30) return 8.5;
    if (pnlPct > 15) return 7.5;
    if (pnlPct > 0) return 6.5;
    if (pnlPct > -10) return 5.0;
    return 3.5;
  }

  function getLabel(score: number): string {
    if (score >= 8) return "STRONG BUY";
    if (score >= 6.5) return "BUY";
    if (score >= 4.5) return "HOLD";
    if (score >= 3) return "REDUCE";
    return "SELL";
  }

  const avgScore =
    holdings.length > 0
      ? holdings.reduce((sum, h) => sum + getScore(h), 0) /
        holdings.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1B3A5C] rounded-xl p-5 border border-[#2E86AB]">
          <p className="text-xs text-gray-400 mb-1">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-white">
            ${totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-[#1B3A5C] rounded-xl p-5 border border-[#2E86AB]">
          <p className="text-xs text-gray-400 mb-1">Unrealised P&L</p>
          <p className={`text-2xl font-bold ${pnlColour}`}>
            {totalPnL >= 0 ? "+" : ""}$
            {totalPnL.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className={`text-sm ${pnlColour}`}>
            {totalPnLPct >= 0 ? "+" : ""}
            {totalPnLPct.toFixed(2)}%
          </p>
        </div>
        <div className="bg-[#1B3A5C] rounded-xl p-5 border border-[#2E86AB]">
          <p className="text-xs text-gray-400 mb-1">Number of Positions</p>
          <p className="text-2xl font-bold text-white">
            {holdings.length}
          </p>
        </div>
        <div className="bg-[#1B3A5C] rounded-xl p-5 border border-[#2E86AB]">
          <p className="text-xs text-gray-400 mb-1">Average Rating Score</p>
          <p className="text-2xl font-bold text-teal-400">
            {avgScore.toFixed(1)} / 10
          </p>
        </div>
      </div>

      {/* Ratings Table */}
      {holdings.length === 0 ? (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-12 text-center">
          <p className="text-gray-400 text-lg">No holdings yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Go to Holdings to add your first position
          </p>
        </div>
      ) : (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-4">
            Ratings Summary
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2E86AB]">
                <th className="text-left py-2">Ticker</th>
                <th className="text-left py-2">Company</th>
                <th className="text-right py-2">Current Price</th>
                <th className="text-right py-2">P&L %</th>
                <th className="text-right py-2">Score</th>
                <th className="text-left py-2 pl-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const price = prices[h.ticker];
                const currentPrice = price?.last_price || h.avg_cost;
                const pnlPct =
                  ((currentPrice - h.avg_cost) / h.avg_cost) * 100;
                const score = getScore(h);
                const label = getLabel(score);
                const rowPnlColour =
                  pnlPct >= 0 ? "text-green-400" : "text-red-400";

                return (
                  <tr
                    key={h.id}
                    className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                  >
                    <td className="py-3 font-bold text-white">
                      {h.ticker}
                    </td>
                    <td className="py-3 text-gray-300">
                      {h.company || "—"}
                    </td>
                    <td className="py-3 text-right text-white">
                      {price ? `$${currentPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className={`py-3 text-right font-semibold ${rowPnlColour}`}>
                      {pnlPct >= 0 ? "+" : ""}
                      {pnlPct.toFixed(2)}%
                    </td>
                    <td className="py-3 text-right text-teal-400 font-semibold">
                      {score.toFixed(1)}
                    </td>
                    <td className="py-3 pl-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${labelColours[label]}`}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}