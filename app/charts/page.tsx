"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const rsiData = [
  { ticker: "AAPL", rsi: 62 },
  { ticker: "MSFT", rsi: 71 },
  { ticker: "GOOGL", rsi: 55 },
  { ticker: "AMZN", rsi: 48 },
  { ticker: "NVDA", rsi: 78 },
];

const momentumData = [
  { ticker: "NVDA", score: 9.2 },
  { ticker: "MSFT", score: 7.8 },
  { ticker: "AAPL", score: 6.5 },
  { ticker: "GOOGL", score: 5.1 },
  { ticker: "AMZN", score: 3.4 },
];

const scatterData = [
  { ticker: "AAPL", risk: 18, return: 12 },
  { ticker: "MSFT", risk: 20, return: 16 },
  { ticker: "GOOGL", risk: 22, return: 14 },
  { ticker: "AMZN", risk: 25, return: 18 },
  { ticker: "NVDA", risk: 35, return: 38 },
  { ticker: "Max Sharpe", risk: 21, return: 19 },
  { ticker: "Min Variance", risk: 15, return: 10 },
];

const cumulativeData = [
  { month: "Jan", portfolio: 0, benchmark: 0 },
  { month: "Feb", portfolio: 4.2, benchmark: 2.1 },
  { month: "Mar", portfolio: 6.8, benchmark: 4.3 },
  { month: "Apr", portfolio: 5.1, benchmark: 3.8 },
  { month: "May", portfolio: 9.4, benchmark: 6.2 },
  { month: "Jun", portfolio: 12.7, benchmark: 7.9 },
  { month: "Jul", portfolio: 11.2, benchmark: 8.4 },
  { month: "Aug", portfolio: 15.6, benchmark: 10.1 },
  { month: "Sep", portfolio: 14.1, benchmark: 9.6 },
  { month: "Oct", portfolio: 18.3, benchmark: 12.4 },
  { month: "Nov", portfolio: 21.5, benchmark: 14.8 },
  { month: "Dec", portfolio: 24.2, benchmark: 16.3 },
];

const getRSIColour = (rsi: number) => {
  if (rsi >= 70) return "#ef4444";
  if (rsi <= 30) return "#22c55e";
  return "#2E86AB";
};

const getMomentumColour = (score: number) => {
  if (score >= 8) return "#15803d";
  if (score >= 6) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

export default function Charts() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Analytics & Charts</h2>

      {/* Row 1 — RSI and Momentum */}
      <div className="grid grid-cols-2 gap-6">

        {/* RSI Chart */}
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-1">
            RSI — Relative Strength Index
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Above 70 = Overbought. Below 30 = Oversold.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rsiData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B3A5C" />
              <XAxis dataKey="ticker" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0D1B2A", border: "1px solid #2E86AB", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#2E86AB" }}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Overbought", fill: "#ef4444", fontSize: 11 }} />
              <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Oversold", fill: "#22c55e", fontSize: 11 }} />
              <Bar dataKey="rsi" name="RSI" radius={[4, 4, 0, 0]}
                fill="#2E86AB"
                label={false}
              >
                {rsiData.map((entry, index) => (
                  <rect key={index} fill={getRSIColour(entry.rsi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Momentum Chart */}
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-1">
            Momentum Score Ranking
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Ranked by composite trailing return score (1–10).
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              layout="vertical"
              data={momentumData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1B3A5C" />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis dataKey="ticker" type="category" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0D1B2A", border: "1px solid #2E86AB", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#2E86AB" }}
              />
              <Bar dataKey="score" name="Momentum Score" radius={[0, 4, 4, 0]}>
                {momentumData.map((entry, index) => (
                  <rect key={index} fill={getMomentumColour(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 — Scatter and Cumulative Return */}
      <div className="grid grid-cols-2 gap-6">

        {/* Portfolio Optimisation Scatter */}
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-1">
            Risk vs Return
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            X axis = volatility (risk). Y axis = expected return. Stars = optimal portfolios.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B3A5C" />
              <XAxis
                dataKey="risk"
                name="Risk %"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                label={{ value: "Risk %", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis
                dataKey="return"
                name="Return %"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                label={{ value: "Return %", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#0D1B2A", border: "1px solid #2E86AB", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Scatter
                data={scatterData}
                fill="#2E86AB"
                name="Holdings"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Return Chart */}
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-1">
            Cumulative Portfolio Return
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Portfolio vs benchmark (SPY) over the past 12 months.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={cumulativeData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1B3A5C" />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#0D1B2A", border: "1px solid #2E86AB", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
              <ReferenceLine y={0} stroke="#ffffff" strokeOpacity={0.2} />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="My Portfolio"
                stroke="#2E86AB"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="SPY Benchmark"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
