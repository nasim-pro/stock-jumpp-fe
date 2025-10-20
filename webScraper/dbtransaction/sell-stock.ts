// utils/sell-stock.ts
import axios from "axios";
import { StockData } from "./type";
import { API_BASE } from '../../config';


/**
 * Sell an existing stock by calling backend API
 * @param stockData StockData object
 */
export async function sellStock(stockData: StockData): Promise<void> {
    try {
        const {
            stockName,
            ticker,
            peRatio,
            currentPrice,
            marketCap,
            debt,
            promoterHolding,
            roe,
            roce,
            quarters,
            quarterlySales,
            quarterlyPat,
            quarterlyEps,
            quarterlyOpProfit,
            years,
            yearlySales,
            yearlyEps,
            recommendation,
            DPS,
        } = stockData;

        let nseBse = ticker ? "NSE" : "BSE";

        const sellObj = {
            stockName,
            ticker,
            nseBse,
            status: "sold",

            // sell snapshot
            sellPrice: currentPrice,
            sellPeRatio: peRatio,
            sellMarketCap: marketCap,
            sellDebt: debt,
            sellRoe: roe,
            sellRoce: roce,
            sellPromoterHolding: promoterHolding,

            sellQuarters: quarters,
            sellQuarterlySales: quarterlySales,
            sellQuarterlyPat: quarterlyPat,
            sellQuarterlyEps: quarterlyEps,
            sellQuarterlyOpProfit: quarterlyOpProfit,

            sellYears: years,
            sellYearlySales: yearlySales,
            sellYearlyEps: yearlyEps,
            sellDate: new Date().toISOString(),

            sellEPSGrowthRateCagr: recommendation?.EPS?.oldGrowthRate,
            sellImpliedEPSGrowthRateCagr: recommendation?.EPS?.newGrowthRate,
            sellSalesGrowthRateCagr: recommendation?.Sales?.oldGrowthRate,
            sellSalesImpliedGrowthRateCagr: recommendation?.Sales?.newGrowthRate,

            sellJumpPercent: recommendation?.EPS?.jumpPercent,
            sellChangeInEPSGrowthCagr: recommendation?.EPS?.change,

            sellPeg: recommendation?.PEG,
            sellImpliedEPS: recommendation?.EPS?.impliedValue,
            sellImpliedSales: recommendation?.Sales?.impliedValue,
            sellDPS: DPS,
        };
        // console.log("sellObj", JSON.stringify(sellObj, null, 2));

        // Call backend API
        // console.log("requesting sell API with", `${API_BASE}/api/sell`);
        
        const resp = await axios.post(`${API_BASE}/api/sell`, sellObj, { headers: { 'Content-Type': 'application/json' } });
        // console.log("resp", resp);
        
        console.log(`✅ Stock ${stockName} sell request sent`);
    } catch (error: any) {
        console.error("❌ Error selling stock:", error.message);
    }
}

