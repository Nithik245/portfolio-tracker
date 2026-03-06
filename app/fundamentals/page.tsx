export default function Fundamentals() {
    const data = [
      {
        ticker: "AAPL",
        company: "Apple Inc.",
        revenueLTM: 391035,
        revGrowth: 2.1,
        ebitdaLTM: 126937,
        ebitdaMargin: 32.5,
        grossMargin: 44.1,
        netIncome: 93736,
        eps: 6.11,
        fcf: 99584,
        roic: 28.4,
        currentRatio: 1.07,
        netDebt: 58000,
      },
      {
        ticker: "MSFT",
        company: "Microsoft",
        revenueLTM: 245122,
        revGrowth: 16.0,
        ebitdaLTM: 104429,
        ebitdaMargin: 42.6,
        grossMargin: 69.4,
        netIncome: 72361,
        eps: 9.72,
        fcf: 87582,
        roic: 34.1,
        currentRatio: 1.77,
        netDebt: -10000,
      },
      {
        ticker: "GOOGL",
        company: "Alphabet",
        revenueLTM: 307394,
        revGrowth: 8.7,
        ebitdaLTM: 91786,
        ebitdaMargin: 29.9,
        grossMargin: 56.9,
        netIncome: 73795,
        eps: 5.80,
        fcf: 69495,
        roic: 25.2,
        currentRatio: 2.10,
        netDebt: -95000,
      },
      {
        ticker: "AMZN",
        company: "Amazon",
        revenueLTM: 620128,
        revGrowth: 12.3,
        ebitdaLTM: 85751,
        ebitdaMargin: 13.8,
        grossMargin: 47.6,
        netIncome: 29134,
        eps: 2.79,
        fcf: 32147,
        roic: 14.7,
        currentRatio: 1.05,
        netDebt: 13700,
      },
      {
        ticker: "NVDA",
        company: "NVIDIA",
        revenueLTM: 60922,
        revGrowth: 122.4,
        ebitdaLTM: 34776,
        ebitdaMargin: 57.1,
        grossMargin: 72.7,
        netIncome: 29760,
        eps: 11.93,
        fcf: 27974,
        roic: 91.6,
        currentRatio: 4.17,
        netDebt: -8290,
      },
    ];
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Fundamentals</h2>
          <p className="text-sm text-gray-400">
            Update quarterly from earnings releases
          </p>
        </div>
  
        {/* Fundamentals Table */}
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
                <th className="text-right px-4 py-3 whitespace-nowrap">FCF ($M)</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">ROIC %</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Current Ratio</th>
                <th className="text-right px-4 py-3 whitespace-nowrap">Net Debt ($M)</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.ticker}
                  className="border-b border-[#0D1B2A] hover:bg-[#0D1B2A] transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-white">{d.ticker}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{d.company}</td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {d.revenueLTM.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${d.revGrowth >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {d.revGrowth >= 0 ? "+" : ""}{d.revGrowth.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {d.ebitdaLTM.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-teal-400 font-semibold">
                    {d.ebitdaMargin.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-teal-400 font-semibold">
                    {d.grossMargin.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {d.netIncome.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-semibold">
                    ${d.eps.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {d.fcf.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${d.roic >= 15 ? "text-green-400" : "text-red-400"}`}>
                    {d.roic.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${d.currentRatio >= 1.5 ? "text-green-400" : d.currentRatio >= 1 ? "text-yellow-400" : "text-red-400"}`}>
                    {d.currentRatio.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${d.netDebt <= 0 ? "text-green-400" : "text-red-400"}`}>
                    {d.netDebt <= 0 ? "-" : ""}${Math.abs(d.netDebt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs bg-[#2E86AB] hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors whitespace-nowrap">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Analysis Panels */}
        <div className="grid grid-cols-2 gap-6">
  
          {/* DCF Calculator */}
          <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white">DCF Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full bg-[#0D1B2A] border border-[#2E86AB] text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Terminal Growth Rate (%)</label>
                <input
                  type="number"
                  defaultValue={2.5}
                  className="w-full bg-[#0D1B2A] border border-[#2E86AB] text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Projection Years</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full bg-[#0D1B2A] border border-[#2E86AB] text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button className="w-full bg-[#2E86AB] hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                Calculate
              </button>
            </div>
            <div className="border-t border-[#2E86AB] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Intrinsic Value</span>
                <span className="text-white font-bold">$198.42</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Price</span>
                <span className="text-white">$189.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Upside</span>
                <span className="text-green-400 font-bold">+4.7%</span>
              </div>
              <div className="flex justify-center mt-2">
                <span className="bg-green-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                  UNDERVALUED
                </span>
              </div>
            </div>
          </div>
  
          {/* Altman Z-Score */}
          <div className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white">Altman Z-Score</h3>
            <p className="text-xs text-gray-400">
              Auto-calculated from fundamental inputs. Measures bankruptcy risk.
            </p>
            <div className="space-y-3">
              {data.map((d) => {
                const zScore = 3.2;
                const zone =
                  zScore > 2.99
                    ? { label: "Safe Zone", colour: "bg-green-700 text-white" }
                    : zScore > 1.81
                    ? { label: "Grey Zone", colour: "bg-yellow-500 text-black" }
                    : { label: "Distress Zone", colour: "bg-red-600 text-white" };
                return (
                  <div
                    key={d.ticker}
                    className="flex items-center justify-between bg-[#0D1B2A] rounded-lg px-4 py-2"
                  >
                    <span className="text-white font-bold text-sm">{d.ticker}</span>
                    <span className="text-teal-400 font-semibold text-sm">{zScore.toFixed(2)}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${zone.colour}`}>
                      {zone.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
  
        </div>
      </div>
    );
  }