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

    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "FMP API key not set" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const ticker of tickers) {
      try {
        // Fetch income statement
        const incomeRes = await fetch(
          `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&limit=2&apikey=${apiKey}`
        );
        const incomeData = await incomeRes.json();

        // Fetch balance sheet
        const balanceRes = await fetch(
          `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&limit=1&apikey=${apiKey}`
        );
        const balanceData = await balanceRes.json();

        // Fetch cash flow
        const cashflowRes = await fetch(
          `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&limit=1&apikey=${apiKey}`
        );
        const cashflowData = await cashflowRes.json();

        // Fetch key metrics
        const metricsRes = await fetch(
          `https://financialmodelingprep.com/stable/key-metrics?symbol=${ticker}&limit=1&apikey=${apiKey}`
        );
        const metricsData = await metricsRes.json();

        // Log raw responses for debugging
        console.log(`${ticker} income:`, JSON.stringify(incomeData).slice(0, 200));
        console.log(`${ticker} balance:`, JSON.stringify(balanceData).slice(0, 200));

        const income = Array.isArray(incomeData) ? incomeData[0] : incomeData?.data?.[0];
        const incomePrior = Array.isArray(incomeData) ? incomeData[1] : incomeData?.data?.[1];
        const balance = Array.isArray(balanceData) ? balanceData[0] : balanceData?.data?.[0];
        const cashflow = Array.isArray(cashflowData) ? cashflowData[0] : cashflowData?.data?.[0];
        const metrics = Array.isArray(metricsData) ? metricsData[0] : metricsData?.data?.[0];

        if (!income || !balance) {
          errors.push({ ticker, error: "No data returned from FMP — check ticker or API limits" });
          continue;
        }

        const revenueLTM = income.revenue ? income.revenue / 1_000_000 : null;
        const revenuePrior = incomePrior?.revenue ? incomePrior.revenue / 1_000_000 : null;
        const ebitdaLTM = income.ebitda ? income.ebitda / 1_000_000 : null;
        const grossMargin = income.grossProfitRatio ? income.grossProfitRatio * 100 : null;
        const netIncome = income.netIncome ? income.netIncome / 1_000_000 : null;
        const epsCurrent = income.eps || null;
        const epsPrior = incomePrior?.eps || null;
        const fcf = cashflow?.freeCashFlow ? cashflow.freeCashFlow / 1_000_000 : null;
        const totalDebt = balance.totalDebt ? balance.totalDebt / 1_000_000 : null;
        const totalEquity = balance.totalStockholdersEquity ? balance.totalStockholdersEquity / 1_000_000 : null;
        const sharesOutstanding = balance.commonStock ? balance.commonStock / 1_000_000 : null;
        const netDebt = balance.netDebt ? balance.netDebt / 1_000_000 : null;
        const currentRatio = metrics?.currentRatio || null;
        const roic = metrics?.roic ? metrics.roic * 100 : null;

        const revGrowth = revenueLTM && revenuePrior
          ? ((revenueLTM - revenuePrior) / revenuePrior) * 100
          : null;

        const ebitdaMargin = ebitdaLTM && revenueLTM
          ? (ebitdaLTM / revenueLTM) * 100
          : null;

        const epsGrowth = epsCurrent && epsPrior && epsPrior !== 0
          ? ((epsCurrent - epsPrior) / Math.abs(epsPrior)) * 100
          : null;

        const record = {
          ticker,
          revenue_ltm: revenueLTM,
          revenue_prior: revenuePrior,
          rev_growth: revGrowth,
          ebitda_ltm: ebitdaLTM,
          ebitda_margin: ebitdaMargin,
          gross_margin: grossMargin,
          net_income: netIncome,
          eps_current: epsCurrent,
          eps_prior: epsPrior,
          eps_growth: epsGrowth,
          free_cash_flow: fcf,
          roic,
          current_ratio: currentRatio,
          total_debt: totalDebt,
          total_equity: totalEquity,
          shares_outstanding: sharesOutstanding,
          net_debt: netDebt,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("fundamentals")
          .upsert(record, { onConflict: "ticker" });

        if (upsertError) {
          errors.push({ ticker, error: upsertError.message });
        } else {
          results.push(record);
        }
      } catch (err) {
        errors.push({ ticker, error: String(err) });
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
      { error: "Failed to fetch fundamentals" },
      { status: 500 }
    );
  }
}