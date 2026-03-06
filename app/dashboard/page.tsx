export default function Dashboard() {
    const kpis = [
      { label: "Total Portfolio Value", value: "$124,500.00", color: "text-white" },
      { label: "Unrealised P&L", value: "+$14,320.00", color: "text-green-400" },
      { label: "Number of Positions", value: "5", color: "text-white" },
      { label: "Average Rating Score", value: "7.2 / 10", color: "text-teal-400" },
    ];
  
    const ratings = [
      { ticker: "AAPL", score: 8.4, label: "STRONG BUY", top: "Fundamentals" },
      { ticker: "MSFT", score: 7.6, label: "BUY", top: "Valuation" },
      { ticker: "GOOGL", score: 6.8, label: "BUY", top: "Momentum" },
      { ticker: "AMZN", score: 5.2, label: "HOLD", top: "FCF" },
      { ticker: "NVDA", score: 4.1, label: "HOLD", top: "Liquidity" },
    ];
  
    const labelColours: Record<string, string> = {
      "STRONG BUY": "bg-green-700 text-white",
      BUY: "bg-green-500 text-white",
      HOLD: "bg-yellow-500 text-black",
      REDUCE: "bg-orange-500 text-white",
      SELL: "bg-red-600 text-white",
    };
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
  
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#1B3A5C] rounded-xl p-5 border border-[#2E86AB]"
            >
              <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>
  
        {/* Ratings Table */}
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5">
          <h3 className="text-lg font-semibold text-white mb-4">
            Ratings Summary
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2E86AB]">
                <th className="text-left py-2">Ticker</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Rating</th>
                <th className="text-left py-2">Top Dimension</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr
                  key={r.ticker}
                  className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                >
                  <td className="py-3 font-bold text-white">{r.ticker}</td>
                  <td className="py-3 text-teal-400 font-semibold">
                    {r.score}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${labelColours[r.label]}`}
                    >
                      {r.label}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{r.top}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }