export default function Macro() {
    const sections = [
      {
        title: "Inflation",
        indicators: [
          { name: "CPI YoY %", latest: 3.2, prior: 3.4, goodDirection: "down" },
          { name: "Core CPI YoY %", latest: 3.8, prior: 3.9, goodDirection: "down" },
          { name: "PCE YoY %", latest: 2.8, prior: 2.9, goodDirection: "down" },
          { name: "Core PCE YoY %", latest: 2.9, prior: 3.0, goodDirection: "down" },
          { name: "PPI YoY %", latest: 1.6, prior: 1.8, goodDirection: "down" },
        ],
      },
      {
        title: "Interest Rates",
        indicators: [
          { name: "Fed Funds Rate %", latest: 5.33, prior: 5.33, goodDirection: "down" },
          { name: "10Y Treasury Yield %", latest: 4.28, prior: 4.15, goodDirection: "down" },
          { name: "2Y Treasury Yield %", latest: 4.62, prior: 4.55, goodDirection: "down" },
          { name: "10Y - 2Y Spread", latest: -0.34, prior: -0.40, goodDirection: "up" },
        ],
      },
      {
        title: "Growth",
        indicators: [
          { name: "GDP Growth QoQ Ann. %", latest: 3.3, prior: 2.1, goodDirection: "up" },
          { name: "Unemployment Rate %", latest: 3.7, prior: 3.8, goodDirection: "down" },
          { name: "Non-Farm Payrolls (K)", latest: 256, prior: 290, goodDirection: "up" },
          { name: "Retail Sales YoY %", latest: 2.1, prior: 1.8, goodDirection: "up" },
        ],
      },
      {
        title: "Market",
        indicators: [
          { name: "VIX", latest: 14.2, prior: 16.8, goodDirection: "down" },
          { name: "WTI Crude Oil $/bbl", latest: 78.4, prior: 75.2, goodDirection: "down" },
          { name: "Gold $/oz", latest: 2042, prior: 2010, goodDirection: "up" },
        ],
      },
    ];
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Macro Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Last refreshed: 05 Mar 2026 09:00
            </span>
            <button className="bg-[#2E86AB] hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Refresh Macro Data
            </button>
          </div>
        </div>
  
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-[#2E86AB] pb-2">
              {section.title}
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {section.indicators.map((ind) => {
                const direction = ind.latest > ind.prior ? "up" : "down";
                const isGood = direction === ind.goodDirection;
                const colour = isGood ? "text-green-400" : "text-red-400";
                const arrow = direction === "up" ? "↑" : "↓";
                const change = (ind.latest - ind.prior).toFixed(2);
  
                return (
                  <div
                    key={ind.name}
                    className="bg-[#1B3A5C] rounded-xl border border-[#2E86AB] p-4 space-y-2"
                  >
                    <p className="text-xs text-gray-400 leading-tight">
                      {ind.name}
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">
                        {ind.latest}
                      </span>
                      <span className={`text-lg font-bold ${colour} mb-0.5`}>
                        {arrow}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">
                        Prior: {ind.prior}
                      </span>
                      <span className={`font-semibold ${colour}`}>
                        {direction === "up" ? "+" : ""}{change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }