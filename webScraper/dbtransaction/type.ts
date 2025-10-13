
 interface GrowthRate {
    oldGrowthRate: number;
    newGrowthRate: number;
    impliedValue?: number;
    jumpPercent?: number;
    change?: number;
}

interface Recommendation {
    EPS: GrowthRate;
    Sales: GrowthRate;
    PEG: number;
    decision: "BUY" | "SELL" | "HOLD" | string; // fallback string for unknown cases
    [key: string]: any;
}

export interface StockData {
    stockName: string;
    ticker?: string;
    peRatio: number;
    currentPrice: number;
    marketCap: number;
    debt: number;
    promoterHolding: number;
    roe: number;
    roce: number;
    quarters: number[];
    quarterlySales: number[];
    quarterlyPat: number[];
    quarterlyEps: number[];
    quarterlyOpProfit: number[];
    years: number[];
    yearlySales: number[];
    yearlyEps: number[];
    recommendation: Recommendation;
    DPS: number;
}
