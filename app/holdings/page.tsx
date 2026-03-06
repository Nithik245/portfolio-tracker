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
  week52_high: number;
  week52_low: number;
};

export default function Holdings() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceCache>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ticker: "",
    company: "",
    shares: "",
    avg_cost: "",
    sector: "",
  });

  const labelColours: Record<string, string> = {
    "STRONG BUY": "bg-green-700 text-white",
    BUY: "bg-green-500 text-white",
    HOLD: "bg-yellow-500 text-black",
    REDUCE: "bg-orange-500 text-white",
    SELL: "bg-red-600 text-white",
  };

  useEffect(() => {
    fetchHoldings();
    fetchPrices();
  }, []);

  async function fetchHoldings() {
    const { data } = await supabase.from("holdings").select("*");
    if (data) setHoldings(data);
    setLoading(false);
  }

  async function fetchPrices() {
    const { data } = await supabase.from("price_cache").select("*");
    if (data) {
      const priceMap: Record<string, PriceCache> = {};
      data.forEach((p) => (priceMap[p.ticker] = p));
      setPrices(priceMap);
    }
  }

  async function handleRefreshPrices() {
    setRefreshing(true);
    const tickers = holdings.map((h) => h.ticker);
    await fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers }),
    });
    await fetchPrices();
    setRefreshing(false);
  }

  async function handleAddHolding() {
    if (!form.ticker || !form.shares || !form.avg_cost) return;
    await supabase.from("holdings").insert({
      ticker: form.ticker.toUpperCase(),
      company: "",
      shares: parseFloat(form.shares),
      avg_cost: parseFloat(form.avg_cost),
      sector: "",
    });
    setForm({ ticker: "", company: "", shares: "", avg_cost: "", sector: "" });
    setShowModal(false);
    await fetchHoldings();
    const tickers = [form.ticker.toUpperCase()];
    await fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers }),
    });
    await fetchHoldings();
    await fetchPrices();
  }

  async function handleDelete(id: string) {
    await supabase.from("holdings").delete().eq("id", id);
    fetchHoldings();
  }

  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.ticker]?.last_price || h.avg_cost;
    return sum + h.shares * price;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading holdings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Holdings</h2>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshPrices}
            disabled={refreshing}
            className="bg-[#2E86AB] hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Prices"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Add Holding
          </button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-12 text-center">
          <p className="text-gray-400 text-lg">No holdings yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Click &quot;+ Add Holding&quot; to add your first position
          </p>
        </div>
      ) : (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2E86AB]">
                <th className="text-left px-4 py-3 whitespace-nowrap">Ticker</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Company</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Shares</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Avg Cost</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Current Price</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Cost Basis</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Mkt Value</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">P&L ($)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">P&L (%)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Weight</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Day Chg %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">52W High</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">52W Low</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Sector</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const price = prices[h.ticker];
                const currentPrice = price?.last_price || h.avg_cost;
                const costBasis = h.shares * h.avg_cost;
                const mktValue = h.shares * currentPrice;
                const pnl = mktValue - costBasis;
                const pnlPct = (pnl / costBasis) * 100;
                const weight = (mktValue / totalValue) * 100;
                const pnlColour = pnl >= 0 ? "text-green-400" : "text-red-400";
                const dayColour =
                  (price?.change_pct || 0) >= 0
                    ? "text-green-400"
                    : "text-red-400";

                return (
                  <tr
                    key={h.id}
                    className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-white">
                      {h.ticker}
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {h.company || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {h.shares}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ${h.avg_cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-semibold">
                      {price ? `$${currentPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ${costBasis.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      ${mktValue.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${pnlColour}`}>
                      {pnl >= 0 ? "+" : ""}$
                      {pnl.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${pnlColour}`}>
                      {pnlPct >= 0 ? "+" : ""}
                      {pnlPct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {weight.toFixed(1)}%
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${dayColour}`}>
                      {price
                        ? `${price.change_pct >= 0 ? "+" : ""}${price.change_pct.toFixed(2)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {price ? `$${price.week52_high.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {price ? `$${price.week52_low.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {h.sector || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs bg-[#2E86AB] hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Holding Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Holding</h3>
            <p className="text-xs text-gray-400">
              Enter your ticker and we will automatically fetch the company
              name, sector, and latest price.
            </p>
            {[
              { label: "Ticker (e.g. AAPL)", key: "ticker" },
              { label: "Shares", key: "shares" },
              { label: "Average Cost ($)", key: "avg_cost" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 block mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full bg-[#0D1B2A] border border-[#2E86AB] text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddHolding}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Add Holding
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#0D1B2A] hover:bg-gray-800 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}