// buyorsell.ts
import { buyStock } from "./buy-stock";
import { sellStock } from "./sell-stock";
import { StockData } from "./type";


// this method will decide the action to buy or sell the stocks
export async function buyOrSell(stocksArr: StockData[]): Promise<void> {
    try {
        if (!stocksArr || stocksArr.length < 1) {
            throw new Error("Stock array is empty");
        }

        for (const stock of stocksArr) {
            // console.log("stock", JSON.stringify(stock, null, 2));
            
            try {
                const decision = stock?.recommendation?.decision;

                if (decision === "BUY") {
                    await buyStock(stock);
                } else if (decision === "SELL") {
                    await sellStock(stock);
                } else {
                    console.log("Holding this stock", stock);
                }
            } catch (err: any) {
                console.error(err?.stack || err);
            }
        }
    } catch (err) {
        console.log("Error in buy or sell", err);
    }
}
