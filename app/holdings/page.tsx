export default function Holdings() {
    const holdings = [
      {
        ticker: "AAPL",
        company: "Apple Inc.",
        shares: 50,
        avgCost: 165.0,
        currentPrice: 189.5,
        sector: "Technology",
        score: 8.4,
        rating: "STRONG BUY",
      },
      {
        ticker: "MSFT",
        company: "Microsoft",
        shares: 30,
        avgCost: 310.0,
        currentPrice: 338.0,
        sector: "Technology",
        score: 7.6,
        rating: "BUY",
      },
      {
        ticker: "GOOGL",
        company: "Alphabet",
        shares: 10,
        avgCost: 140.0,
        currentPrice: 152.0,
        sector: "Technology",
        score: 6.8,
        rating: "BUY",
      },
      {
        ticker: "AMZN",
        company: "Amazon",
        shares: 20,
        avgCost: 175.0,
        currentPrice: 168.0,
        sector: "Cons. Disc.",
        score: 5.2,
        rating: "HOLD",
      },
      {
        ticker: "NVDA",
        company: "NVIDIA",
        shares: 15,
        avgCost: 450.0,
        currentPrice: 620.0,
        sector: "Technology",
        score: 4.1,
        rating: "HOLD",
      },
    ];
  
    const labelColours: Record<string, string> = {
      "STRONG BUY": "bg-green-700 text-white",
      BUY: "bg-green-500 text-white",
      HOLD: "bg-yellow-500 text-black",
      REDUCE: "bg-orange-500 text-white",
      SELL: "bg-red-600 text-white",
    };
  
    const totalValue = holdings.reduce(
      (sum, h) => sum + h.shares * h.currentPrice,
      0
    );
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Holdings</h2>
          <div className="flex gap-3">
            <button className="bg-[#2E86AB] hover:bg-[#1B3A5C] text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Refresh Prices
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              + Add Holding
            </button>
          </div>
        </div>
  
        <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2E86AB]">
                <th className="text-left px-4 py-3">Ticker</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-right px-4 py-3">Shares</th>
                <th className="text-right px-4 py-3">Avg Cost</th>
                <th className="text-right px-4 py-3">Current Price</th>
                <th className="text-right px-4 py-3">Cost Basis</th>
                <th className="text-right px-4 py-3">Mkt Value</th>
                <th className="text-right px-4 py-3">P&L ($)</th>
                <th className="text-right px-4 py-3">P&L (%)</th>
                <th className="text-right px-4 py-3">Weight</th>
                <th className="text-left px-4 py-3">Sector</th>
                <th className="text-right px-4 py-3">Score</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Rating</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const costBasis = h.shares * h.avgCost;
                const mktValue = h.shares * h.currentPrice;
                const pnl = mktValue - costBasis;
                const pnlPct = (pnl / costBasis) * 100;
                const weight = (mktValue / totalValue) * 100;
                const pnlColour = pnl >= 0 ? "text-green-400" : "text-red-400";
  
                return (
                  <tr
                    key={h.ticker}
                    className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-white">
                      {h.ticker}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{h.company}</td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {h.shares}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ${h.avgCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-semibold">
                      ${h.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ${costBasis.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      ${mktValue.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${pnlColour}`}>
                      {pnl >= 0 ? "+" : ""}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${pnlColour}`}>
                      {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {weight.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-gray-300">{h.sector}</td>
                    <td className="px-4 py-3 text-right text-teal-400 font-semibold">
                      {h.score}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
  <span
    className={`px-2 py-1 rounded-full text-xs font-bold ${labelColours[h.rating]}`}
  >
    {h.rating}
  </span>
</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs bg-[#2E86AB] hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors">
                          Edit
                        </button>
                        <button className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors">
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
      </div>
    );
  }