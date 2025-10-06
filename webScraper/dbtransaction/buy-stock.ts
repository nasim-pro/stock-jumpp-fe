// utils/buyStock.ts
import axios from "axios";
import { StockData } from "./type";
import { API_BASE } from '../../config';

// const API_BASE = "http://172.23.208.32:2024"; // adjust for RN env

/**
 * Buy a new stock by calling backend API
 * @param stockData StockData object
 */
export async function buyStock(stockData: StockData): Promise<void> {
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

        const buyObj = {
            stockName,
            ticker,
            nseBse,
            status: "bought",

            // buy snapshot
            buyPrice: currentPrice,
            buyPeRatio: peRatio,
            buyMarketCap: marketCap,
            buyDebt: debt,
            buyRoe: roe,
            buyRoce: roce,
            buyPromoterHolding: promoterHolding,

            buyQuarters: quarters,
            buyQuarterlySales: quarterlySales,
            buyQuarterlyPat: quarterlyPat,
            buyQuarterlyEps: quarterlyEps,
            buyQuarterlyOpProfit: quarterlyOpProfit,

            buyYears: years,
            buyYearlySales: yearlySales,
            buyYearlyEps: yearlyEps,
            buyDate: new Date().toISOString(),

            buyEPSGrowthRateCagr: recomendation.EPS.oldGrowthRate,
            buyImpliedEPSGrowthRateCagr: recomendation.EPS.newGrowthRate,
            buySalesGrowthRateCagr: recomendation.Sales.oldGrowthRate,
            buySalesImpliedGrowthRateCagr: recomendation.Sales.newGrowthRate,

            buyJumpPercent: recomendation.EPS.jumpPercent,
            buyChangeInEPSGrowthCagr: recomendation.EPS.change,

            buyPeg: recomendation.PEG,
            buyImpliedEPS: recomendation.EPS.impliedValue,
            buyImpliedSales: recomendation.Sales.impliedValue,
            buyDPS: DPS,
        };
        
        console.log("sellObj", JSON.stringify(buyObj, null, 2));
        // Call backend API
        await axios.post(`${API_BASE}/api/buy`, buyObj);
        console.log(`✅ Stock ${stockName} buy request sent`);
    } catch (error: any) {
        console.error("Error buying stock:", error.message);
        // throw error;
    }
}
