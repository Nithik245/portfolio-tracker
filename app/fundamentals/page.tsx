"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Holding = {
  id: string;
  ticker: string;
  company: string;
};

type Fundamental = {
  id?: string;
  ticker: string;
  revenue_ltm: number | null;
  revenue_prior: number | null;
  rev_growth: number | null;
  ebitda_ltm: number | null;
  ebitda_margin: number | null;
  gross_margin: number | null;
  net_income: number | null;
  eps_current: number | null;
  eps_prior: number | null;
  eps_growth: number | null;
  free_cash_flow: number | null;
  roic: number | null;
  current_ratio: number | null;
  total_debt: number | null;
  total_equity: number | null;
  shares_outstanding: number | null;
  net_debt: number | null;
};

const EMPTY_FUNDAMENTAL = (ticker: string): Fundamental => ({
  ticker,
  revenue_ltm: null,
  revenue_prior: null,
  rev_growth: null,
  ebitda_ltm: null,
  ebitda_margin: null,
  gross_margin: null,
  net_income: null,
  eps_current: null,
  eps_prior: null,
  eps_growth: null,
  free_cash_flow: null,
  roic: null,
  current_ratio: null,
  total_debt: null,
  total_equity: null,
  shares_outstanding: null,
  net_debt: null,
});

export default function Fundamentals() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [fundamentals, setFundamentals] = useState<Record<string, Fundamental>>({});
  const [loading, setLoading] = useState(true);
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Fundamental | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  async function handleRefreshFundamentals() {
    setRefreshing(true);
    const tickers = holdings.map((h) => h.ticker);
    await fetch("/api/fundamentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers }),
    });
    await fetchData();
    setRefreshing(false);
  }
  async function fetchData() {
    const { data: holdingsData } = await supabase
      .from("holdings")
      .select("id, ticker, company");
    const { data: fundData } = await supabase
      .from("fundamentals")
      .select("*");
    if (holdingsData) setHoldings(holdingsData);
    if (fundData) {
      const fundMap: Record<string, Fundamental> = {};
      fundData.forEach((f) => (fundMap[f.ticker] = f));
      setFundamentals(fundMap);
    }
    setLoading(false);
  }

  function handleEdit(ticker: string) {
    const existing = fundamentals[ticker] || EMPTY_FUNDAMENTAL(ticker);
    setEditForm({ ...existing });
    setEditingTicker(ticker);
  }

  function handleFormChange(key: keyof Fundamental, value: string) {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      [key]: value === "" ? null : parseFloat(value),
    });
  }

  async function handleSave() {
    if (!editForm || !editingTicker) return;
    setSaving(true);

    const revGrowth =
      editForm.revenue_ltm && editForm.revenue_prior
        ? ((editForm.revenue_ltm - editForm.revenue_prior) /
            editForm.revenue_prior) * 100
        : null;

    const ebitdaMargin =
      editForm.ebitda_ltm && editForm.revenue_ltm
        ? (editForm.ebitda_ltm / editForm.revenue_ltm) * 100
        : null;

    const epsGrowth =
      editForm.eps_current && editForm.eps_prior && editForm.eps_prior !== 0
        ? ((editForm.eps_current - editForm.eps_prior) /
            Math.abs(editForm.eps_prior)) * 100
        : null;

    const record = {
      ...editForm,
      ticker: editingTicker,
      rev_growth: revGrowth,
      ebitda_margin: ebitdaMargin,
      eps_growth: epsGrowth,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from("fundamentals")
      .upsert(record, { onConflict: "ticker" });

    await fetchData();
    setEditingTicker(null);
    setEditForm(null);
    setSaving(false);
  }

  function fmt(val: number | null, prefix = "", suffix = "", decimals = 1) {
    if (val === null || val === undefined) return "—";
    return `${prefix}${val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  }

  function colourPct(val: number | null) {
    if (val === null) return "text-gray-400";
    return val >= 0 ? "text-green-400" : "text-red-400";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading fundamentals...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Fundamentals</h2>
        <button
          onClick={handleRefreshFundamentals}
          disabled={refreshing || holdings.length === 0}
          className="bg-[#2E86AB] hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {refreshing ? "Fetching..." : "Refresh Fundamentals"}
        </button>

      </div>

      {holdings.length === 0 ? (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-12 text-center">
          <p className="text-gray-400 text-lg">No holdings yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Go to Holdings to add your first position
          </p>
        </div>
      ) : (
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2E86AB]">
                <th className="text-left px-4 py-3 whitespace-nowrap">Ticker</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Company</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Rev LTM ($M)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Rev Growth %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">EBITDA ($M)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">EBITDA Margin %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Gross Margin %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Net Income ($M)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">EPS</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">EPS Growth %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">FCF ($M)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">ROIC %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Current Ratio</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Net Debt ($M)</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const f = fundamentals[h.ticker];
                return (
                  <tr
                    key={h.ticker}
                    className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-white">{h.ticker}</td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{h.company || "—"}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{fmt(f?.revenue_ltm ?? null, "", "", 0)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${colourPct(f?.rev_growth ?? null)}`}>{fmt(f?.rev_growth ?? null, "", "%")}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{fmt(f?.ebitda_ltm ?? null, "", "", 0)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${colourPct(f?.ebitda_margin ?? null)}`}>{fmt(f?.ebitda_margin ?? null, "", "%")}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${colourPct(f?.gross_margin ?? null)}`}>{fmt(f?.gross_margin ?? null, "", "%")}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{fmt(f?.net_income ?? null, "", "", 0)}</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">{fmt(f?.eps_current ?? null, "$")}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${colourPct(f?.eps_growth ?? null)}`}>{fmt(f?.eps_growth ?? null, "", "%")}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{fmt(f?.free_cash_flow ?? null, "", "", 0)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${colourPct(f?.roic ?? null)}`}>{fmt(f?.roic ?? null, "", "%")}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${!f || f.current_ratio === null ? "text-gray-400" : f.current_ratio >= 1.5 ? "text-green-400" : f.current_ratio >= 1 ? "text-yellow-400" : "text-red-400"}`}>{fmt(f?.current_ratio ?? null, "", "x")}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${!f || f.net_debt === null ? "text-gray-400" : f.net_debt <= 0 ? "text-green-400" : "text-red-400"}`}>
                    {!f || f.net_debt === null ? "—" : f.net_debt <= 0 ? `($${Math.abs(f.net_debt).toLocaleString()})` : `$${f.net_debt.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(h.ticker)}
                        className="text-xs bg-[#2E86AB] hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors whitespace-nowrap"
                      >
                        {f ? "Edit" : "Add Data"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingTicker && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingTicker} — Fundamental Data
              </h3>
              <button
                onClick={() => { setEditingTicker(null); setEditForm(null); }}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400">
              All monetary values in $M (millions). Margins and ratios as numbers e.g. 32.5 for 32.5%.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Revenue LTM ($M)", key: "revenue_ltm" },
                { label: "Revenue Prior Year ($M)", key: "revenue_prior" },
                { label: "EBITDA LTM ($M)", key: "ebitda_ltm" },
                { label: "Gross Margin (%)", key: "gross_margin" },
                { label: "Net Income ($M)", key: "net_income" },
                { label: "EPS Current", key: "eps_current" },
                { label: "EPS Prior Year", key: "eps_prior" },
                { label: "Free Cash Flow ($M)", key: "free_cash_flow" },
                { label: "ROIC (%)", key: "roic" },
                { label: "Current Ratio", key: "current_ratio" },
                { label: "Total Debt ($M)", key: "total_debt" },
                { label: "Total Equity ($M)", key: "total_equity" },
                { label: "Shares Outstanding (M)", key: "shares_outstanding" },
                { label: "Net Debt ($M)", key: "net_debt" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 block mb-1">{label}</label>
                  <input
                    type="number"
                    value={editForm[key as keyof Fundamental] === null ? "" : String(editForm[key as keyof Fundamental])}
                    onChange={(e) => handleFormChange(key as keyof Fundamental, e.target.value)}
                    className="w-full bg-[#0D1B2A] border border-[#2E86AB] text-white rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter value"
                  />
                </div>
              ))}
            </div>
            <div className="border-t border-[#2E86AB] pt-4">
              <p className="text-xs text-gray-400 mb-3">Auto-calculated on save:</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-[#0D1B2A] rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Revenue Growth</p>
                  <p className="text-teal-400 font-semibold">
                    {editForm.revenue_ltm && editForm.revenue_prior
                      ? `${(((editForm.revenue_ltm - editForm.revenue_prior) / editForm.revenue_prior) * 100).toFixed(1)}%`
                      : "—"}
                  </p>
                </div>
                <div className="bg-[#0D1B2A] rounded-lg p-3">
                  <p className="text-gray-400 text-xs">EBITDA Margin</p>
                  <p className="text-teal-400 font-semibold">
                    {editForm.ebitda_ltm && editForm.revenue_ltm
                      ? `${((editForm.ebitda_ltm / editForm.revenue_ltm) * 100).toFixed(1)}%`
                      : "—"}
                  </p>
                </div>
                <div className="bg-[#0D1B2A] rounded-lg p-3">
                  <p className="text-gray-400 text-xs">EPS Growth</p>
                  <p className="text-teal-400 font-semibold">
                    {editForm.eps_current && editForm.eps_prior && editForm.eps_prior !== 0
                      ? `${(((editForm.eps_current - editForm.eps_prior) / Math.abs(editForm.eps_prior)) * 100).toFixed(1)}%`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Fundamentals"}
              </button>
              <button
                onClick={() => { setEditingTicker(null); setEditForm(null); }}
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