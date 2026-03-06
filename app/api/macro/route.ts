import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const FRED_SERIES = [
  { id: "CPIAUCSL", name: "CPI YoY %" },
  { id: "CPILFESL", name: "Core CPI YoY %" },
  { id: "PCEPI", name: "PCE YoY %" },
  { id: "PCEPILFE", name: "Core PCE YoY %" },
  { id: "FEDFUNDS", name: "Fed Funds Rate %" },
  { id: "GS10", name: "10Y Treasury Yield %" },
  { id: "GS2", name: "2Y Treasury Yield %" },
  { id: "T10Y2Y", name: "10Y - 2Y Spread" },
  { id: "A191RL1Q225SBEA", name: "GDP Growth QoQ Ann. %" },
  { id: "UNRATE", name: "Unemployment Rate %" },
  { id: "PAYEMS", name: "Non-Farm Payrolls (K)" },
  { id: "VIXCLS", name: "VIX" },
  { id: "DCOILWTICO", name: "WTI Crude Oil $/bbl" },
];

export async function GET() {
  try {
    const apiKey = process.env.FRED_API_KEY;

    if (!apiKey || apiKey === "") {
      return NextResponse.json(
        { error: "FRED API key not set" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const series of FRED_SERIES) {
      try {
        const res = await fetch(
          `https://api.stlouisfed.org/fred/series/observations?series_id=${series.id}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`
        );
        const data = await res.json();

        if (data.observations && data.observations.length >= 2) {
          const latest = data.observations[0];
          const prior = data.observations[1];

          const record = {
            series_id: series.id,
            indicator_name: series.name,
            latest_value: parseFloat(latest.value),
            prior_value: parseFloat(prior.value),
            as_of_date: latest.date,
            fetched_at: new Date().toISOString(),
          };

          const { error: upsertError } = await supabase
            .from("macro_data")
            .upsert(record, { onConflict: "series_id" });

          if (upsertError) {
            errors.push({
              series: series.id,
              error: upsertError.message,
            });
          } else {
            results.push(record);
          }
        }
      } catch (err) {
        errors.push({ series: series.id, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      saved: results.length,
      errors,
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch macro data" },
      { status: 500 }
    );
  }
}