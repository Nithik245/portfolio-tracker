import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { tickers } = await request.json();

    if (!tickers || tickers.length === 0) {
      return NextResponse.json(
        { error: "No tickers provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ALPHA_VANTAGE_KEY;
    const results = [];

    for (const ticker of tickers) {
      try {
        const quoteRes = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
        );
        const quoteData = await quoteRes.json();
        const quote = quoteData["Global Quote"];

        const overviewRes = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`
        );
        const overview = await overviewRes.json();

        if (quote && quote["05. price"]) {
          const priceRecord = {
            ticker,
            last_price: parseFloat(quote["05. price"]),
            open: parseFloat(quote["02. open"]),
            high: parseFloat(quote["03. high"]),
            low: parseFloat(quote["04. low"]),
            change_pct: parseFloat(
              quote["10. change percent"].replace("%", "")
            ),
            week52_high: parseFloat(overview["52WeekHigh"] || "0"),
            week52_low: parseFloat(overview["52WeekLow"] || "0"),
            pe_ratio: parseFloat(overview["PERatio"] || "0"),
            beta: parseFloat(overview["Beta"] || "0"),
            analyst_target: parseFloat(
              overview["AnalystTargetPrice"] || "0"
            ),
            fetched_at: new Date().toISOString(),
          };

          await supabase
            .from("price_cache")
            .upsert(priceRecord, { onConflict: "ticker" });

          if (overview["Name"]) {
            await supabase
              .from("holdings")
              .update({
                company: overview["Name"],
                sector: overview["Sector"] || "",
              })
              .eq("ticker", ticker);
          }

          results.push(priceRecord);
        }

        if (tickers.indexOf(ticker) < tickers.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 12000));
        }
      } catch (err) {
        console.error(`Error fetching ${ticker}:`, err);
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}