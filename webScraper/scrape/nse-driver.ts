// import { latestQuarterFilingsNse } from "./latestNseFilings.js";
import { fetchNSEFinancialFilings } from './nseFilings';
import { stockDetailsFromScreener } from './stockDetailsFromScreener'
import { recommend } from '../utility/recommend';
import { buyOrSell } from '../dbtransaction/buyorsell';
import { getFreshFilings } from '../utility/freshFiligs';
import { sendResultMessage } from '../comn/sendCompanyNames';
import { sendCompanyResults } from '../comn/sendCompanyResults'
import { addDPSScore } from '../utility/dpsScore';
import { deleteData, storeData } from '../utility/storageUtil';
export async function nseDriver() {
    try {
        console.log('<=====================================================>');
        console.log(`[${new Date().toLocaleString()}] Starting NSE scraper`);
        // Fetch latest quarterly filings from NSE
        const allQuarterlyFilings: any = await fetchNSEFinancialFilings();
        const freshFillings = await getFreshFilings(allQuarterlyFilings);
        console.log("NSE Fresh Fillings Found", freshFillings.length);
        await sendResultMessage(freshFillings as any)
        // const freshFillings: any = [
        //     { symbol: "MEIL", companyName: "Mangal Electrical Industries Ltd" },
        //     // { symbol: "IL&FSENGG", companyName: "IL&FS Engineering and Construction Company Limited" }
        // ];

        const companyDetails = [];

        for (const filing of freshFillings) {
            try {
                // get the quarterly and yearly and other data related to stock
                const comDetail = await stockDetailsFromScreener(filing.symbol);
                // console.log(JSON.stringify(comDetail, 2));
                comDetail['ticker'] = filing?.symbol;
                comDetail['stockName'] = filing?.cmName || filing?.smName;
                if (comDetail) companyDetails.push(comDetail);
            } catch (err) {
                console.log("Error in getting stock details", err);
            }
        }

        // console.log(`Fetched details for ${companyDetails.length} companies with recent filings: ${JSON.stringify(companyDetails, null, 2)}`);
        let stockRecommendation = []
        for (const detail of companyDetails) {
            try {
                // get the recommendation for the stock to buy or sell
                const recomendation = recommend(
                    detail?.yearlyEps, 
                    detail?.quarterlyEps, 
                    detail?.yearlySales, 
                    detail?.quarterlySales, 
                    detail?.yearlyOpProfit,
                    detail?.quarterlyOpProfit,
                    detail?.yearlyPat,
                    detail?.quarterlyPat,
                    detail?.peRatio
                )
                detail["recomendation"] = recomendation;
                stockRecommendation.push(detail);
            } catch (err) {
                console.log("Error finding recommendation", err);
            }
        }
        
        // add dps score
        addDPSScore(stockRecommendation)
        // send stock details
        await sendCompanyResults(stockRecommendation)
        // console.log("stockRecommendation", JSON.stringify(stockRecommendation, null, 2));
        // method to buy or sell
        await buyOrSell(stockRecommendation)
        await deleteData()
        await storeData(stockRecommendation)
        console.log("NSE stockRecommendation", stockRecommendation);
        
        console.log(`[${new Date().toLocaleString()}] Closing NSE scraper`);

        // console.log(`${ JSON.stringify(companyDetails, null, 2) }`);
    } catch (err) {
        console.log("Error in nse driver result", err);
    }
}



// nseDriver()