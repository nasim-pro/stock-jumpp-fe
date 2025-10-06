// utils/sellStock.ts
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
            recomendation,
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

            sellEPSGrowthRateCagr: recomendation.EPS.oldGrowthRate,
            sellImpliedEPSGrowthRateCagr: recomendation.EPS.newGrowthRate,
            sellSalesGrowthRateCagr: recomendation.Sales.oldGrowthRate,
            sellSalesImpliedGrowthRateCagr: recomendation.Sales.newGrowthRate,

            sellJumpPercent: recomendation.EPS.jumpPercent,
            sellChangeInEPSGrowthCagr: recomendation.EPS.change,

            sellPeg: recomendation.PEG,
            sellImpliedEPS: recomendation.EPS.impliedValue,
            sellImpliedSales: recomendation.Sales.impliedValue,
            sellDPS: DPS,
        };
        console.log("sellObj", JSON.stringify(sellObj, null, 2));

        // Call backend API
        // console.log("requesting sell API with", `${API_BASE}/api/sell`);
        
        const resp = await axios.post(`${API_BASE}/api/sell`, sellObj, { headers: { 'Content-Type': 'application/json' } });
        console.log("resp", resp);
        
        console.log(`✅ Stock ${stockName} sell request sent`);
    } catch (error: any) {
        console.error("❌ Error selling stock:", error.message);
        // throw error;
    }
}

